/// <reference path="./types.d.ts" />

export class StretchMapping {
  private static stretchMap: Map<string, any> = new Map<string, any>([

    ['aspectFit', com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_CENTER],
    ['aspectFill', com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER_CROP],
    ['fill', com.facebook.drawee.drawable.ScalingUtils.ScaleType.FIT_XY],
    ['none', com.facebook.drawee.drawable.ScalingUtils.ScaleType.CENTER]
  ]);

  constructor() {
  }

  static get(key: string): any {
    return this.stretchMap.get(key);
  }

}
