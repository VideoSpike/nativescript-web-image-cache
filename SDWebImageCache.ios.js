/**
 * Created by sumeet on 20-05-2016.
 */
var imageCommon = require("./SDWebImageCache-common");
var enums = require("ui/enums");
var types = require("utils/types");
global.moduleMerge(imageCommon, exports);
var loading=[];

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


function onSrcPropertySet(data){


    var image = data.object;
    var value = data.newValue;

    if (types.isString(value)) {
        value = value.trim();
        image["_url"] = value;
        loading.push(value);

        image.ios.sd_setImageWithURLCompleted(value,function(){
            loading.indexOf(value)>-1?(loading[loading.indexOf(value)]=undefined):"";

        });
        image.requestLayout();

    }

}


imageCommon.SDWebImage.srcProperty .metadata.onSetNativeValue = onSrcPropertySet;
imageCommon.SDWebImage.stretchProperty.metadata.onSetNativeValue = onStretchPropertyChanged;

var SDWebImage=(function (_super) {

    __extends(SDWebImage,_super);
    function SDWebImage(){
        _super.call(this);
        this._ios = new UIImageView();
        this._ios.contentMode = UIViewContentMode.UIViewContentModeScaleAspectFit;
        this._ios.clipsToBounds = true;
        this._ios.userInteractionEnabled = true;
    }

    Object.defineProperty(SDWebImage.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });


    SDWebImage.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var utils = require("utils/utils");
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = this._ios ? (this._ios.image?this._ios.image.size.width:0): 0;
        var nativeHeight = this._ios ? (this._ios.image?this._ios.image.size.height:0): 0;
        var measureWidth = Math.max(nativeWidth, this.minWidth);
        var measureHeight = Math.max(nativeHeight, this.minHeight);
        var finiteWidth = widthMode !== utils.layout.UNSPECIFIED;
        var finiteHeight = heightMode !== utils.layout.UNSPECIFIED;
        if (nativeWidth !== 0 && nativeHeight !== 0 && (finiteWidth || finiteHeight)) {
            var scale = SDWebImage.computeScaleFactor(width, height, finiteWidth, finiteHeight, nativeWidth, nativeHeight, this.stretch);
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
    SDWebImage.computeScaleFactor = function (measureWidth, measureHeight, widthIsFinite, heightIsFinite, nativeWidth, nativeHeight, imageStretch) {
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
        return { width: scaleW, height: scaleH };
    };

    return SDWebImage;
}(imageCommon.SDWebImage));

function clearCache(){
    var imageCache= SDImageCache.sharedImageCache();
    imageCache.clearMemory();
    imageCache.clearDisk();
}


exports.SDWebImage= SDWebImage;
exports.isLoading=function(imageURL){
    if(types.isString(imageURL))
  if(loading.indexOf(imageURL.trim())>-1){
    return true;
  }
    return false;
};
exports.clearCache=clearCache;