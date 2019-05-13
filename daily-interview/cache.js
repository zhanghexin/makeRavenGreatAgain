// 请求时浏览器缓存 from memory cache 和 from disk cache 的依据是什么，哪些数据什么时候存放在 Memory Cache 和 Disk Cache中？

// https://www.jianshu.com/p/54cc04190252

// 对于一个数据请求来说，可以分为发起网络请求、后端处理、浏览器响应三个步骤。

// 浏览器缓存可以帮助我们在第一和第三步骤中优化性能。比如直接使用缓存而不发起请求，或者发起了请求但后端存储的数据和前端一致，name就没有必要再将数据回传回来，这样就减少了响应数据。

// 缓存位置
// 依次：Service Worker / Memory Cache / Disk Cache / Push Cache

// Service Worker
// 运行在浏览器背后的独立线程，一般可以用来实现缓存功能。
// 传输协议必须是HTTPS，涉及到拦截请求。
与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。
// 实现缓存功能一般分三步：首先注册Service Worker，然后监听到install事件以后就可以缓存需要的文件，下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存。
// 当Service Worker没有命中缓存的时候，我们需要去fetch数据。
// 根据缓存查找优先级去查找数据，若有结果，则都会显示为Service Worker获取的内容。

// Memory Cache
// 内存中的缓存，主要包含的是当前页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。
// 读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。
一旦关闭Tab页面，内存中的缓存也就被释放了。
// 内存比硬盘容量小得多，不能都放在内存缓存中。
// 内存缓存有一块重要的缓存资源是preloader相关指令下载的资源。
内存缓存在缓存资源时并不关心返回资源的HTTP缓存头Cache-Control是什么值，同时资源的匹配也并非仅仅对URL做匹配，还可能会对Content-Type，CORS等其他特征做校验。


// Disk Cache
存储在硬盘中的缓存，读取速度慢点，比MC生在容量和存储时效性。
// 所有浏览器缓存中，Disk Cache覆盖面基本是最大的，他会根据HTTP Header中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过气需要重新请求。
// 绝大部分的缓存都来自Disk Cache
对于大文件来说，一般优先DC；当前系统内存使用率高的话，优先DC。


// Push Cache
// 推送缓存是HTTP2的内容，当以上三种缓存都没有命中时，它才会被使用。
他只在会话Session中存在，一旦会话结束就被释放，并且缓存时间也很短。



通常浏览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置HTTP Header来实现的。


// 缓存过程分析
浏览器对于缓存的处理是根据第一次请求资源时返回的响应头来确定的。
// 浏览器每次发起请求，都会现在浏览器缓存中查找该请求的结果以及缓存标识。
// 浏览器每次拿到返回的请求结果都会讲该结果和缓存标识存入浏览器缓存中。


// 强缓存
// 强缓存：不会想服务器发送请求，直接从缓存中读取资源，在chrome控制台的network选线中可以看到该请求返回200的状态码，并且size显示from disk cache或from memory cache。
// 强缓存可以通过设置两种HTTP Header实现，Expires和Cache-Control。
// Expires:缓存过期时间，用来指定资源到期的时间，是服务器端的具体的时间点。修改本地时间可能会造成缓存失效。
// Cache-Control:表示在请求正确返回时间的一段时间内再次加载资源，就会命中强缓存。
// public、private、no-cache、no-store、max-age、s-maxage、max-stale、min-fresh
// 两者同时存在的话，Cache-Control优先级高于Expires
强缓存判断是否缓存的依据来自于是否超出某个时间或者某个时间段，而不关心服务器端文件是否已经更新，这可能会导致加载文件不是服务器端最新的内容。


// 协商缓存
协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，有服务器根据缓存标识决定是否使用缓存的过程。
// 通过设置两种HTTP Header实现：Last-Modified和ETag。
// 1.Last-Modified和If-Modified-Since
// 2.ETag和If-None-Match
// 精确度上Etag要优于Last-Modified，性能上Etag要逊于Last-Modified，优先级上服务器校验优先考虑Etag。


// 缓存机制
// 强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，
// 若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，
// 若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存。


// 实际场景应用缓存策略
// 1.频繁变动的资源
Cache-Control: no-cache
// 2.不常变化的资源
Cache-Control: max-age=31536000


// 用户行为对浏览器缓存的影响
打开网页，地址栏输入地址：查找disk cache中是否有匹配。有则使用，没有则发送网络请求。
普通刷新F5：因为TAB并没有关闭，因此memory cache是可用的，会被优先使用，其次才是disk cache。
强制刷新Ctrl+F5：浏览器不使用缓存，因此发送的请求头部均带有Cache-control: no-cache，服务器直接返回200和最新内容。