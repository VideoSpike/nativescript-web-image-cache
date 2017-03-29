/**
 * Created by sumeet on 17-06-2016.
 */
var imageCommon = require("./WebImageCache-common"),
    application = require("application"),
    dependencyObservable = require("ui/core/dependency-observable"),
    proxy = require("ui/core/proxy"),
    enums = require("ui/enums"),
    types = require("utils/types"),
    IMAGE = "WebImage",
    utils = require("utils/utils"),
    STRETCH = "stretch",
    fs=require("file-system"),
    isInitialized = false,
    appSettings = require("application-settings"),
    AffectsLayout = dependencyObservable.PropertyMetadataSettings.AffectsLayout;

global.moduleMerge(imageCommon, exports);



var ProxyBaseControllerListener=com.facebook.drawee.controller.BaseControllerListener.extend({
    _NSCachedImage:undefined,
    setNSCachedImage:function(img){
        this._NSCachedImage=img;
    },
    onFinalImageSet:function(id,imageInfo,anim){
        if(undefined!=this._NSCachedImage){
            this._NSCachedImage.isLoading=false;
        }
    },
    onIntermediateImageSet:function(id,imageInfo){

    },onFailure:function(id,throwable){

    }
});




function onStretchPropertyChanged(data) {

    var image = data.object;
    if(!image.android){
        return;
    }

    var draweeHierarchy=image.android.getHierarchy();

    setNativeStretch(draweeHierarchy,data.newValue);
}

function setNativeStretch(draweeHierarchy,stretch){
    switch (stretch) {
        case enums.Stretch.aspectFit:
            draweeHierarchy.setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_CENTER);
            break;
        case enums.Stretch.aspectFill:
            draweeHierarchy.setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER_CROP);
            break;
        case enums.Stretch.fill:
            draweeHierarchy.setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_XY);
            break;
        case enums.Stretch.none:
        default:
            draweeHierarchy.setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
            break;
    }
}


function onSrcPropertySet(data){
    var image = data.object,
        value=data.newValue;
    if(!image.android){
        return;
    }

    setSource(image,value);

}


function onPlaceholderPropertyChanged(image){
    var image = data.object,
        value = data.newValue,
        genericDraweeHierarchy = null,
        imageIdentifier = "",
        drawable = null;

    if(!image.android){
        return;
    }

    if (types.isString(value)) {
        value = value.trim();
        if(0===value.indexOf("~/")){

            imageIdentifier = getAbsolutePathOfFile(value);
            drawable = android.graphics.drawable.Drawable.createFromPath(imageIdentifier);

        }else if(0==value.indexOf("res")){

            imageIdentifier = getResourceIDOfFile(value);
            drawable =  utils.ad.getApplicationContext().getResources().getDrawable(imageIdentifier);
        }

    }

    if(null!==drawable) {
        genericDraweeHierarchy = image.android.getHierarchy();
        hierarchy.setPlaceholderImage(/*Drawable*/);
    }

}

function getAbsolutePathOfFile(value){
    var fileName="";
    fileName=fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
    return "file:"+ fileName;
}

function getResourceIDOfFile(fileName){
    var res = utils.ad.getApplicationContext().getResources();
    var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
    var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
    return "res:/" + identifier;
}



function setSource(image,value){
    image.android.setImageURI(null, null);

    if (types.isString(value)) {
        value = value.trim();
        if(utils.isFileOrResourcePath(value) || 0===value.indexOf("http")){
            image.isLoading=true;
            var fileName="";
            if(0===value.indexOf("~/")){

                fileName=getAbsolutePathOfFile(value);

                //fileName=fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                //fileName="file:"+ fileName;
            }else if(0==value.indexOf("res")){

               fileName=getResourceIDOfFile(value);
               // fileName=value;
               // var res = utils.ad.getApplicationContext().getResources();
               // var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
               // var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
               // fileName="res:/" + identifier;
            }else if(0===value.indexOf("http")){
                image.isLoading=true;
                fileName=value;
            }

            image.android.setImageURI(android.net.Uri.parse(fileName), null);

            var controllerListener=new ProxyBaseControllerListener();
            controllerListener.setNSCachedImage(image);


            var controller = com.facebook.drawee.backends.pipeline.Fresco.newDraweeControllerBuilder().
                setControllerListener(controllerListener)
                .setUri(android.net.Uri.parse(fileName))
                .build();
            image.android.setController(controller);

            image.requestLayout();

        }else{
            throw new Error("Path \"" + "\" is not a valid file or resource.");
        }
    }

}


imageCommon.WebImage.srcProperty.metadata.onSetNativeValue = onSrcPropertySet;
imageCommon.WebImage.placeholderProperty.metadata.onSetNativeValue = onPlaceholderPropertyChanged;



var WebImage=(function (_super) {



    __extends(WebImage,_super);



    Object.defineProperty(WebImage.prototype,STRETCH,{
        get: function () {
            return this._getValue(WebImage.stretchProperty);
        },
        set: function (value) {
            this._setValue(WebImage.stretchProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WebImage.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER, AffectsLayout,onStretchPropertyChanged));

    function WebImage(){
        _super.apply(this,arguments);
    }

    WebImage.prototype._createUI = function(){
        this._android = new com.facebook.drawee.view.SimpleDraweeView(this._context);
        this._android.getHierarchy().setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
        if(undefined!==this.src){
            setSource(this,this.src);
        }
        if(undefined!==this.stretch){
            setNativeStretch(this._android.getHierarchy(),this.stretch);
        }
    };

    Object.defineProperty(WebImage.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return WebImage;
}(imageCommon.WebImage));



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

function initiialize(){
    com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
}

exports.WebImage=WebImage;
exports.clearCache=function(){
    com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
};
exports.initialize=initiialize;

exports.initializeOnAngular = function(){
	if(false === isInitialized){
    	var _elementRegistry = require("nativescript-angular/element-registry");

    	_elementRegistry.registerElement("WebImage", function () {
    	    return require("nativescript-web-image-cache").WebImage;
    	});
    	initiialize();
		isInitialized=true;
	}
};


exports.setCacheLimit = setCacheLimit;