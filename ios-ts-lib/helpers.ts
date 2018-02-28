/// <reference path="./types.d.ts" />

import * as types from 'tns-core-modules/utils/types';
import * as utils from 'tns-core-modules/utils/utils';
import * as fs from 'tns-core-modules/file-system';
import * as appSettings from 'tns-core-modules/application-settings';
import * as imageSource from 'tns-core-modules/image-source';



declare class UIViewContentMode {
  static UIViewContentModeScaleToFill: any;
  static UIViewContentModeTopLeft: any;
  static UIViewContentModeScaleAspectFit: any;
  static UIViewContentModeScaleAspectFill: any;
}



export class Helpers {
  public static onStretchPropertyChanged(nativeView, value) {

    switch (value) {
      case "aspectFit":
        nativeView.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        break;
      case "aspectFill":
        nativeView.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFill;
        break;
      case "fill":
        nativeView.contentMode = UIViewContentMode.UIViewContentModeScaleToFill;
        break;
      case "none":
      default:
        nativeView.contentMode = UIViewContentMode.UIViewContentModeTopLeft;
        break;
    }
  }

  public static onSrcPropertySet(nativeWrapper, value) {


    let image = nativeWrapper,
      placeholder = nativeWrapper.placeholder,
      placeholderImage = this.getPlaceholderUIImage(placeholder);
    if (types.isString(value)) {
      value = value.trim();
      if (0 === value.indexOf("http")) {
        image.isLoading = true;
        image.nativeView.sd_setImageWithURLPlaceholderImageCompleted(value, placeholderImage, function() {
          image.isLoading = false;

        });
      } else if (utils.isFileOrResourcePath(value)) {
        image.isLoading = true;
        let source: any = new imageSource.ImageSource();

        if (0 === value.indexOf(utils.RESOURCE_PREFIX)) {
          let path = value.substr(utils.RESOURCE_PREFIX.length);
          source.fromResource(path).then(function() {
            image.isLoading = false;
            image.nativeView.image = source.ios || source.nativeView;
          });
        } else {
          source.fromFile(value).then(function() {
            image.isLoading = false;
            image.nativeView.image = source.ios || source.nativeView;
          });
        }

      }
      image.requestLayout();
    }

  }

  public static getPlaceholderUIImage(value) {
    if (types.isString(value)) {
      if (utils.isFileOrResourcePath(value)) {
        return imageSource.fromFileOrResource(value).ios;
      }
    }

    return undefined;
  }

  // public static clearCache() {
  //   let imageCache = SDImageCache.sharedImageCache();
  //   imageCache.clearMemory();
  //   imageCache.clearDisk();
  // }

  // public static setCacheLimit(numberOfDays) {
  //
  //   let noOfSecondsInAMinute = 60,
  //     noOfMinutesInAHour = 60,
  //     noOfHoursInADay = 24,
  //     noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay,
  //     noOfSecondsInDays = noOfSecondsADay * numberOfDays,
  //     currentSeconds = Math.round(new Date().getTime() / 1000),
  //     referenceTime = 0;
  //
  //
  //   if (true === appSettings.getBoolean("isAppOpenedFirstTime") || undefined === appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
  //     appSettings.setBoolean("isAppOpenedFirstTime", false);
  //     this.clearCache();
  //     appSettings.setNumber("cacheTimeReference", currentSeconds);
  //   } else {
  //     referenceTime = appSettings.getNumber("cacheTimeReference");
  //     if (null == referenceTime || undefined === referenceTime) {
  //       appSettings.setNumber("cacheTimeReference", currentSeconds);
  //     } else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
  //       this.clearCache();
  //       appSettings.setNumber("cacheTimeReference", currentSeconds);
  //     }
  //   }
  // }


}
