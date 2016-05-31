

#Nativescript iOS web image cache
A NativeScript plugin that wraps just the caching functionality of  SDWebImageCache library.
**Note - It cannot be used to display local images, only URLS work**

## License
Released under the MIT License, anybody can freely include this in any type of program -- However, if in need of support contract, changes, enhancements and/or a commercial license please contact me (sumeet@videospike.com).

## Installation 

    tns plugin add nativescript-web-image-cache

**Developed and tested on NativeScript 1.7.2, if any problems while running on previous versions, please update.**

## Usage

 Caching the images
	
 - To the opening page tag of the xml, add
   `xmlns:SD="nativescript-web-image-cache"`.
 - Add the element `SD:SDWebImage`  with the `src` attribute set to the url just like normal image tag wherever image caching is required.   
 - `stretch` attribute can take values specified here
   -https://docs.nativescript.org/api-reference/modules/_ui_enums_.stretch.html
 - To check if an image is loading , require the module, call in
   isLoading method which accepts the image url as parameter.

Clearing the cache

- require the module, call the method `clearCache()`  , default time is same for SDWebImageCache which is 7 days, after which cache is automatically cleared.

##Example
caching : 
```
    <Page xmlns:SD="nativescript-web-image-cache">
        <GridLayout rows='*' columns='*'> 
	        <SD:SDWebImage stretch="fill" row="0"
	         col="0" 
	         src="http://www.newyorker.com/wp-
	         content/uploads/2014/08/Stokes-Hello-
	         Kitty2-1200.jpg">
	         </SD:SDWebImage>  
        </GridLayout>
    </Page>
```
checking if image is loading :
```
var iOSImageCacheModule=require("nativescript-web-image-cache");

var isLoadingOne=iOSImageCacheModule.isLoading("http://www.newyorker.com/wp-
	         content/uploads/2014/08/Stokes-Hello-
	         Kitty2-1200.jpg");
```
clear the cache :
```
var iOSImageCacheModule=require("nativescript-web-image-cache");
iOSImageCacheModule.clearCache();

```
 
