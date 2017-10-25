
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
    ROUNDED = "rounded",
    fs=require("file-system"),
    isInitialized = false, 
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

function onRoundedPropertyChanged(data) {
    var image = data.object;
    if(!image.android){
        return;
    }
    var draweeHierarchy=image.android.getHierarchy();
    setRounded(draweeHierarchy,data.newValue);
}
function setRounded(draweeHierarchy, rounded){
    var roundingParams = new com.facebook.drawee.generic.RoundingParams.fromCornersRadius(0);
    if(rounded)
        roundingParams.setRoundAsCircle(true);
    else
        roundingParams.setRoundAsCircle(false);
    draweeHierarchy.setRoundingParams(roundingParams);
}

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
        return
    }

    setSource(image,value);

}
function setSource(image,value){
    image.android.setImageURI(null, null);
    if (types.isString(value)) {
        value = value.trim();
        if(utils.isFileOrResourcePath(value) || 0===value.indexOf("http")){
            image.isLoading=true;
            var fileName="";
            if(0===value.indexOf("~/")){
                fileName=fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                fileName="file:"+ fileName;
            }else if(0==value.indexOf("res")){
                fileName=value;
                var res = utils.ad.getApplicationContext().getResources();
                var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
                var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
                fileName="res:/" + identifier;
            }else if(0===value.indexOf("http")){
                image.isLoading=true;
                fileName=value;
            }else if(fs.File.exists(value)){
                  fileName="file:"+ value;
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


var WebImage=(function (_super) {



    __extends(WebImage,_super);


    Object.defineProperty(WebImage.prototype,ROUNDED,{
        get: function () {
            return this._getValue(WebImage.roundedProperty);
        },
        set: function (value) {
            this._setValue(WebImage.roundedProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WebImage.roundedProperty = new dependencyObservable.Property(ROUNDED, IMAGE, new proxy.PropertyMetadata(false, AffectsLayout,onRoundedPropertyChanged));

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
        if(undefined!==this.rounded){
            setRounded(this._android.getHierarchy(),this.rounded);
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

/**
 * Created by sumeet on 17-06-2016.
 */



var imageCommon = require("./WebImageCache-common"),
  application = require("application"),
  dependencyObservable = require("ui/core/dependency-observable"),
  types = require("utils/types"),
  utils = require("utils/utils"),
  fs = require("file-system"),
  appSettings = require("application-settings"),
  isInitialized = false;

var viewModule = require("ui/core/view");

global.moduleMerge(imageCommon, exports);

var stretchMapping = {};

stretchMapping["aspectFit"] = com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_CENTER;
stretchMapping["aspectFill"] = com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER_CROP;
stretchMapping["fill"] = com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_XY;
stretchMapping["none"] = com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;


var roundedProperty = new viewModule.Property({
    name: "rounded",
    defaultValue: false,
    valueConverter: viewModule.booleanConverter,
    affectsLayout: true
  }),
  placeholderProperty = new viewModule.Property({
    name: "placeholder",
    defaultValue: undefined,
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  }),
  placeholderStretchProperty = new viewModule.Property({
    name: "placeholderStretch",
    defaultValue: stretchMapping.none,
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  }),
  stretchProperty = new viewModule.Property({
    name: "stretch",
    defaultValue: stretchMapping.none,
    valueConverter: function(v) {
      return v;
    },
    affectsLayout: true
  });

imageCommon.srcProperty.register(imageCommon.WebImageCommon);
imageCommon.isLoadingProperty.register(imageCommon.WebImageCommon);
roundedProperty.register(imageCommon.WebImageCommon);
placeholderProperty.register(imageCommon.WebImageCommon);
placeholderStretchProperty.register(imageCommon.WebImageCommon);
stretchProperty.register(imageCommon.WebImageCommon);




var ProxyBaseControllerListener = com.facebook.drawee.controller.BaseControllerListener.extend({
  _NSCachedImage: undefined,
  setNSCachedImage: function(img) {
    this._NSCachedImage = img;
  },
  onFinalImageSet: function(id, imageInfo, anim) {
    if (undefined != this._NSCachedImage) {
      this._NSCachedImage.isLoading = false;
    }
  },
  onIntermediateImageSet: function(id, imageInfo) {

  },
  onFailure: function(id, throwable) {

  }
});

function onRoundedPropertyChanged(nativeObject, value) {
  if (!nativeObject) {
    return;
  }
  var draweeHierarchy = nativeObject.getHierarchy();
  setRounded(draweeHierarchy, value);
}

function setRounded(draweeHierarchy, rounded) {
  var roundingParams = new com.facebook.drawee.generic.RoundingParams.fromCornersRadius(0);
  if (rounded)
    roundingParams.setRoundAsCircle(true);
  else
    roundingParams.setRoundAsCircle(false);
  draweeHierarchy.setRoundingParams(roundingParams);
}

function onPlaceholderPropertyChanged(nativeObject, src) {


  if (!nativeObject) {
    return;
  }

  var draweeHierarchy = nativeObject.getHierarchy();

  setPlaceholder(draweeHierarchy, src);

}

function setPlaceholder(draweeHierarchy, src, placeholderStretch) {
  var drawable = getPlaceholderImageDrawable(src),
    nativePlaceholderStretch = stretchMapping[placeholderStretch] || com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;

  if (null == drawable) {
    return;
  }

  draweeHierarchy.setPlaceholderImage(drawable, nativePlaceholderStretch);

}


function onStretchPropertyChanged(nativeObject, value) {

  if (!nativeObject) {
    return;
  }

  var draweeHierarchy = nativeObject.getHierarchy();

  setNativeStretch(draweeHierarchy, value);
}


function setNativeStretch(draweeHierarchy, stretch) {

  var frescoStretch = stretchMapping[stretch] || com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;
  draweeHierarchy.setActualImageScaleType(frescoStretch);

}


function onSrcPropertySet(viewWrapper, src) {
  var image = viewWrapper,
    value = src;
  if (!image.nativeView) {
    return
  }

  setSource(image, value);
}

function setSource(image, value) {
  image.nativeView.setImageURI(null, null);


  if (types.isString(value)) {
    value = value.trim();
    if (utils.isFileOrResourcePath(value) || 0 === value.indexOf("http")) {
      image.isLoading = true;
      var fileName = "";
      if (0 === value.indexOf("~/")) {
        fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
        fileName = "file:" + fileName;
      } else if (0 == value.indexOf("res")) {
        fileName = value;
        var res = utils.ad.getApplicationContext().getResources();
        var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
        var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
        fileName = "res:/" + identifier;
      } else if (0 === value.indexOf("http")) {
        image.isLoading = true;
        fileName = value;
      }
      image.nativeView.setImageURI(android.net.Uri.parse(fileName), null);

      var controllerListener = new ProxyBaseControllerListener();
      controllerListener.setNSCachedImage(image);


      var controller = com.facebook.drawee.backends.pipeline.Fresco.newDraweeControllerBuilder().
      setControllerListener(controllerListener)
        .setUri(android.net.Uri.parse(fileName))
        .build();
      image.nativeView.setController(controller);

      image.requestLayout();

    } else {
      throw new Error("Path \"" + "\" is not a valid file or resource.");
    }
  }

}

/**/

var WebImage = (function(_super) {


  __extends(WebImage, _super);

  function WebImage() {
    _super.apply(this, arguments);
  }

  Object.defineProperty(WebImage.prototype, "android", {
    get: function() {
      return this.nativeView;
    },
    enumerable: true,
    configurable: true
  });

  WebImage.prototype.createNativeView = function() {
    var simpleDraweeView = new com.facebook.drawee.view.SimpleDraweeView(this._context);
    simpleDraweeView.getHierarchy().setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
    if (undefined !== this.stretch) {
      setNativeStretch(simpleDraweeView.getHierarchy(), this.stretch);
    }
    if (undefined !== this.rounded) {
      setRounded(simpleDraweeView.getHierarchy(), this.rounded);
    }
    if (undefined !== this.placeholder) {
      setPlaceholder(simpleDraweeView.getHierarchy(), this.placeholder, this.placeholderStretch);
    }
    return simpleDraweeView;
  };


  WebImage.prototype.initNativeView = function() {
    if (undefined !== this.src) {
      setSource(this, this.src);
    }
  };

  WebImage.prototype[roundedProperty.getDefault] = function() {
    return false;
  };
  WebImage.prototype[roundedProperty.setNative] = function(value) {
    var simpleDraweeView = this.nativeView;
    onRoundedPropertyChanged(simpleDraweeView, value);
  };

  WebImage.prototype[placeholderProperty.getDefault] = function() {
    return undefined;
  };
  WebImage.prototype[placeholderProperty.setNative] = function(value) {
    var simpleDraweeView = this.nativeView;
    onPlaceholderPropertyChanged(simpleDraweeView, value);
  };

  WebImage.prototype[placeholderStretchProperty.getDefault] = function() {
    return "none";
  };

  WebImage.prototype[placeholderStretchProperty.setNative] = function(value) {
    var simpleDraweeView = this.nativeView;
    setPlaceholder(simpleDraweeView.getHierarchy(), src, value);


  };

  WebImage.prototype[stretchProperty.getDefault] = function() {
    return stretchMapping.none;
  };
  WebImage.prototype[stretchProperty.setNative] = function(value) {
    var simpleDraweeView = this.nativeView;
    onStretchPropertyChanged(simpleDraweeView, value);
  };

  WebImage.prototype[imageCommon.srcProperty.getDefault] = function() {
    return undefined;
  };
  WebImage.prototype[imageCommon.srcProperty.setNative] = function(value) {
    onSrcPropertySet(this, value);
  };

  WebImage.prototype[imageCommon.isLoadingProperty.getDefault] = function() {
    return "";
  };
  WebImage.prototype[imageCommon.isLoadingProperty.setNative] = function(value) {
    // do nothing

  };


  return WebImage;
}(imageCommon.WebImageCommon));


function getPlaceholderImageDrawable(value) {

  var fileName = "",
    drawable = null;


  if (types.isString(value)) {

    value = value.trim();

    if (utils.isFileOrResourcePath(value)) {


      if (0 === value.indexOf("~/")) {
        fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
        drawable = android.graphics.drawable.Drawable.createFromPath(fileName);
      } else if (0 == value.indexOf("res")) {
        fileName = value;
        var res = utils.ad.getApplicationContext().getResources();
        var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
        var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
        drawable = res.getDrawable(identifier);
      }


    }
  }

  return drawable;

}


function setCacheLimit(numberOfDays) {

  var noOfSecondsInAMinute = 60,
    noOfMinutesInAHour = 60,
    noOfHoursInADay = 24,
    noOfSecondsADay = noOfSecondsInAMinute * noOfMinutesInAHour * noOfHoursInADay,
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


function initialize() {
  com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
}

exports.WebImage = WebImage;
exports.clearCache = function() {
  com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
};

exports.setCacheLimit = setCacheLimit;

exports.initialize = initialize;

exports.initializeOnAngular = function() {

  if (false === isInitialized) {
    var _elementRegistry = require("nativescript-angular/element-registry");


    _elementRegistry.registerElement("WebImage", function() {
      return require("nativescript-web-image-cache").WebImage;
    });
    initialize();
    isInitialized = true;
  }
};

