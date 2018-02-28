import { Observable } from 'tns-core-modules/data/observable';
import { View, Property, booleanConverter } from 'tns-core-modules/ui/core/view';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

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
