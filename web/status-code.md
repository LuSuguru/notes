### HTTP状态码（描述返回的请求结果）

状态码|类别|原因短语
---|---|---
1XX|信息性状态码|接收的请求正在处理
2XX|成功状态码|请求正常处理完毕
3XX|重定向状态码|需要进行附加操作已完成请求
4XX|客户端错误状态码|服务器无法处理请求
5XX|服务器错误状态码|服务器处理请求错误

#### 2XX 成功
- 200（OK）：从客户端发来的请求在服务器端被正常处理
- 204（No Content）：服务器接收的请求已成功处理，但在返回的响应报文中不含实体的主体部分（不允许返回任何实体的主体）
- 206（Partial Content）：客户端进行了范围请求，而服务器成功执行了这部分的GET请求

#### 3XX 重定向
- 301（Moved Permanently）：永久性重定向。请求的资源已被分配了新的URI，以后应使用资源现在所指的URI
- 302（Found）：临时性重定向。该状态码表示请求的资源已被分配了新的URI，希望用户（本次）能使用新的URI访问
- 303（See Other）：该状态码与302有着相同的功能，但303状态码明确表示客户端应当采用GET方法获取资源

注意：当301、302、303响应状态码返回时，几乎所有的浏览器都会把POST改成GET，并删除请求报文内的主体，之后请求后自动再次发送

- 304（Not Modified）：服务器端资源未改变，可直接使用客户端未过期的缓存
- 307（Temporary Redirect）：与302含义相同，但会遵照浏览器标准，不会从POST变成GET

#### 4XX 客户端错误
- 400（Bad Request）：请求报文存在语法错误，需修改请求的内容后再次发送请求，浏览器会像200一样对待该状态码
- 401（Unauthorized）：发送的请求需要有通过HTTP认证（BASIC认证、DIGEST认证）的认证信息。若之前已进行过1次请求，则表示用户认证失败
- 403（Forbidden）：对请求资源的访问被服务器拒绝。服务端可以在实体的主体部分对原因进行描述
- 404（Not Found）：服务器上无法找到请求的资源，除此之外，也可以在服务器端拒绝请求且不想说明理由时使用

#### 5XX 服务端错误
- 500（Internal Server Error）：服务器端在执行请求时发生了错误。也有可能是Web应用存在的bug或某些临时的故障
- 503（Service Unavailable）：服务器暂时处于超负荷或正在进行停机维护，现在无法处理请求