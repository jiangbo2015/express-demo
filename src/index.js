import mongoose from "mongoose"
import express from "express"
import logger from "morgan"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import expressJwt from "express-jwt"

import routes from "./router"
import config from "./config"

/**
 * mongoose
 */
mongoose.connect("mongodb://localhost/test")
const db = mongoose.connection
db.on("error", () => console.log("连接失败"))
db.once("open", () => console.log("连接成功"))

/**
 * express
 */
const app = express()
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

/**
 * static 要在jwt之前，不然访问静态文件有权限问题
 */
app.use(express.static("upload"))

// express-jwt是用来验证token的
app.use(
	expressJwt({
		secret: config.secret
	}).unless({
		path: ["/api/user/login", "/api/user/add", "/api/user/upload"] //设置白名单
	})
)

// 中间件，处理jwt错误
app.use(function(err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		//  这个需要根据自己的业务逻辑来处理
		return res.status(401).json({
			success: false,
			message: "invalid token..."
		})
	}
})

app.use("/api", routes)

app.listen(config.port, () => {
	console.log(`服务启动在${config.port}`)
})
