"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("tns-core-modules/utils/types");
var utils = require("tns-core-modules/utils/utils");
// var imageSource = require("tns-core-modules/image-source");
import {  ImageSource } from "tns-core-modules/image-source";
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.onStretchPropertyChanged = function (nativeView, value) {
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
    };
    Helpers.onSrcPropertySet = function (nativeWrapper, value) {
        var image = nativeWrapper, placeholder = nativeWrapper.placeholder, placeholderImage = this.getPlaceholderUIImage(placeholder);
        if (types.isString(value)) {
            value = value.trim();
            if (0 === value.indexOf("http")) {
                image.isLoading = true;
                image.nativeView.sd_setImageWithURLPlaceholderImageCompleted(value, placeholderImage, function () {
                    image.isLoading = false;
                });
            }
            else if (utils.isFileOrResourcePath(value)) {
                image.isLoading = true;
                var source_1 = new ImageSource();
                if (0 === value.indexOf(utils.RESOURCE_PREFIX)) {
                    var path = value.substr(utils.RESOURCE_PREFIX.length);
                    source_1.fromResource(path).then(function () {
                        image.isLoading = false;
                        image.nativeView.image = source_1.ios || source_1.nativeView;
                    });
                }
                else {
                    source_1.fromFile(value).then(function () {
                        image.isLoading = false;
                        image.nativeView.image = source_1.ios || source_1.nativeView;
                    });
                }
            }
            image.requestLayout();
        }
    };
    Helpers.getPlaceholderUIImage = function (value) {
        if (types.isString(value)) {
            if (utils.isFileOrResourcePath(value)) {
                return ImageSource.fromFileOrResource(value).ios;
            }
        }
        return undefined;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map