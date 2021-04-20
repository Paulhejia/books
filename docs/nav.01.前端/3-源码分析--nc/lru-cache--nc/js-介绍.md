# 介绍

## 目录
[[toc]]
## 场景
LruCache在网络请求，图片缓存等场景下都有使用

## 参考
[淘汰策略原理图](https://www.jianshu.com/p/a7e3257e1996)

[Java v4源码地址](https://android.googlesource.com/platform/frameworks/support.git/+/795b97d901e1793dac5c3e67d43c96a758fec388/v4/java/android/support/v4/util/LruCache.java)

::: warning
v4 是没有读写锁
:::

[Java v12 源码地址](https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/util/LruCache.java)

[js版本 源码地址](https://github.com/isaacs/node-lru-cache/blob/master/index.js)

::: tip
js 与 java 由于运行机制因此实现方式有所不同
:::

## LRU 与 LFC 与 FIFO
- LRU(Least Recently Used) 最近最久未使用
- LFU(Least Frequently Used) 最近最少使用算法
- FIFO(First in First out) 先进先出
##  数据结构
哈希双向链表

- 插入：O(1)
- 删除：O(1)
- 查询：O(1)


## 面试提问
::: details 为什么要用哈希双向链表
 https://juejin.cn/post/6844904120462245901
[单链表与双链表区别](https://segmentfault.com/a/1190000010345293)

[双链表](https://segmentfault.com/a/1190000024504131)
单向链表：只有一个指向下一个节点的指针。

优点：单向链表增加删除节点简单。遍历时候不会死循环；

缺点：只能从头到尾遍历。只能找到后继，无法找到前驱，也就是只能前进。

适用于节点的增加删除。

 

双向链表：有两个指针，一个指向前一个节点，一个后一个节点。

优点：可以找到前驱和后继，可进可退；

缺点：增加删除节点复杂，需要多分配一个指针存储空间。

适用于需要双向查找节点值的情况。

1)首先我想的是用队列不行吗？
不行队列只能做到先进先出，但是重复用到中间的数据时无法把中间的数据移动到顶端。


2)就用单链表不行吗？
单链表能实现新来的放头部，最久不用的在尾部删除。但删除的时候需要遍历到尾部，因为单链表只有头指针。在用到已经用到过的数据时，还要遍历整合链表，来确定是否用过，然后再遍历到响应位置来剔除的节点，并重新放在头部。这效率可想而知。

这时hashmap的作用就出来了 他可以在单位1的时间判断value的值是否存在，key直接存储节点对象，能直接定位删除对应的节点(将比节点的父节点指向此节点的子节点)。

要通过一个节点直接获得父节点的话，通过单链表是不行的。
这时双向链表的作用也提现出来了。能直接定位到父节点。 这效率就很高了。而且由于双向链表有尾指针，所以剔除最后的尾节点也十分方便，快捷。

:::

## Javascript 版 Lru-cache

::: tip
js 是用 yallist 的双链表库 以及 Map （哈希表）组成的hashMapLink
:::

### 用法

```js {2, 8}
var LRU = require("lru-cache")
, options = { 
      max: 500
      , length: function (n, key) { return n * 2 + key.length }
      , dispose: function (key, n) { n.close() }
      , maxAge: 1000 * 60 * 60 
}
, cache = new LRU(options)
, otherCache = new LRU(50) // sets just the max size
 
cache.set("key", "value")
cache.get("key") // "value"
 
// non-string keys ARE fully supported
// but note that it must be THE SAME object, not
// just a JSON-equivalent object.
var someObject = { a: 1 }
cache.set(someObject, 'a value')
// Object keys are not toString()-ed
cache.set('[object Object]', 'a different value')
assert.equal(cache.get(someObject), 'a value')
// A similar object with same keys/values won't work,
// because it's a different object identity
assert.equal(cache.get({ a: 1 }), undefined)
 
cache.reset()    // empty the cache
```

### Options 配置项
#### max
- 类型 ```number```
- 默认值 ```Infinity``` ```无穷大```

通过将长度函数应用于缓存中的所有值来检查缓存的最大大小。 
没有设置它是很```愚蠢的```，因为这是这个库的全部目的，但是默认为```Infinity。 将其设置为非数字或负数将引发TypeError。 将其设置为0使其变为无穷大

#### maxAge
- 类型 ```number```
- 默认值 ```0```

最大过期时间
即使过期，程序也不会主动去删除它（某个过期值）；只有在你试图获取一个过期值时。才会删除它，并返回 undefined

#### length
- 类型 ```Function```
    - 参数：
        - {any} value 
        - {number} key        
- 默认值 ```function(){return 1}```

用于计算存储项的长度。

如果你要存储```strings or buffers```等数据，那么你可能想做一些类似```function(value, key){return value.length}```的事情; 

默认会用```function(){return 1}```, 适用于你用来存储与 max 类似同样等级的size 的;
value 作为第一个参数，key 作为第二个参数

#### dispose
- 类型 ```Function``` (key, value)
    - 参数：
        - {number} key
        - {any} value 
- 默认值 ```无```
    - 可不设置

当从缓存中删除项时或者改变时 的钩子函数
它在从内部缓存中移除项之前被调用；所以如果你想立即把它放回去，你需要在nextTick或setTimeout回调中做这个，否则它不会做任何事。

#### stale
- 类型 ```Boolean```
- 默认值 ```false```
    - ```true```  当已超过```maxAge```时，能取到```过时```的值 get(key)；
    - ```false``` 它将返回```undefined```，就好像它已经被删除了一样
    当做```get(key)```操作时，是否返回需要返回过期的值

#### noDisposeOnSet
- 类型 ```Boolean```
- 默认值 ```false```
    - ```true``` ```dispose()```只会在键从缓存中掉出来时调用
    - ```false``` 如果您设置了```dispose()```方法，那么当```set()```操作覆盖现有的键时，就会调用该方法

默认情况下，如果您设置了```dispose()```方法，那么当set()操作覆盖现有的键时，就会调用该方法。如果**设置了这个选项**，则```dispose()```只会在键从缓存中掉出来时调用，**而不会在键被覆盖时调用**
#### updateAgeOnGet
- 类型 ```Boolean```
- 默认值 ```false```
    - ```true``` 会在 get cache操作的时候更新为当前时间 Date.Now(),从而使其不会过期
    - ```false``` 不会在 get cache操作的时候更新为当前时间

当与```maxAge```一起使用时间过期条目时，将此设置为```true```将使当前项的有效时间从缓存中检索时更新为当前时间
::: tip
当然，它仍然可以根据最近的使用情况从缓存中退出。
:::

### API

::: details recently used
当前key的最近使用时间，与maxAge配合使用
:::
#### set(key, value, maxAge)
#### get(key) => value
两者都会更新当前key在cache里的```recently used```的存活时间
maxAge是可选的，如果提供的话会覆盖cache maxAge默认值

#### peek(key)
返回 key 对于的值（可能没有找到），不能更新这个key的```recently used```存活时间

#### del(key)
从缓存cache中删除key 

#### reset
完全清除缓存，丢弃所有值; 重新new Map 与链表

#### has(key)
去检索cache中是否有key, 且不会更新```recently used```的存活时间

#### forEach(function(value,key,cache), [thisp])
与Array.prototype.forEach 类似，按最近的顺序遍历缓存cache中的所有键key。c

#### rforEach(function(value,key,cache), [thisp])
(reverseForeach)

与cache.forEach 类似, 但是项的迭代顺序是相反的。(例如，最少使用的条目会先进行迭代。)

#### keys
返回cache 中的key值数组 Array

#### length
考虑到```length```选项函数，返回缓存中对象的总长度

#### itemCount
- stale 为true时，会把过期数据计算在内
- stale 为false时，不会把过期数据计算在内
返回当前缓存中对象的总数。注意，过期的(请参阅选项 stale)项将作为该项计数的一部分返回

#### dump()
返回一个缓存条目数组，以备序列化并与``` destinationCache.load(arr) ```一起使用。

#### load(cacheEntriesArray)
与dump 配合使用，
在加载新条目之前，将重置目标缓存


#### prune()
手动遍历整个缓存，主动删除过期项


## Java 版 Lru-cache
编写中