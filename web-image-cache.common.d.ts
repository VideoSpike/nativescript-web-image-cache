import { View, Property } from 'tns-core-modules/ui/core/view';
export declare class WebImageCommon extends View {
    src: string;
    stretch: string;
    isLoading: boolean;
    constructor();
}
export declare const srcProperty: Property<WebImageCommon, string>;
export declare const isLoadingProperty: Property<WebImageCommon, boolean>;
