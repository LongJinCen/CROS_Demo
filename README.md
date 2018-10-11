# CROS_Demo

跨域的方式多种多样，**CROS跨域资源共享**是现在比较常用的一种，和它比较像的是`document.domain`,至于其他的例如`JSONP、服务器中转代理`以及一些乱七八糟的跨域方式，其实说白了其实只是绕开了浏览器同源策略的限制而已，或者说还可以使用`src`的跨域能力。

浏览器同源策略即`协议、域名、端口`相同，非同源也就是有不同的部分，这时候请求资源是受**浏览器同源策略**的限制的。这里就来讨论**CROS跨域资源共享**是如何做到跨域的。它的关键部分在**服务器**。

## 两种请求方式

浏览器将`CORS`请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）

满足下面的两个条件就是一个简单请求：

(1) 请求方法是下面的方法之一
- HEAD
- POST
- GET

(2) `http`头信息不超出下面的字段
- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

凡是不同时满足上面两个条件，就属于非简单请求。

浏览器对这两种请求的处理，是不一样的。

## 简单请求

浏览器会自动将`origin`字段添加到`http`头部，它代表请求源，也就是你前端部署地址或者说你开发的时候你本地的地址。每次请求，服务器端会根据这个字段来确定是否允许跨域请求资源，如果该`origin`在允许范围内，那么服务端在对此次请求做出响应的时候，需要在头部添加几个字段，并赋予他们适当的值，来告知浏览器此次跨域得到了允许。这几个字段像下面这样纸。

- Access-Control-Allow-Origin： 该字段是**必须**的。它的值要么是请求时`Origin`字段的值，表示我服务器端允许以该`origin`为地址的客户端跨域请求。要么是一个`*`，表示接受任意`origin`的请求。

- Access-Control-Expose-Headers： 该字段**可选**。`CORS`请求时，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到6个基本字段：`Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma`。如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`以一个字符串，内部以逗号分隔来指定客户端能够取到其他哪些头部字段。

- Access-Control-Allow-Credentials： 这个字段**可选**。 如果浏览器在请求的时候想要自动携带该`域名`下面的`cookies`。第一，服务器端在响应的时候需要将该值设为`true`。第二，在客户端，需要将`XMLHttpRequest`对象的`withCredentials`设置为`true`。第三，返回的`Access-Control-Allow-Origin`不能设为星号，必须指定明确的、与请求网页一致。  关于`cookies`,可以参考我的[这篇博客](https://segmentfault.com/a/1190000016248401)，或等我更新`cookie`的`demo`
## 非简单请求 
非简单请求相比于简单请求，多了一个预请求(`options`)的过程。

### 预请求

如果浏览器根据此次请求方法和请求头识别出这是一个非简单请求的话，会自动发送一次预请求, 将该请求的`method`设置为`options`。并在头部添加上`origin`头部。除此之外，还要根据此次请求的内容，自动在请求头添加一些必要字段,这些字段如下。

- Access-Control-Request-Method： 此次请求(注意这里指的不是预请求)用到的方法名

- Access-Control-Request-Headers: 该字段是一个逗号分隔的字符串。如果请求中，发送除了简单请求中之外的头部信息，这里会自动列出来，表示这次请求需要发送的额外的头部信息有哪些。

###  响应预请求

同时在服务器端，当我们通过请求方法识别出这个一个`options`的时候，也需要针对这种情况给予客户端响应，以便告知浏览器这次跨域请求是否被得到了允许。在返回的响应头中，和简单请求一样，我们也需要添加一些特殊的字段，来告诉浏览器这次跨域是否被允许。如下

- Access-Control-Allow-Origin： 这里和简单请求一样。

- Access-Control-Allow-Methods： 该字段必需，它的值是逗号分隔的一个字符串。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

- Access-Control-Allow-Headers： 如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段

- Access-Control-Allow-Credentials: 和简单请求中一样。

- Access-Control-Max-Age： 该字段可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。


浏览器收到此次预请求的响应后，根据一些必选字段，来确定此次跨域是否得到了允许，如果得到了允许，接下来就会发送我们此次请求给服务器，接下来就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。注意这里简单请求返回的头部中可以设置` Access-Control-Allow-Credentials`,这个字段在非简单请求中，在预请求返回的头部中就设置。
