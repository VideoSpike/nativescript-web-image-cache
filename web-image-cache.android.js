"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_image_cache_common_1 = require("./web-image-cache.common");
var stretch_mapping_1 = require("./and-ts-lib/stretch-mapping");
var helpers_1 = require("./and-ts-lib/helpers");
var application = require("tns-core-modules/application");
var appSettings = require("tns-core-modules/application-settings");
var view_1 = require("tns-core-modules/ui/core/view");
var isInitialized = false;
var roundedProperty = new view_1.Property({
    name: "rounded",
    defaultValue: false,
    valueConverter: view_1.booleanConverter,
    affectsLayout: true
}), placeholderProperty = new view_1.Property({
    name: "placeholder",
    defaultValue: undefined,
    valueConverter: function (v) {
        return v;
    },
    affectsLayout: true
}), placeholderStretchProperty = new view_1.Property({
    name: "placeholderStretch",
    defaultValue: stretch_mapping_1.StretchMapping.get('none'),
    valueConverter: function (v) {
        return v;
    },
    affectsLayout: true
}), stretchProperty = new view_1.Property({
    name: "stretch",
    defaultValue: stretch_mapping_1.StretchMapping.get('none'),
    valueConverter: function (v) {
        return v;
    },
    affectsLayout: true
});
web_image_cache_common_1.srcProperty.register(web_image_cache_common_1.WebImageCommon);
web_image_cache_common_1.isLoadingProperty.register(web_image_cache_common_1.WebImageCommon);
roundedProperty.register(web_image_cache_common_1.WebImageCommon);
placeholderStretchProperty.register(web_image_cache_common_1.WebImageCommon);
stretchProperty.register(web_image_cache_common_1.WebImageCommon);
placeholderProperty.register(web_image_cache_common_1.WebImageCommon);
var WebImage = (function (_super) {
    __extends(WebImage, _super);
    function WebImage() {
        return _super.call(this) || this;
    }
    Object.defineProperty(WebImage.prototype, "android", {
        get: function () {
            return this.nativeView;
        },
        set: function (view) {
            this.nativeView = view;
        },
        enumerable: true,
        configurable: true
    });
    WebImage.prototype.createNativeView = function () {
        var simpleDraweeView = new com.facebook.drawee.view.SimpleDraweeView(this._context);
        simpleDraweeView.getHierarchy().setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
        if (undefined !== this.stretch) {
            helpers_1.Helpers.setNativeStretch(simpleDraweeView.getHierarchy(), this.stretch);
        }
        if (undefined !== this.rounded) {
            helpers_1.Helpers.setRounded(simpleDraweeView.getHierarchy(), this.rounded);
        }
        if (undefined !== this.placeholder) {
            helpers_1.Helpers.setPlaceholder(simpleDraweeView.getHierarchy(), this.placeholder, this.placeholderStretch);
        }
        return simpleDraweeView;
    };
    WebImage.prototype.initNativeView = function () {
        if (undefined !== this.src) {
            helpers_1.Helpers.setSource(this, this.src);
        }
    };
    WebImage.prototype[roundedProperty.getDefault] = function () {
        return false;
    };
    WebImage.prototype[roundedProperty.setNative] = function (value) {
        var simpleDraweeView = this.nativeView;
        helpers_1.Helpers.onRoundedPropertyChanged(simpleDraweeView, value);
    };
    WebImage.prototype[placeholderProperty.getDefault] = function () {
        return undefined;
    };
    WebImage.prototype[placeholderProperty.setNative] = function (value) {
        var simpleDraweeView = this.nativeView;
        helpers_1.Helpers.onPlaceholderPropertyChanged(simpleDraweeView, value, this.placeholderStretch);
    };
    WebImage.prototype[placeholderStretchProperty.getDefault] = function () {
        return "none";
    };
    WebImage.prototype[placeholderStretchProperty.setNative] = function (value) {
        var simpleDraweeView = this.nativeView;
        helpers_1.Helpers.setPlaceholder(simpleDraweeView.getHierarchy(), this.src, value);
    };
    WebImage.prototype[stretchProperty.getDefault] = function () {
        return stretch_mapping_1.StretchMapping.get('none');
    };
    WebImage.prototype[stretchProperty.setNative] = function (value) {
        var simpleDraweeView = this.nativeView;
        helpers_1.Helpers.onStretchPropertyChanged(simpleDraweeView, value);
    };
    WebImage.prototype[web_image_cache_common_1.srcProperty.getDefault] = function () {
        return undefined;
    };
    WebImage.prototype[web_image_cache_common_1.srcProperty.setNative] = function (value) {
        helpers_1.Helpers.onSrcPropertySet(this, value);
    };
    WebImage.prototype[web_image_cache_common_1.isLoadingProperty.getDefault] = function () {
        return "";
    };
    WebImage.prototype[web_image_cache_common_1.isLoadingProperty.setNative] = function (value) {
    };
    return WebImage;
}(web_image_cache_common_1.WebImageCommon));
exports.WebImage = WebImage;
function setCacheLimit(numberOfDays) {
    var noOfSecondsInAMinute = 60, noOfMinutesInAHour = 60, noOfHoursInADay = 24, noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay, noOfSecondsInDays = noOfSecondsADay * numberOfDays, currentSeconds = Math.round(new Date().getTime() / 1000), referenceTime = 0;
    if (true === appSettings.getBoolean("isAppOpenedFirstTime") || undefined === appSettings.getBoolean("isAppOpenedFirstTime") || null === appSettings.getBoolean("isAppOpenedFirstTime")) {
        appSettings.setBoolean("isAppOpenedFirstTime", false);
        com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
        appSettings.setNumber("cacheTimeReference", currentSeconds);
    }
    else {
        referenceTime = appSettings.getNumber("cacheTimeReference");
        if (null === referenceTime || undefined === referenceTime) {
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
        else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
            com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
    }
}
exports.setCacheLimit = setCacheLimit;
function initialize() {
    com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
}
exports.initialize = initialize;
function clearCache() {
    com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
}
exports.clearCache = clearCache;
function initializeOnAngular() {
    if (false === isInitialized) {
        var _elementRegistry = require("nativescript-angular/element-registry");
        _elementRegistry.registerElement("WebImage", function () {
            return require("nativescript-web-image-cache").WebImage;
        });
        com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
        isInitialized = true;
    }
}
exports.initializeOnAngular = initializeOnAngular;
//# sourceMappingURL=web-image-cache.android.js.map