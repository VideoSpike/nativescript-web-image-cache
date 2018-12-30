import { View, Property, booleanConverter } from 'tns-core-modules/ui/core/view';

export class WebImageCommon extends View {
  public src: string;
  public stretch: string;
  public isLoading: boolean;
  // public rounded: boolean;
  // public placeholder: string;
  // public placeholderStretch: string;

  constructor() {
    super();
  }
}

export const srcProperty = new Property<WebImageCommon, string>({
  name: "src",
  defaultValue: undefined
});

export const isLoadingProperty = new Property<WebImageCommon, boolean>({
  name: "isLoading",
  defaultValue: true,
  valueConverter: booleanConverter
});
