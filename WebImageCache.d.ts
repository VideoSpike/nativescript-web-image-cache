/// <reference path="../../node_modules/tns-core-modules/tns-core-modules.d.ts" />
import { View } from 'ui/core/view';

export class WebImage extends View {
  /**
   * Image src, either res://, http://, ~/... or absolute path
   */
  src: string;

  /**
   * Is the image loading or not?
   */
  isLoading: boolean;

  /**
   * aspectFit, aspectFill, fill or none
   */
  stretch: string;

  /**
   * Native android object
   */
  android: any /* com.facebook.drawee.view.SimpleDraweeView */;

  /**
   * Native ios object
   */
  ios: any /* UIImageView */;
}

/**
 * Clear cached images
 */
export function clearCache(): void;

/**
 * For android only: initialize to use cache
 */
export function initialize(): void;

/**
 * To initialize the plugin on angular for both android and iOS
 */
export function initializeOnAngular(): void;
