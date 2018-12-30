"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_image_cache_common_1 = require("./web-image-cache.common");
var view_1 = require("tns-core-modules/ui/core/view");
var appSettings = require("tns-core-modules/application-settings");
var helpers_1 = require("./ios-ts-lib/helpers");
var enums = require("tns-core-modules/ui/enums");
var placeholderProperty = new view_1.Property({
    name: "placeholder",
    defaultValue: undefined,
    affectsLayout: true
}), stretchProperty = new view_1.Property({
    name: "stretch",
    defaultValue: "none",
    affectsLayout: true
});
web_image_cache_common_1.srcProperty.register(web_image_cache_common_1.WebImageCommon);
web_image_cache_common_1.isLoadingProperty.register(web_image_cache_common_1.WebImageCommon);
placeholderProperty.register(web_image_cache_common_1.WebImageCommon);
stretchProperty.register(web_image_cache_common_1.WebImageCommon);
var WebImage = (function (_super) {
    __extends(WebImage, _super);
    function WebImage() {
        return _super.call(this) || this;
    }
    WebImage.prototype.createNativeView = function () {
        var imageView = new UIImageView();
        imageView.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        imageView.clipsToBounds = true;
        imageView.userInteractionEnabled = true;
        return imageView;
    };
    Object.defineProperty(WebImage.prototype, "ios", {
        get: function () {
            return this.nativeView;
        },
        set: function (view) {
            this.nativeView = view;
        },
        enumerable: true,
        configurable: true
    });
    WebImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var utils = require("utils/utils"), width = utils.layout.getMeasureSpecSize(widthMeasureSpec), widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec), height = utils.layout.getMeasureSpecSize(heightMeasureSpec), heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec), nativeWidth = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.width : 0) : 0, nativeHeight = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.height : 0) : 0, measureWidth = Math.max(nativeWidth, this.minWidth), measureHeight = Math.max(nativeHeight, this.minHeight), finiteWidth = widthMode !== utils.layout.UNSPECIFIED, finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = this.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch), resultW = Math.floor(nativeWidth * scale.width), resultH = Math.floor(nativeHeight * scale.height);
            measureWidth = finiteWidth ? Math.min(resultW, width) : resultW;
            measureHeight = finiteHeight ? Math.min(resultH, height) : resultH;
            var trace = require("trace");
            trace.write("Image stretch: " + this.stretch +
                ", nativeWidth: " + nativeWidth +
                ", nativeHeight: " + nativeHeight, trace.categories.Layout);
        }
        var view = require("ui/core/view");
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    WebImage.prototype.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
        var scaleW = 1, scaleH = 1;
        if ((imageStretch === enums.Stretch.aspectFill || imageStretch === enums.Stretch.aspectFit || imageStretch === enums.Stretch.fill) &&
            (widthIsFinite || heightIsFinite)) {
            scaleW = (nativeWidth > 0) ? measureWidth / nativeWidth : 0;
            scaleH = (nativeHeight > 0) ? measureHeight / nativeHeight : 0;
            if (!widthIsFinite) {
                scaleW = scaleH;
            }
            else if (!heightIsFinite) {
                scaleH = scaleW;
            }
            else {
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
    };
    WebImage.prototype[placeholderProperty.getDefault] = function () {
        return undefined;
    };
    WebImage.prototype[placeholderProperty.setNative] = function (value) {
    };
    WebImage.prototype[stretchProperty.getDefault] = function () {
        return "none";
    };
    WebImage.prototype[stretchProperty.setNative] = function (value) {
        helpers_1.Helpers.onStretchPropertyChanged(this.nativeView, value);
    };
    WebImage.prototype[web_image_cache_common_1.isLoadingProperty.getDefault] = function () {
        return false;
    };
    WebImage.prototype[web_image_cache_common_1.isLoadingProperty.setNative] = function (value) {
    };
    WebImage.prototype[web_image_cache_common_1.srcProperty.getDefault] = function () {
    };
    WebImage.prototype[web_image_cache_common_1.srcProperty.setNative] = function (value) {
        helpers_1.Helpers.onSrcPropertySet(this, value);
    };
    return WebImage;
}(web_image_cache_common_1.WebImageCommon));
exports.WebImage = WebImage;
function setCacheLimit(numberOfDays) {
    var noOfSecondsInAMinute = 60, noOfMinutesInAHour = 60, noOfHoursInADay = 24, noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay, noOfSecondsInDays = noOfSecondsADay * numberOfDays, currentSeconds = Math.round(new Date().getTime() / 1000), referenceTime = 0;
    if (true === appSettings.getBoolean("isAppOpenedFirstTime") || undefined === appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
        appSettings.setBoolean("isAppOpenedFirstTime", false);
        this.clearCache();
        appSettings.setNumber("cacheTimeReference", currentSeconds);
    }
    else {
        referenceTime = appSettings.getNumber("cacheTimeReference");
        if (null == referenceTime || undefined === referenceTime) {
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
        else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
            this.clearCache();
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
    }
}
exports.setCacheLimit = setCacheLimit;
function clearCache() {
    var imageCache = SDImageCache.sharedImageCache();
    imageCache.clearMemory();
    imageCache.clearDiskOnCompletion(function () { });
}
exports.clearCache = clearCache;
function initializeOnAngular() {
    throw new Error("'initializeOnAngular' has been removed from 'nativescript-web-image-cache', see its readme for details!");
}
exports.initializeOnAngular = initializeOnAngular;
//# sourceMappingURL=web-image-cache.ios.js.map