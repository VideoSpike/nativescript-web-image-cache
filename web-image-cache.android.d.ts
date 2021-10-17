/// <reference path="and-ts-lib/types.d.ts" />
import { WebImageCommon } from './web-image-cache.common';
export declare class WebImage extends WebImageCommon {
    rounded: boolean;
    placeholder: string;
    placeholderStretch: string;
    constructor();
    android: any;
    createNativeView(): any;
    initNativeView(): void;
}
export declare function setCacheLimit(numberOfDays: any): void;
export declare function initialize(): void;
export declare function clearCache(): void;
export declare function initializeOnAngular(): void;
export declare function preFetchImage(urls: Array<string>): Promise<void>;
