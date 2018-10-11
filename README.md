## UseAge
```
git clone git@github.com:LongJinCen/CROS_Demo.git

cd CROS_Demo

npm install

// 在src目录下 启动本地服务器
node index.js

// 启动demo
npm start

```

## Info

`index.js`中启用了`nodeJs`服务器，在这里就可以看成远程服务器。这里的地址是`127.0.0.1:3000`

`index1.js`是`webpack`的入口文件，即我们嵌入`html`的代码。使用`webpack`内置的`webpack-dev-server`,这里一般就是你实际的前端部署地址。这里地址是`127.0.0.1:8080`。

这样由于端口不相同，就实现了一个跨域的环境。

跨域的详细说明可以参考**Issues**, 并根据已有的环境自行测试。源码给出的是一个非简单请求。
