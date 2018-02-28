"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StretchMapping = (function () {
    function StretchMapping() {
    }
    StretchMapping.get = function (key) {
        return this.stretchMap.get(key);
    };
    return StretchMapping;
}());
StretchMapping.stretchMap = new Map([
    ['aspectFit', com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_CENTER],
    ['aspectFill', com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER_CROP],
    ['fill', com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_XY],
    ['none', com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER]
]);
exports.StretchMapping = StretchMapping;
//# sourceMappingURL=stretch-mapping.js.map