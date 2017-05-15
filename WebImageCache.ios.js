/**
 * Created by sumeet on 20-05-2016.
 */
var imageCommon = require("./WebImageCache-common"),
    enums = require("ui/enums"),
    types = require("utils/types"),
    dependencyObservable = require("ui/core/dependency-observable"),
    utils = require("utils/utils"),
    imageSource = require("image-source"),
    appSettings = require("application-settings"),
    isInitialized = false;


global.moduleMerge(imageCommon, exports);



var viewModule = require("ui/core/view");

var placeholderProperty = new viewModule.Property({name:"placeholder",defaultValue:undefined,affectsLayout:true}),
    stretchProperty = new viewModule.Property({name:"stretch",defaultValue:"none",affectsLayout:true});


placeholderProperty.register(imageCommon.WebImage);
stretchProperty.register(imageCommon.WebImage);



function onStretchPropertyChanged(nativeView,value) {

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





function onSrcPropertySet(nativeWrapper,value) {


    var image = nativeWrapper,
        placeholder = nativeWrapper.placeholder,
        placeholderImage = getPlaceholderUIImage(placeholder);

    if (types.isString(value)) {
        value = value.trim();
        if (0 === value.indexOf("http")) {
            image.isLoading = true;
            image.nativeView.sd_setImageWithURLPlaceholderImageCompleted(value,placeholderImage, function () {
                image.isLoading = false;

            });
        } else if (utils.isFileOrResourcePath(value)) {
            image.isLoading = true;
            var source = new imageSource.ImageSource();

            if (0 === value.indexOf(utils.RESOURCE_PREFIX)) {
                var path = value.substr(utils.RESOURCE_PREFIX.length);
                source.fromResource(path).then(function () {
                    image.isLoading = false;
                    image.nativeView.image = source.ios || source.nativeView;
                });
            } else {
                source.fromFile(value).then(function () {
                    image.isLoading = false;
                    image.nativeView.image = source.ios || source.nativeView;
                });
            }

        }
        image.requestLayout();
    }

}

function getPlaceholderUIImage(value){
        if (types.isString(value)){
               if (utils.isFileOrResourcePath(value)) {
                   return  imageSource.fromFileOrResource(value).ios;
                   }
           }

           return undefined;
}



var WebImage = (function (_super) {

    __extends(WebImage, _super);
    function WebImage() {
        _super.call(this);
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
        enumerable: true,
        configurable: true
    });


    WebImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var utils = require("utils/utils");
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.width : 0) : 0;
        var nativeHeight = this.nativeView ? (this.nativeView.image ? this.nativeView.image.size.height : 0) : 0;
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

    WebImage.prototype[placeholderProperty.getDefault] = function(){
      return undefined;
    };

    WebImage.prototype[placeholderProperty.setNative] = function(value){
        //do nothing
    };

    WebImage.prototype[stretchProperty.getDefault] = function(){
        return "none";
    };

    WebImage.prototype[stretchProperty.setNative] = function(value){
        onStretchPropertyChanged(this.nativeView,value);
    };

    WebImage.prototype[imageCommon.isLoadingProperty.getDefault] = function(){
        return false;
    };

    WebImage.prototype[imageCommon.isLoadingProperty.setNative] = function(value){
      //do nothing
    };

    WebImage.prototype[imageCommon.srcProperty.getDefault] = function(){

    };

    WebImage.prototype[imageCommon.srcProperty.setNative] = function(value){
        onSrcPropertySet(this,value);
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
        clearCache();
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