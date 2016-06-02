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


var SDWebImage = (function (_super) {
    __extends(SDWebImage, _super);
    function SDWebImage() {
        _super.apply(this, arguments);
    }
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
    SDWebImage.stretchProperty = new dependencyObservable.Property(STRETCH, IMAGE, new proxy.PropertyMetadata(enums.Stretch.aspectFit, AffectsLayout));
    return SDWebImage;
}(view.View));
exports.SDWebImage = SDWebImage;
