/// <reference path='./ios-ts-lib/types.d.ts'/>

import { WebImageCommon, srcProperty, isLoadingProperty } from './web-image-cache.common';

import { View, Property, booleanConverter } from 'tns-core-modules/ui/core/view';
import * as appSettings from 'tns-core-modules/application-settings';

import { Helpers as helpers } from './ios-ts-lib/helpers';

import * as enums from 'tns-core-modules/ui/enums';

let isInitialized: boolean = false;

declare class UIImageView {
  public contentMode: any;
  public clipsToBounds: any;
  public userInteractionEnabled: any;
}


declare class UIViewContentMode {
  static UIViewContentModeScaleToFill: any;
  static UIViewContentModeTopLeft: any;
  static UIViewContentModeScaleAspectFit: any;
  static UIViewContentModeScaleAspectFill: any;
}


let placeholderProperty = new Property<WebImageCommon, string>({
  name: "placeholder",
  defaultValue: undefined,
  affectsLayout: true
}),
  stretchProperty = new Property<WebImageCommon, string>({
    name: "stretch",
    defaultValue: "none",
    affectsLayout: true
  });



srcProperty.register(WebImageCommon);
isLoadingProperty.register(WebImageCommon);
placeholderProperty.register(WebImageCommon);
stretchProperty.register(WebImageCommon);


export class WebImage extends WebImageCommon {


  constructor() {
    super();
  }


  createNativeView(): any {
    let imageView = new UIImageView();
    imageView.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
    imageView.clipsToBounds = true;
    imageView.userInteractionEnabled = true;
    return imageView;
  }


  public get ios(): any {
    return this.nativeView;
  }

  public set ios(view) {
    this.nativeView = view;
  }

  onMeasure(widthMeasureSpec, heightMeasureSpec) {
    let utils = require("utils/utils"),
      width = utils.layout.getMeasureSpecSize(widthMeasureSpec),
      widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec),
      height = utils.layout.getMeasureSpecSize(heightMeasureSpec),
      heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec),
      nativeWidth = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.width : 0) : 0,
      nativeHeight = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.height : 0) : 0,
      measureWidth = Math.max(nativeWidth, this.minWidth as number),
      measureHeight = Math.max(nativeHeight, this.minHeight as number),
      finiteWidth = widthMode !== utils.layout.UNSPECIFIED,
      finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
    if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
      let scale = this.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch),
        resultW = Math.floor(nativeWidth * scale.width),
        resultH = Math.floor(nativeHeight * scale.height);
      measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
      measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;
      let trace = require("trace");
      trace.write("Image stretch: " + this.stretch +
        ", nativeWidth: " + nativeWidth +
        ", nativeHeight: " + nativeHeight, trace.categories.Layout);
    }
    let view = require("ui/core/view");
    let widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
    let heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
    this.setMeasuredDimension(widthAndState, heightAndState);
  }

  computeScaleFactor(measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
    let scaleW = 1,
      scaleH = 1;
    if ((imageStretch === enums.Stretch.aspectFill || imageStretch === enums.Stretch.aspectFit || imageStretch === enums.Stretch.fill) &&
      (widthIsFinite || heightIsFinite)) {
      scaleW = (nativeWidth > 0) ? measureWidth / nativeWidth : 0;
      scaleH = (nativeHeight > 0) ? measureHeight / nativeHeight : 0;
      if (!widthIsFinite) {
        scaleW = scaleH;
      } else if (!heightIsFinite) {
        scaleH = scaleW;
      } else {
        switch (imageStretch) {
          case enums.Stretch.aspectFit:
            scaleH = scaleW < scaleH ? scaleW : scaleH;
            scaleW = scaleH;
            break;
          case enums.Stretch.aspectFill:
            scaleH = scaleW > scaleH ? scaleW : scaleH;
            scaleW = scaleH;
            break;
        }
      }
    }
    return {
      width: scaleW,
      height: scaleH
    };
  }


  [placeholderProperty.getDefault]() {
    return undefined;
  }

  [placeholderProperty.setNative](value) {
    // do nothing
  }

  [stretchProperty.getDefault]() {
    return "none";
  }

  [stretchProperty.setNative](value) {
    helpers.onStretchPropertyChanged(this.nativeView, value);
  }

  [isLoadingProperty.getDefault]() {
    return false;
  }

  [isLoadingProperty.setNative](value) {
    // do nothing
  }

  [srcProperty.getDefault]() {

  }

  [srcProperty.setNative](value) {
    helpers.onSrcPropertySet(this, value);
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


  if (true === appSettings.getBoolean("isAppOpenedFirstTime") || undefined === appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
    appSettings.setBoolean("isAppOpenedFirstTime", false);
    this.clearCache();
    appSettings.setNumber("cacheTimeReference", currentSeconds);
  } else {
    referenceTime = appSettings.getNumber("cacheTimeReference");
    if (null == referenceTime || undefined === referenceTime) {
      appSettings.setNumber("cacheTimeReference", currentSeconds);
    } else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
      this.clearCache();
      appSettings.setNumber("cacheTimeReference", currentSeconds);
    }
  }
}

export function clearCache() {
  let imageCache = SDImageCache.sharedImageCache();
  imageCache.clearMemory();
  imageCache.clearDisk();
}

export function initializeOnAngular() {

  if (false === isInitialized) {
    let _elementRegistry = require("nativescript-angular/element-registry");

    _elementRegistry.registerElement("WebImage", function() {
      return require("nativescript-web-image-cache").WebImage;
    });
    isInitialized = true;
  }
}

// export { helpers.setCacheLimit };
