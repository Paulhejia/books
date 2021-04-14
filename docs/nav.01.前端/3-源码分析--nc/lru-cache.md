# LRU-cache

## 场景
LruCache在网络请求，图片缓存等场景下都有使用，其源码非常短(只有260行)，所以我们仔细的通读一遍源码.

[Java 源码地址](https://android.googlesource.com/platform/frameworks/support.git/+/795b97d901e1793dac5c3e67d43c96a758fec388/v4/java/android/support/v4/util/LruCache.java)
v4 是没有锁
[Java v12 源码地址](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/LruCache.java)
[javascript 源码地址](https://github.com/isaacs/node-lru-cache/blob/master/index.js)