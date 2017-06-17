/**
 * Created by sumeet on 17-06-2016.
 */



/*tns 3.0 implementation*/


var viewModule = require("ui/core/view");


var WebImage = function(_super) {

  __extends(WebImage, _super);

  function WebImage() {
    console.log("instantiating common web image");
    _super.apply(this, arguments);
  }

  return WebImage;
}(viewModule.View);

var srcProperty = new viewModule.Property({
    name: "src",
    defaultValue: undefined
  }),
  isLoadingProperty = new viewModule.Property({
    name: "isLoading",
    defaultValue: true,
    valueConverter: viewModule.booleanConverter
  });

exports.WebImageCommon = WebImage;
exports.srcProperty = srcProperty;
exports.isLoadingProperty = isLoadingProperty;
