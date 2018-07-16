"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stretch_mapping_1 = require("./stretch-mapping");
var proxy_base_controller_listener_1 = require("./proxy-base-controller-listener");
var types = require("tns-core-modules/utils/types");
var utils = require("tns-core-modules/utils/utils");
var fs = require("tns-core-modules/file-system");
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.setNativeStretch = function (draweeHierarchy, stretch) {
        var frescoStretch = stretch_mapping_1.StretchMapping.get(stretch) || com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;
        draweeHierarchy.setActualImageScaleType(frescoStretch);
    };
    Helpers.setRounded = function (draweeHierarchy, rounded) {
        var roundingParams = new com.facebook.drawee.generic.RoundingParams.fromCornersRadius(0);
        if (rounded)
            roundingParams.setRoundAsCircle(true);
        else
            roundingParams.setRoundAsCircle(false);
        draweeHierarchy.setRoundingParams(roundingParams);
    };
    Helpers.setPlaceholder = function (draweeHierarchy, src, placeholderStretch) {
        var drawable = this.getPlaceholderImageDrawable(src), nativePlaceholderStretch = stretch_mapping_1.StretchMapping.get(placeholderStretch) || com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER;
        if (null == drawable) {
            return;
        }
        draweeHierarchy.setPlaceholderImage(drawable, nativePlaceholderStretch);
    };
    Helpers.getPlaceholderImageDrawable = function (value) {
        var fileName = "", drawable = null;
        if (types.isString(value)) {
            value = value.trim();
            if (utils.isFileOrResourcePath(value)) {
                if (0 === value.indexOf("~/")) {
                    fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                    drawable = android.graphics.drawable.Drawable.createFromPath(fileName);
                }
                else if (0 === value.indexOf("res")) {
                    fileName = value;
                    var res = utils.ad.getApplicationContext().getResources();
                    var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
                    var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
                    drawable = res.getDrawable(identifier);
                }
            }
        }
        return drawable;
    };
    Helpers.setSource = function (image, value) {
        image.nativeView.setImageURI(null, null);
        if (types.isString(value)) {
            value = value.trim();
            if (utils.isFileOrResourcePath(value) || 0 === value.indexOf("http")) {
                image.isLoading = true;
                var fileName = "";
                if (0 === value.indexOf("~/")) {
                    fileName = fs.path.join(fs.knownFolders.currentApp().path, value.replace("~/", ""));
                    fileName = "file:" + fileName;
                }
                else if (0 === value.indexOf("res")) {
                    fileName = value;
                    var res = utils.ad.getApplicationContext().getResources();
                    var resName = fileName.substr(utils.RESOURCE_PREFIX.length);
                    var identifier = res.getIdentifier(resName, 'drawable', utils.ad.getApplication().getPackageName());
                    fileName = "res:/" + identifier;
                }
                else if (0 === value.indexOf("http")) {
                    image.isLoading = true;
                    fileName = value;
                }
                image.nativeView.setImageURI(android.net.Uri.parse(fileName), null);
                var controllerListener = new proxy_base_controller_listener_1.ProxyBaseControllerListener();
                controllerListener.setNSCachedImage(image);
                var controller = com.facebook.drawee.backends.pipeline.Fresco.newDraweeControllerBuilder()
                    .setControllerListener(controllerListener)
                    .setUri(android.net.Uri.parse(fileName))
                    .build();
                image.nativeView.setController(controller);
                image.requestLayout();
            }
            else {
                throw new Error("Path \"" + "\" is not a valid file or resource.");
            }
        }
    };
    Helpers.onRoundedPropertyChanged = function (nativeObject, value) {
        if (!nativeObject) {
            return;
        }
        var draweeHierarchy = nativeObject.getHierarchy();
        this.setRounded(draweeHierarchy, value);
    };
    Helpers.onPlaceholderPropertyChanged = function (nativeObject, src, placeholderStretch) {
        if (!nativeObject) {
            return;
        }
        var draweeHierarchy = nativeObject.getHierarchy();
        this.setPlaceholder(draweeHierarchy, src, placeholderStretch);
    };
    Helpers.onSrcPropertySet = function (viewWrapper, src) {
        var image = viewWrapper, value = src;
        if (!image.nativeView) {
            return;
        }
        this.setSource(image, value);
    };
    Helpers.onStretchPropertyChanged = function (nativeObject, value) {
        if (!nativeObject) {
            return;
        }
        var draweeHierarchy = nativeObject.getHierarchy();
        this.setNativeStretch(draweeHierarchy, value);
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map