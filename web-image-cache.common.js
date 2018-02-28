"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var WebImageCommon = (function (_super) {
    __extends(WebImageCommon, _super);
    function WebImageCommon() {
        return _super.call(this) || this;
    }
    return WebImageCommon;
}(view_1.View));
exports.WebImageCommon = WebImageCommon;
exports.srcProperty = new view_1.Property({
    name: "src",
    defaultValue: undefined
});
exports.isLoadingProperty = new view_1.Property({
    name: "isLoading",
    defaultValue: true,
    valueConverter: view_1.booleanConverter
});
//# sourceMappingURL=web-image-cache.common.js.map