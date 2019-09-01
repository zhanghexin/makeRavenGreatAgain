// https://zhuanlan.zhihu.com/p/80551769
// 简单HTTP请求，没有HTTPS、HTTP2、最简单DNS、没有代理、服务器没有问题

// 大致流程
// 1.URL解析
// 2.DNS查询
// 3.TCP链接
// 4.处理请求
// 5.接受响应
// 6.渲染页面

// 一、URL解析
// 1.地址解析：判断输入的是一个合法的URL还是一个待搜索的关键词，并且根据你输入的内容进行自动完成、字符编码等操作。
// 2.HSTS：由于安全隐患，会使用HSTS强制客户端使用HTTPS访问页面。
// 扩展：https://www.barretlee.com/blog/2015/10/22/hsts-intro/
// HTTP Strict Transport Security
// 在服务器响应头添加Strict-Transport-Security，可以设置max-age
// 用户访问时，服务器种下这个头
// 下次如果使用http访问，只要max-age未过期，客户端会进行内部跳转，可以看到307 Redirect Internel的响应码
// 变成https访问原服务器
// 这个过程有效避免了中间人攻击，同时也为浏览器节省了一次302/301的跳转
// 3.其他操作：浏览器还会进行一些额外的操作，安全检查、访问限制等。
// 4.检查缓存：参考图片enterUrl-checkCache

// 二、DNS查询
// 1.浏览器缓存：浏览器会先检查是否在魂村中，没有则调用系统库函数进行查询
// 2.操作系统缓存：操作系统也有自己的DNS缓存，但在这之前，会向检查域名是否存在本地的Hosts文件里，没有则向DNS服务器发送查询请求
// 3.路由器缓存：路由器也有自己的缓存
// 4.ISP DNS缓存：ISP DNS就是客户端电脑上设置的首选DNS服务器，它们在大多数情况下都会有缓存
// 5.根域名服务器查询：在前面所有步骤没有缓存的情况下，本地DNS服务器会将请求转发到互联网上的根域
// 参考图片enterUrl-dns
// 需要注意的点
// 递归方式：一路查下去中间不返回，得到最后最终结果才返回信息（浏览器到本地DNS服务器的过程）
// 迭代方式：本地DNS服务器到根域名服务器查询的方式
// DNS劫持
// DNS-prefetch优化：根据浏览器定义的规则，提前解析之后可能会用到的域名，使解析结果缓存到系统缓存中，缩短DNS解析时间，提高网站的访问速速。
// 参考https://github.com/barretlee/performance-column/issues/3

// 三、TCP链接
// 参考图片enterUrl-tcp
// TCP/IP分为4层，在发送数据时，每层都要对数据进行封装
// 发送端每通过一层增加首部，接收端没通过一层删除首部
// 发送：应用层[HTTP]-传输层[TCP[HTTP]]-网络层[IP[TCP[HTTP]]]-链路层[Ethernet[IP[TCP[HTTP]]]]
// 接收：(上述顺序反过来)
// 1.应用层：发送HTTP请求
// 浏览器构造一个HTTP报文，其中包括：请求报头(Request Header)：请求方法、目标地址、遵循的协议等等+请求主体（其他参数）
// 浏览器只能发送GET/POST请求，打开网页使用的是GET方法
// 2.传输层：TCP传输报文
// 传输层会发起一条到达服务器的TCP链接，为了方便传输，会对数据进行分割（以报文段为单位），并标记编号，方便服务器接收时能够准确地还原报文信息。
// 在建立连接前，会先进行TCP三次握手
// 扩展：TCP三次握手
// 3.网络层：IP协议查询Mac地址
// 将数据段打包，并加入源及目标的IP地址，并且负责寻找传输路线
// 判断目标地址是否与当前地址处于同一网络中，是的话直接根据Mac地址发送，否则使用路由表查找下一跳地址，以及使用ARP协议查询它的Mac地址
// 4.链路层：以太网协议
// 根据以太网协议将数据分为以“帧”为单位的数据包，每一帧分为两个部分
// 标头：数据包的发送者、接受者、数据类型
// 数据：数据包具体内容
// 以太网规定了连入网络的所有设备必须具备”网卡“接口，数据包都是从一块网卡传递到另一块网卡，网卡的地址就是Mac地址。每一个Mac地址都是独一无二的，具备了一对一的能力。
// 发送数据的方法很原始，直接把数据通过ARP协议，向本翁罗的所有机器发送，接收方根据标头信息与自身Mac地址比较，一致就接受，否则丢弃。

// 四、服务器处理请求
// 参考图片enterUrl-serverHandler
// HTTPD：Apache/Nginx、IIS，监听得到的请求，然后开启一个子进程去处理这个请求。
// 处理请求：接受TCP报文后，会对链接进行处理，对HTTP协议进行解析（请求方法、域名、路径等），并且进行一些验证：验证是否匹配虚拟主机、验证虚拟主机是否接受此方法、验证该用户可以使用此方法（根据IP地址、身份信息等）
// 重定向：假如服务器配置了HTTP重定向，就会返回一个301永久重定向响应，浏览器就会根据响应，重新发送HTTP请求（重新执行上面的过程）
// URL重写：查看URL重写规则，如果请求的文件时真实存在的，比如图片、html、css、js文件等，则会直接把这个文件返回。否则服务器会按照规则把请求重写到一个REST风格的URL上。然后根据动态语言的脚本，来决定调用什么类型的动态文件解释器来处理这个请求

// 五、浏览器接受响应
// 浏览器接收到来自服务器的响应资源后，会对资源进行分析
// 首先查看response header，根据不同状态码做不同的事
// 如果响应资源进行了压缩（比如gzip），还需要进行解压
// 然后，对响应资源做缓存
// 接下来，根据响应资源里的MIME类型去解析响应内容（比如HTML、Image各有不同的解析方式）

// 六、渲染页面
// 参考图片enterUrl-browserRender
// 1.html解析：是从上往下一行一行解析的。解析的过程可以分为四个步骤
// 1-1.解码（encoding）
// 传输回来的其实都是一些二进制字节数据，浏览器需要根据文件制定编码（例如UTF-8）转换成字符串，也就是HTML代码
// 1-2.预解析（pre-parsing）
// 预解析做的事情是提前加载资源，减少处理时间，它会识别一些会请求资源的属性，比如img标签的src属性，并将这个请求加到请求队列中
// 1-3.符号化（Tokenization）
// 符号化是词法分析的过程，将输入解析成符号，HTML符号包括：开始标签、结束标签、属性名和属性值。
// 他通过一个状态机去识别符号的状态，比如遇到<，>状态都会发生变化
// 1-4.构建树（tree construction）
// 注意：符号化和构件树是并行操作的，只要解析到一个开始标签，就会构建一个DOM节点。
// 1-5.浏览器容错机制：自动纠正错误语法然后继续工作
// 1-6.事件：当整个解析的过程完成以后，浏览器会通过DOMContentLoaded事件来通过DOM解析完成
// 2.CSS解析
// 一旦浏览器下载了CSS，CSS解析器就会处理它遇到的任何CSS，根据语法规范解析出所有的CSS并进行表计划，然后得到一个规则表
// CSS匹配规则
// 按照从右到左的顺序，例如div p {}会现寻找所有的p标签然后判断它的父元素是否为div
// 尽量用id和class，不要过渡层叠
// 3.渲染树：就是一个DOM树和CSS规则树合并的过程
// 渲染树会忽略那些不要渲染的节点，比如设置了display:none的节点
// 3-1.计算
// 通过计算让任何尺寸值都减少到三个可能之一：auto/百分比/px
// 3-2.级联
// 浏览器需要一种方法来确定哪些样式才真正需要应用到对应元素，所以它使用一个叫做specificity的公式，这个公式会通过【标签名、class、id、是否内联样式、!important】得出一个权重值，取最高的那个
// 3-3.渲染阻塞
// 当遇到一个script标签时，DOM构建会被暂停，直至脚本完成执行，然后继续构建DOM树
// 但如果JS依赖CSS样式，而它还没有被下载和构建时，浏览器就会延迟脚本执行，直至CSSRules被构建
// 3-4.布局与绘制
// 确定渲染树中所有节点的集合属性，然后遍历渲染树，调用渲染器的paint()方法在屏幕上显示其内容
// 3-5.合并渲染层
// 把以上绘制的所有图片合并，最终输出一张图片
// 3-6.回流与重绘

// 七、JavaScript编译执行
// 参考图片enterUrl-jsRun
// 1.词法分析
// js脚本加载完毕后，会首先进入语法分析阶段，它首先会分析代码块的原发是否正确，不正确则抛出语法错误，停止执行。
// 分词（词法单元）-> 解析（AST）-> 代码生成（机器指令）
// 2.预编译
// js有三种运行环境：全局环境、函数环境、eval
// 每进入一个不同的运行环境都会创建一个对应的执行上下文，根据不同的上下文环境，形成一个函数调用栈，栈底永远是全局执行上下文，栈顶则永远是当前执行上下文
// 创建执行上下文
// 创建变量对象：参数、函数、变量
// 确立作用域链：确认当前执行环境是否能访问变量
// 确定this指向
// 3.执行
// 参考图片enterUrl-jsProcess
// 虽然JS是单线程的，但实际上参与工作的线程一共有四个：
// JS引擎线程：也叫JS内核，负责解析执行JS脚本程序的主线程，；例如V8引擎
// 事件触发线程：属于浏览器内核线程，主要用于控制事件，当事件被触发时，就会把事件的处理函数推进事件队列，等待JS引擎线程执行
// 定时器触发线程：主要控制setInterval和setTimeout，用来计时，计时完毕后，则把定时器的处理函数推进事件队列中，等待JS引擎线程执行
// HTTP异步请求线程：通过XMLHttpResquest连接后，通过浏览器新开的一个线程，监控readyState状态变更时，如果设置了该状态的回调函数，则将改状态的处理函数推进事件队列中，等待JS引擎线程执行

// 宏任务
// 同步任务：按照顺序执行，只有前一个任务完成后，才能执行后一个任务
// 异步任务：不直接执行，只有满足触发条件时，相关的线程将该异步任务推进任务队列中，等待JS引擎主线程上的任务执行完毕时才开始执行，例如异步Ajax、DOM事件、setTimeout等
// 微任务
// 微任务是ES6和Node环境下的，主要API有：Promise，process.nextTick
// 微任务的执行在宏任务的同步任务之后，在异步任务之前












