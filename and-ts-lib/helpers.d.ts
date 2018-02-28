/// <reference path="types.d.ts" />
export declare class Helpers {
    static setNativeStretch(draweeHierarchy: any, stretch: any): void;
    static setRounded(draweeHierarchy: any, rounded: any): void;
    static setPlaceholder(draweeHierarchy: any, src: any, placeholderStretch: any): void;
    static getPlaceholderImageDrawable(value: any): any;
    static setSource(image: any, value: any): void;
    static onRoundedPropertyChanged(nativeObject: any, value: any): void;
    static onPlaceholderPropertyChanged(nativeObject: any, src: any, placeholderStretch: any): void;
    static onSrcPropertySet(viewWrapper: any, src: any): void;
    static onStretchPropertyChanged(nativeObject: any, value: any): void;
}
