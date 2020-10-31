/// <reference path="./and-ts-lib/types.d.ts" />

import { WebImageCommon, srcProperty, isLoadingProperty } from './web-image-cache.common';
import { StretchMapping as stretchMap } from './and-ts-lib/stretch-mapping';
import { Helpers as helpers } from './and-ts-lib/helpers';

import * as application from 'tns-core-modules/application';
import * as appSettings from 'tns-core-modules/application-settings';
import { Property, booleanConverter } from 'tns-core-modules/ui/core/view';

let roundedProperty = new Property<WebImageCommon, boolean>({
  name: "rounded",
  defaultValue: false,
  valueConverter: booleanConverter,
  affectsLayout: true
}),
  placeholderProperty = new Property<WebImageCommon, string>({
    name: "placeholder",
    defaultValue: undefined,
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  }),
  placeholderStretchProperty = new Property<WebImageCommon, string>({
    name: "placeholderStretch",
    defaultValue: stretchMap.get('none'),
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  }),
  stretchProperty = new Property<WebImageCommon, string>({
    name: "stretch",
    defaultValue: stretchMap.get('none'),
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  });

srcProperty.register(WebImageCommon);
isLoadingProperty.register(WebImageCommon);
roundedProperty.register(WebImageCommon);
placeholderStretchProperty.register(WebImageCommon);
stretchProperty.register(WebImageCommon);
placeholderProperty.register(WebImageCommon);

export class WebImage extends WebImageCommon {

  public rounded: boolean;
  public placeholder: string;
  public placeholderStretch: string;

  constructor() {
    super();
  }

  public get android(): any {
    return this.nativeView;
  }

  public set android(view) {
    this.nativeView = view;
  }
  createNativeView(): any {
    let simpleDraweeView = new com.facebook.drawee.view.SimpleDraweeView(this._context);
    simpleDraweeView.getHierarchy().setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
    if (undefined !== this.stretch) {
      helpers.setNativeStretch(simpleDraweeView.getHierarchy(), this.stretch);
    }
    if (undefined !== this.rounded) {
      helpers.setRounded(simpleDraweeView.getHierarchy(), this.rounded);
    }
    if (undefined !== this.placeholder) {
      helpers.setPlaceholder(simpleDraweeView.getHierarchy(), this.placeholder, this.placeholderStretch);
    }
    return simpleDraweeView;
  }

  initNativeView() {
    if (undefined !== this.src) {
      helpers.setSource(this, this.src);
    }
  }

  [roundedProperty.getDefault]() {
    return false;
  }

  [roundedProperty.setNative](value) {
    let simpleDraweeView = this.nativeView;
    helpers.onRoundedPropertyChanged(simpleDraweeView, value);
  }

  [placeholderProperty.getDefault]() {
    return undefined;
  }
  [placeholderProperty.setNative](value) {
    let simpleDraweeView = this.nativeView;

    helpers.onPlaceholderPropertyChanged(simpleDraweeView, value, this.placeholderStretch);
  }

  [placeholderStretchProperty.getDefault]() {
    return "none";
  }

  [placeholderStretchProperty.setNative](value) {
    let simpleDraweeView = this.nativeView;
    helpers.setPlaceholder(simpleDraweeView.getHierarchy(), this.src, value);
  }

  [stretchProperty.getDefault]() {
    return stretchMap.get('none');
  }

  [stretchProperty.setNative](value) {
    let simpleDraweeView = this.nativeView;
    helpers.onStretchPropertyChanged(simpleDraweeView, value);
  }

  [srcProperty.getDefault]() {
    return undefined;
  }

  [srcProperty.setNative](value) {
    helpers.onSrcPropertySet(this, value);
  }

  [isLoadingProperty.getDefault]() {
    return "";
  }

  [isLoadingProperty.setNative](value) {
    // do nothing

  }

}

export function setCacheLimit(numberOfDays) {

  let noOfSecondsInAMinute = 60,
    noOfMinutesInAHour = 60,
    noOfHoursInADay = 24,
    noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay,
    noOfSecondsInDays = noOfSecondsADay * numberOfDays,
    currentSeconds = Math.round(new Date().getTime() / 1000),
    referenceTime = 0;


  if (true === appSettings.getBoolean("isAppOpenedFirstTime") || undefined === appSettings.getBoolean("isAppOpenedFirstTime") || null === appSettings.getBoolean("isAppOpenedFirstTime")) {
    appSettings.setBoolean("isAppOpenedFirstTime", false);
    com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
    appSettings.setNumber("cacheTimeReference", currentSeconds);
  } else {
    referenceTime = appSettings.getNumber("cacheTimeReference");
    if (null === referenceTime || undefined === referenceTime) {
      appSettings.setNumber("cacheTimeReference", currentSeconds);
    } else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
      com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
      appSettings.setNumber("cacheTimeReference", currentSeconds);
    }
  }
}
export function initialize() {
  com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
}

export function clearCache() {
  com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
}

export function initializeOnAngular() {
  throw new Error("'initializeOnAngular' has been removed from 'nativescript-web-image-cache', see its readme for details!");
}

export function preFetchImage(urls: Array<string>) : Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!urls || !Array.isArray(urls) || urls.length<1) {
      reject(`preFetchImage: param should be array of urls`);
    } else {
      let counter:number=0;

      urls.forEach((url) => {
        const uri = android.net.Uri.parse(url);
        const prefetchSubscriber = com.facebook.datasource.BaseDataSubscriber.extend({
          onNewResultImpl(dataSource) {
            counter++;
            if (counter===urls.length) { resolve(); }
          },
          onFailureImpl(dataSource) {
            counter++;
            if (counter===urls.length) {
              reject(`preFetchImage: failed to prefetch ${uri.toString()}`);
            }
          }
        });

        /*
          prefetchToDiskCache() --> load to disk slower but less CPU
          prefetchToBitmapCache --> load to memory cache, faster but more CPU
        */
        let dataSource = com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().prefetchToBitmapCache(
          com.facebook.imagepipeline.request.ImageRequest.fromUri(uri),
          application.android.context
        );

        dataSource.subscribe(
          new prefetchSubscriber(),
          com.facebook.common.executors.UiThreadImmediateExecutorService.getInstance()
        );
      });
    }
  });
}
