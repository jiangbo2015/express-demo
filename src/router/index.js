import express from "express"

import userRouter from "./user"
import config from "../config"

const router = express.Router()

/**
 * 使用session验证时，在此处做拦截
 */
if (config.authentication !== "jwt") {
	router.use(function(req, res) {
		if (!req.session || !req.session.userName) {
			return res.status(401).json({
				success: false,
				message: "invalid session..."
			})
		}
	})
}

router.use("/user", userRouter)

export default router
