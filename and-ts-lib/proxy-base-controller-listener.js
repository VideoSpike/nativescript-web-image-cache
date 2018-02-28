"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProxyBaseControllerListener = com.facebook.drawee.controller.BaseControllerListener.extend({
    _NSCachedImage: undefined,
    setNSCachedImage: function (img) {
        this._NSCachedImage = img;
    },
    onFinalImageSet: function (id, imageInfo, anim) {
        if (undefined !== this._NSCachedImage) {
            this._NSCachedImage.isLoading = false;
        }
    },
    onIntermediateImageSet: function (id, imageInfo) {
    },
    onFailure: function (id, throwable) {
    }
});
exports.ProxyBaseControllerListener = ProxyBaseControllerListener;
//# sourceMappingURL=proxy-base-controller-listener.js.map