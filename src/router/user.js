import express from "express"
import jwt from "jsonwebtoken"
import multer from "multer"

import UserModel from "../model/user"
import config from "../config"

const router = express.Router()
const storage = multer.diskStorage({
	destination: "./upload",
	filename: function(req, file, cb) {
		let arr = file.originalname.split(".")
		cb(null, `${Date.now()}.${arr[arr.length - 1]}`)
	}
})
const upload = multer({
	storage
})

router.post("/add", (req, res) => {
	const { name, password } = req.body
	const newUser = new UserModel({ name, password })
	newUser.save(err => {
		if (!err) {
			return res.json({
				success: true,
				message: "操作成功"
			})
		}
		return res.json({
			success: false,
			message: err
		})
	})
})
router.get("/find", (req, res) => {
	UserModel.find((err, data) => {
		if (!err) {
			return res.json({
				success: true,
				message: "操作成功",
				data
			})
		}
		return res.json({
			success: false,
			message: "操作失败"
		})
	})
})

router.post("/login", (req, res) => {
	const { name, password } = req.body

	UserModel.findOne(
		{
			name
		},
		(err, user) => {
			if (err) throw err
			if (!user) {
				return res.json({
					success: false,
					message: "账号不存在"
				})
			}
			if (user.password !== password) {
				return res.json({
					success: false,
					message: "用户名或密码错误"
				})
			}
			const token = jwt.sign(
				{
					username: name
				},
				config.secret,
				{
					expiresIn: 60
				}
			)
			return res.json({
				success: true,
				message: "请使用您的授权码",
				data: token
			})
		}
	)
})

router.get("/valid", (req, res) => {
	res.json({
		success: true,
		message: "操纵成功"
	})
})

router.post("/upload", upload.single("file"), (req, res) => {
	console.log(req)
	res.json({
		success: true,
		message: "接收到了",
		data: req.file
	})
})

export default router
