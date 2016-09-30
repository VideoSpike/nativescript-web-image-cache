

#Nativescript web image cache
A minimalistic NativeScript plugin that wraps just the caching functionality of  SDWebImageCache library for IOS and Facebook Fresco for android.

## License
Released under the MIT License, anybody can freely include this in any type of program -- However, if in need of support contract, changes, enhancements and/or a commercial license please contact me (sumeet@videospike.com).

## Installation 

    tns plugin add nativescript-web-image-cache

** Tested on NativeScript 2.3, if any problems while running on previous versions, please update .This version of plugin has breaking changes, if you are using version 1.0.3 of this plugin , please migrate, it is easy to migrate and this version of plugin supports android as well , if you still prefer running on the previous version, use `tns plugin add nativescript-web-image-cache@1.0.3`.**

## Usage

**IF on android, need to initialise the plugin before using or clearing the cache, initialisation not required for iOS**

Initialising on android - in app.js

    var imageCache = require("nativescript-web-image-cache");
    if (application.android) {
        application.onLaunch = function (intent) {
    	        imageCache.initialize();
        };
    }

 Caching the images
	
 - To the opening page tag of the xml, add
   `xmlns:IC="nativescript-web-image-cache"`.
 - Add the element `IC:WebImage`  with the `src` attribute set to the url just like normal image tag wherever image caching is required.   
 - `stretch` attribute can take values specified here
   -https://docs.nativescript.org/api-reference/modules/\_ui_enums_.stretch.html
 - To check if an image is loading , get the reference to the WebImage view by using `page.getViewById("myWebImage")` , and check the isLoading property (same as that of NativeScript Image isLoading property).

Clearing the cache

- Require the module, call the method `clearCache()`  , default time is same for SDWebImageCache which is 7 days, and for Fresco is 60 days,  after which cache is automatically cleared.

##Example
caching : 
```
    <Page xmlns:IC="nativescript-web-image-cache">
        <GridLayout rows='*' columns='*'> 
	        <IC:WebImage stretch="fill" row="0"
	         col="0"  id="my-image-1"
	         src="http://www.newyorker.com/wp-
	         content/uploads/2014/08/Stokes-Hello-
	         Kitty2-1200.jpg">
	         </IC:WebImage>  
        </GridLayout>
    </Page>
```
checking if image is loading :
```
var imageCacheModule=require("nativescript-web-image-cache");

var myImage1 = page.getViewById("my-image-1"),
	isLoading = myImage1.isLoading; 

```
clear the cache :
```
var imageCacheModule=require("nativescript-web-image-cache");
imageCacheModule.clearCache();
```
**for android, you need to initialize in the application onlaunch event before clearing the cache**

 


