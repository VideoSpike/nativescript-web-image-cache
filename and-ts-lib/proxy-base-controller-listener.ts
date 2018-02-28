/// <reference path="./types.d.ts" />


// export class ProxyBaseControllerListener extends com.facebook.drawee.controller.BaseControllerListener {
//   _NSCachedImage: any = undefined;
//
//   setNSCachedImage(img: any) {
//     this._NSCachedImage = img;
//   }
//
//   onFinalImageSet(id: any, imageInfo: any, anim: any) {
//     if (undefined !== this._NSCachedImage) {
//       this._NSCachedImage.isLoading = false;
//     }
//   }
//   onIntermediateImageSet(id: any, imageInfo: any) {
//
//   }
//   onFailure(id: any, throwable: any) {
//
//   }
// }

let ProxyBaseControllerListener = com.facebook.drawee.controller.BaseControllerListener.extend({
  _NSCachedImage: undefined,
  setNSCachedImage: function(img) {
    this._NSCachedImage = img;
  },
  onFinalImageSet: function(id, imageInfo, anim) {
    if (undefined !== this._NSCachedImage) {
      this._NSCachedImage.isLoading = false;
    }
  },
  onIntermediateImageSet: function(id, imageInfo) {

  },
  onFailure: function(id, throwable) {

  }
});

export { ProxyBaseControllerListener };
