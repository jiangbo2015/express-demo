### express API demo

> 使用es6语法，所以需要支持es6的node环境，用的babel-node，nodemon 用来每次改动文件后，自动重启应用

### 一些库

- express-jwt
- jwt
- express-session
- cookie-parser
- body-parser
- multer


### 两种认证方式 session/jwt

`config.js`默认设置authentication为jwt, 更换为session，则切换为session验证

> session验证模式下，session拦截器在router/index.js里面