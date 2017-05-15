/**
 * Created by sumeet on 17-06-2016.
 */


/*tns 3.0 implementation*/


var viewModule = require("ui/core/view");


var WebImage = function(_super){

    __extends(WebImage,_super);

    function WebImage(){

        _super.apply(this,arguments);
    }

    return WebImage;
}(viewModule.View);

var srcProperty = new viewModule.Property({name:"src",defaultValue:""}),
    isLoadingProperty = new viewModule.Property({name:"isLoading",defaultValue:true, valueConverter : stringToBooleanConverter});


function stringToBooleanConverter(value){
    if("boolean" === typeof value){
        return value;
    }
    return "true" === value ?  true : ("false" === value ? false : undefined);
}

srcProperty.register(WebImage);
isLoadingProperty.register(WebImage);

exports.WebImage = WebImage;

exports.srcProperty = srcProperty;
exports.isLoadingProperty = isLoadingProperty;
exports.stringToBooleanConverter = stringToBooleanConverter;