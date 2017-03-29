/**
 * Created by sumeet on 17-06-2016.
 */
var dependencyObservable = require("ui/core/dependency-observable"),
    view = require("ui/core/view"),
    proxy = require("ui/core/proxy"),
    IMAGE = "WebImage",
    SRC = "src",
    PLACEHOLDER = "placeholder",
    LOADING="isLoading";
var AffectsLayout = dependencyObservable.PropertyMetadataSettings.AffectsLayout;

var WebImage = function(_super){

    __extends(WebImage,_super);

    function WebImage(){

        _super.apply(this,arguments);
    }

    Object.defineProperty(WebImage.prototype,SRC,{
        get: function () {
            return this._getValue(WebImage.srcProperty);
        },
        set: function (value) {
            this._setValue(WebImage.srcProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebImage.prototype,LOADING,{
        get: function () {
            return this._getValue(WebImage.isLoadingProperty);
        },
        set: function (value) {
            return this._setValue(WebImage.isLoadingProperty,value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebImage.prototype,PLACEHOLDER,{
        get: function () {
            return this._getValue(WebImage.placeholderProperty);
        },
        set: function (value) {
            return this._setValue(WebImage.placeholderProperty,value);
        },
        enumerable: true,
        configurable: true
    });



    WebImage.srcProperty=new dependencyObservable.Property(SRC,IMAGE, new proxy.PropertyMetadata(undefined,dependencyObservable.PropertyMetadataSettings.None));
    WebImage.isLoadingProperty=new dependencyObservable.Property(LOADING,IMAGE, new proxy.PropertyMetadata(true,dependencyObservable.PropertyMetadataSettings.None));
    WebImage.placeholderProperty = new dependencyObservable.Property(PLACEHOLDER,IMAGE, new proxy.PropertyMetadata(undefined,dependencyObservable.PropertyMetadataSettings.None));
    return WebImage;

}(view.View);

exports.WebImage = WebImage;

