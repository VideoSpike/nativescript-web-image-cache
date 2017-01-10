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

    var image = data.object,
        draweeHierarchy=image.android.getHierarchy();
    switch (data.newValue) {
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
        this._android = new com.facebook.drawee.view.SimpleDraweeView(application.android.currentContext);
        this._android.getHierarchy().setActualImageScaleType(com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER);
    }

    Object.defineProperty(WebImage.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return WebImage;
}(imageCommon.WebImage));




exports.WebImage=WebImage;
exports.clearCache=function(){
    com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline().clearCaches();
};
exports.initialize=function(){
    com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
};