// HTTP + SSL
// 开始加密通信之前，客户端和服务器首先必须建立连接和交换参数，这个过程叫做握手。
// 握手阶段分成五步：
// 1.客户端给出协议版本号、一个客户端生成的随机数[Client random]，以及客户端支持的加密方法。
// 2.服务端确认双方使用的加密方法，并给出数字证书，以及一个服务端生成的随机数[Server random]。
// 3.客户端确认数字证书有效，然后生成一个新的随机数[Premaster secret]，并使用数字证书中的公钥，加密这个随机数，发给服务端。
// 4.服务端使用自己的私钥，获取客户端发来的随机数。
// 5.客户端和服务端根据约定的加密方法，使用前面的三个随机数，生成对话密钥[sessionkey]，用来加密接下来的整个对话过程。

// 客户端如何验证证书的合法性
// 1.首先浏览器读取证书中的证书所有者、有效期等信息进行校验，校验证书的网站域名是否与证书颁发的域名一致，校验证书是否在有效期内。
// 2.浏览器开始查找操作系统中已内置的收信任的证书发布机构CA，与服务器发来的证书中的颁发者CA比对，用于校验证书是否为合法机构颁发。
// 3.如果找不到，浏览器就会报错，说明服务器发来的证书是不可信任的。
// 4.如果找到，那么浏览器就会从操作系统中取出颁发者CA的公钥（多数浏览器开发商发布版本时，会事先在内部植入常用认证机关的公开密钥），然后对服务器发来的证书里面的签名进行解密。
// 5.浏览器使用相同的hash算法计算出服务器发来的证书的hash值，将这个计算的hash值与证书中签名做对比。
// 6.对比结果一致，则证明服务器发来的证书合法，没有被冒充。
