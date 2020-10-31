declare namespace com {
  export namespace facebook {
    export namespace datasource {
      export class BaseDataSubscriber {
        public static extend(param: any);
      }
      export class DataSource { }
    }
    export namespace common {
      export namespace references {
        export class CloseableReference { }
      }
      export namespace executors {
        export class UiThreadImmediateExecutorService {
          public static getInstance() : any;
        }
      }
      export namespace internal {
        export class Supplier { }
      }
    }
    export namespace imagepipeline {
      export namespace core {
        export class ImagePipelineFactory { }
        export class ImagePipelineConfig { }
        export class ImagePipeline { }
      }
      export namespace request {
        export class ImageRequest {
          public static fromUri(param0: any): any;
        }
      }
      export namespace image {
        export class ImageInfo { }
      }

      export namespace animated {
        export namespace factory {
          export class AnimatedDrawableFactory { }
        }
      }

    }

    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class BuildConfig {
            public static DEBUG: boolean;
            public static APPLICATION_ID: string;
            public static BUILD_TYPE: string;
            public static FLAVOR: string;
            public static VERSION_CODE: number;
            public static VERSION_NAME: string;
            public constructor();
          }
        }
      }
      export namespace components {
        export class DeferredReleaser { }
      }
    }
  }
}

import androidcontentContext = android.content.Context;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilderSupplier.d.ts" />
/// <reference path="./com.facebook.imagepipeline.core.ImagePipeline.d.ts" />
/// <reference path="./com.facebook.imagepipeline.core.ImagePipelineConfig.d.ts" />
/// <reference path="./com.facebook.imagepipeline.core.ImagePipelineFactory.d.ts" />
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class Fresco {
            public static initialize(param0: androidcontentContext): void;
            public static newDraweeControllerBuilder(): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
            public static getImagePipelineFactory(): com.facebook.imagepipeline.core.ImagePipelineFactory;
            public static shutDown(): void;
            public static initialize(param0: androidcontentContext, param1: com.facebook.imagepipeline.core.ImagePipelineConfig): void;
            public static getImagePipeline(): com.facebook.imagepipeline.core.ImagePipeline;
            public static getDraweeControllerBuilderSupplier(): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilderSupplier;
          }
        }
      }
    }
  }
}

import androidcontentresResources = android.content.res.Resources;
import javautilconcurrentExecutor = java.util.concurrent.Executor;
import javalangObject = java.lang.Object;
import androidgraphicsdrawableDrawable = android.graphics.drawable.Drawable;
/// <reference path="./android.content.res.Resources.d.ts" />
/// <reference path="./android.graphics.drawable.Drawable.d.ts" />
/// <reference path="./com.facebook.common.internal.Supplier.d.ts" />
/// <reference path="./com.facebook.common.references.CloseableReference.d.ts" />
/// <reference path="./com.facebook.datasource.DataSource.d.ts" />
/// <reference path="./com.facebook.drawee.components.DeferredReleaser.d.ts" />
/// <reference path="./com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory.d.ts" />
/// <reference path="./com.facebook.imagepipeline.image.ImageInfo.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.concurrent.Executor.d.ts" />
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class PipelineDraweeController {
            public getDataSource(): com.facebook.datasource.DataSource;
            public getImageInfo(param0: com.facebook.common.references.CloseableReference): com.facebook.imagepipeline.image.ImageInfo;
            public getResources(): androidcontentresResources;
            public static setLightBitmapDrawableExperiment(param0: boolean, param1: boolean): void;
            public constructor(param0: androidcontentresResources, param1: com.facebook.drawee.components.DeferredReleaser, param2: com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory, param3: javautilconcurrentExecutor, param4: com.facebook.common.internal.Supplier, param5: string, param6: javalangObject);
            public createDrawable(param0: com.facebook.common.references.CloseableReference): androidgraphicsdrawableDrawable;
            public releaseImage(param0: com.facebook.common.references.CloseableReference): void;
            public getImageHash(param0: com.facebook.common.references.CloseableReference): number;
            public releaseDrawable(param0: androidgraphicsdrawableDrawable): void;
            public initialize(param0: com.facebook.common.internal.Supplier, param1: string, param2: javalangObject): void;
            public toString(): string;
          }
        }
      }
    }
  }
}

import javautilSet = java.util.Set;
import androidnetUri = android.net.Uri;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.net.Uri.d.ts" />
/// <reference path="./com.facebook.datasource.DataSource.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeController.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeControllerFactory.d.ts" />
/// <reference path="./com.facebook.imagepipeline.core.ImagePipeline.d.ts" />
/// <reference path="./com.facebook.imagepipeline.request.ImageRequest.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.Set.d.ts" />
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class PipelineDraweeControllerBuilder {
            public constructor(param0: androidcontentContext, param1: com.facebook.drawee.backends.pipeline.PipelineDraweeControllerFactory, param2: com.facebook.imagepipeline.core.ImagePipeline, param3: any);
            public setUri(param0: androidnetUri): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
            public getDataSourceForRequest(param0: com.facebook.imagepipeline.request.ImageRequest, param1: javalangObject, param2: boolean): com.facebook.datasource.DataSource;
            public obtainController(): com.facebook.drawee.backends.pipeline.PipelineDraweeController;
            public setUri(param0: string): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
            public getThis(): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
          }
        }
      }
    }
  }
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder.d.ts" />
/// <reference path="./com.facebook.imagepipeline.core.ImagePipelineFactory.d.ts" />
/// <reference path="./java.util.Set.d.ts" />
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class PipelineDraweeControllerBuilderSupplier {
            public constructor(param0: androidcontentContext, param1: com.facebook.imagepipeline.core.ImagePipelineFactory, param2: any);
            public constructor(param0: androidcontentContext, param1: com.facebook.imagepipeline.core.ImagePipelineFactory);
            public get(): com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
            public constructor(param0: androidcontentContext);
          }
        }
      }
    }
  }
}

/// <reference path="./android.content.res.Resources.d.ts" />
/// <reference path="./com.facebook.common.internal.Supplier.d.ts" />
/// <reference path="./com.facebook.drawee.backends.pipeline.PipelineDraweeController.d.ts" />
/// <reference path="./com.facebook.drawee.components.DeferredReleaser.d.ts" />
/// <reference path="./com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.concurrent.Executor.d.ts" />
declare namespace com {
  export namespace facebook {
    export namespace drawee {
      export namespace backends {
        export namespace pipeline {
          export class PipelineDraweeControllerFactory {
            public newController(param0: com.facebook.common.internal.Supplier, param1: string, param2: javalangObject): com.facebook.drawee.backends.pipeline.PipelineDraweeController;
            public constructor(param0: androidcontentresResources, param1: com.facebook.drawee.components.DeferredReleaser, param2: com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory, param3: javautilconcurrentExecutor);
          }
        }
      }
    }
  }
}
