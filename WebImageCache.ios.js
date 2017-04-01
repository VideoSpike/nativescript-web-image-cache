/**
 * Created by sumeet on 20-05-2016.
 */
var imageCommon = require("./WebImageCache-common"),
    enums = require("ui/enums"),
    types = require("utils/types"),
    STRETCH = "stretch",
    dependencyObservable = require("ui/core/dependency-observable"),
    proxy = require("ui/core/proxy"),
    IMAGE = "WebImage",
    utils = require("utils/utils"),
    imageSource = require("image-source"),
    appSettings = require("application-settings"),
    isInitialized = false,
    AffectsLayout = dependencyObservable.PropertyMetadataSettings.AffectsLayout;
global.moduleMerge(imageCommon, exports);

function onStretchPropertyChanged(data) {

    var image = data.object;
    switch (data.newValue) {
        case enums.Stretch.aspectFit:
            image.ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
            break;
        case enums.Stretch.aspectFill:
            image.ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFill;
            break;
        case enums.Stretch.fill:
            image.ios.contentMode = UIViewContentMode.UIViewContentModeScaleToFill;
            break;
        case enums.Stretch.none:
        default:
            image.ios.contentMode = UIViewContentMode.UIViewContentModeTopLeft;
            break;
    }
}


function onSrcPropertySet(data) {


    var image = data.object;
    var value = data.newValue;

    if (types.isString(value)) {
        value = value.trim();
        if (0 === value.indexOf("http")) {
            image.isLoading = true;
            image["_url"] = value;
            image.ios.sd_setImageWithURLCompleted(value, function () {
                image.isLoading = false;

            });
        } else if (utils.isFileOrResourcePath(value)) {
            image.isLoading = true;
            var source = new imageSource.ImageSource();

            if (0 === value.indexOf(utils.RESOURCE_PREFIX)) {
                var path = value.substr(utils.RESOURCE_PREFIX.length);
                source.fromResource(path).then(function () {
                    image.isLoading = false;
                    image.ios.image = source.ios;
                });
            } else {
                source.fromFile(value).then(function () {
                    image.isLoading = false;
                    image.ios.image = source.ios;
                });
            }

        }
        image.requestLayout();
    }

}


imageCommon.WebImage.srcProperty.metadata.onSetNativeValue = onSrcPropertySet;
//imageCommon.SDWebImage.stretchProperty.metadata.onSetNativeValue = onStretchPropertyChanged;

var WebImage = (function (_super) {

    __extends(WebImage, _super);
    function WebImage() {
        _super.call(this);
        this._ios = new UIImageView();
        this._ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        this._ios.clipsToBounds = true;
        this._ios.userInteractionEnabled = true;
    }


    Object.defineProperty(WebImage.prototype, STRETCH, {
        get: function () {
            return this._getValue(WebImage.stretchProperty);
        },
        set: function (value) {
            this._setValue(WebImage.stretchProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WebImage.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(enums.Stretch.aspectFit, AffectsLayout, onStretchPropertyChanged));

    Object.defineProperty(WebImage.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });


    WebImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var utils = require("utils/utils");
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this._ios ? (this._ios.image ? this._ios.image.size.width : 0) : 0;
        var nativeHeight = this._ios ? (this._ios.image ? this._ios.image.size.height : 0) : 0;
        var measureWidth = Math.max(nativeWidth, this.minWidth);
        var measureHeight = Math.max(nativeHeight, this.minHeight);
        var finiteWidth = widthMode !== utils.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = WebImage.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch);
            var resultW = Math.floor(nativeWidth * scale.width);
            var resultH = Math.floor(nativeHeight * scale.height);
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
    WebImage.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
        var scaleW = 1;
        var scaleH = 1;
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
        return {width: scaleW, height: scaleH};
    };

    return WebImage;
}(imageCommon.WebImage));

function clearCache() {
    var imageCache = SDImageCache.sharedImageCache();
    imageCache.clearMemory();
    imageCache.clearDisk();
}



function setCacheLimit(numberOfDays) {

    var noOfSecondsInAMinute = 60,
        noOfMinutesInAHour = 60,
        noOfHoursInADay = 24,
        noOfSecondsADay=noOfSecondsInAMinute*noOfMinutesInAHour*noOfHoursInADay,
        noOfSecondsInDays = noOfSecondsADay * numberOfDays,
        currentSeconds = Math.round(new Date().getTime() / 1000),
        referenceTime = 0;


    if (true == appSettings.getBoolean("isAppOpenedFirstTime") || undefined == appSettings.getBoolean("isAppOpenedFirstTime") || null == appSettings.getBoolean("isAppOpenedFirstTime")) {
        appSettings.setBoolean("isAppOpenedFirstTime", false);
        com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
        appSettings.setNumber("cacheTimeReference", currentSeconds);
    } else {
        referenceTime = appSettings.getNumber("cacheTimeReference");
        if (null == referenceTime || undefined == referenceTime) {
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        } else if ((currentSeconds - referenceTime) > noOfSecondsInDays) {
            clearCache();
            appSettings.setNumber("cacheTimeReference", currentSeconds);
        }
    }
}


exports.setCacheLimit = setCacheLimit;
exports.WebImage = WebImage;
exports.clearCache = clearCache;
exports.initializeOnAngular = function(){
  
    if(false === isInitialized){
        var _elementRegistry = require("nativescript-angular/element-registry");

        _elementRegistry.registerElement("WebImage", function () {
            return require("nativescript-web-image-cache").WebImage;
        });
        isInitialized = true;
    }
};