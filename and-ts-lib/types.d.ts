/**
 * declarations
 * @type {any}
 */

// com.facebook.drawee.backends.pipeline.Fresco.newDraweeControllerBuilder().
//   setControllerListener(controllerListener)
//   .setUri(android.net.Uri.parse(fileName))
//   .build();
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class Fresco {
            public static newDraweeControllerBuilder(): any;
            public static getImagePipeline(): any;
            public static initialize(param: any): any;
          }
        }
      }
      export namespace controller {
        export class BaseControllerListener {
          public static extend(param: any);
        }
      }
      export namespace view {
        export class SimpleDraweeView {
          constructor(context: any);
          public getHierarchy(): any;
        }
      }
      export namespace drawable {
        export namespace ScalingUtils {
          export class ScaleType {
            public static FIT_CENTER: any;
            public static CENTER_CROP: any;
            public static FIT_XY: any;
            public static CENTER: any;
          }
        }
      }
      export namespace generic {
        export class RoundingParams {
          static fromCornersRadius(value: number): void;
        }
      }
    }
  }
}
