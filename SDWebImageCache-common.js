/**
 * Created by sumeet on 20-05-2016.
 */
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
//var imageSource = require("image-source");
var enums = require("ui/enums");
var platform = require("platform");
var utils = require("utils/utils");
var types = require("utils/types");
var SRC = "src";
//var IMAGE_SOURCE = "imageSource";
var IMAGE = "SDWebImage";
/*var ISLOADING = "isLoading";*/
var STRETCH = "stretch";
var AffectsLayout = dependencyObservable.PropertyMetadataSettings.AffectsLayout;
/*
function onSrcPropertyChanged(data) {
    var image = data.object;
    var value = data.newValue;
    if (types.isString(value)) {
        value = value.trim();
        image.imageSource = null;
        image["_url"] = value;
    }

}
*/

function onSrcSet(data){
    console.log("onSrcSet called! 1 ");
    console.log("onSrcSet called! 2 ");
    console.log("onSrcSet called! 3 ");
}

var SDWebImage = (function (_super) {
    __extends(SDWebImage, _super);
    console.log("super constructor called!!");
    function SDWebImage() {
        _super.apply(this, arguments);
    }
    /*
    Object.defineProperty(SDWebImage.prototype, "imageSource", {
        get: function () {
            return this._getValue(SDWebImage.imageSourceProperty);
        },
        set: function (value) {
            this._setValue(SDWebImage.imageSourceProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    */
    Object.defineProperty(SDWebImage.prototype, "src", {
        get: function () {
            return this._getValue(SDWebImage.srcProperty);
        },
        set: function (value) {
            this._setValue(SDWebImage.srcProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    /*
    Object.defineProperty(SDWebImage.prototype, "isLoading", {
        get: function () {
            return this._getValue(SDWebImage.isLoadingProperty);
        },
        enumerable: true,
        configurable: true
    });
    */
    Object.defineProperty(SDWebImage.prototype, "stretch", {
        get: function () {
            return this._getValue(SDWebImage.stretchProperty);
        },
        set: function (value) {
            this._setValue(SDWebImage.stretchProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    SDWebImage.prototype._setNativeImage = function (nativeImage) {
    };

    SDWebImage.srcProperty = new dependencyObservable.Property(SRC, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));
    /*SDWebImage.imageSourceProperty = new dependencyObservable.Property(IMAGE_SOURCE, IMAGE, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));*/
    /*SDWebImage.isLoadingProperty = new dependencyObservable.Property(ISLOADING, IMAGE, new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None));*/
    SDWebImage.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(enums.Stretch.aspectFit, AffectsLayout));
    return SDWebImage;
}(view.View));
exports.SDWebImage = SDWebImage;
