require("dotenv").config()
const bcrypt = require('bcrypt'); // 做密碼雜湊需要引入
const jwt = require('jsonwebtoken') //做 jwt token 需引入
const db = require('../models');
const Teacher = db.Teacher;
const Student = db.Student;

const MembersController = {
    login: async (req, res, next)=> {
        var { identity, email, password } = req.body
        //去資料庫找是否有其 email，有則回傳該使用者
        var user
        if (identity === "teacher") {
            user = await Teacher.findOne({  
                where: {
                    email
                }
            })
        } else if (identity === "student") {
            user = await Student.findOne({
                where: {
                    email
                }
            })
        } else {
            res.json({   
                success: false,
                value:identity,
                errMessage:["cant find the identity"]
            })
            return
        }

        if (!user) {
            res.status(400)
            res.json({   
                success: false,
                value:email,
                errMessage:["cant find the user"]
            })
            return
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            res.status(400)
            res.json({   
                success: false,
                errMessage:["password is wrong"]
            })
            return 
        }
        if (isValid) {
            return res.json({
                success: true,
                token: jwt.sign({ name: user.username, userId:user.id, identity:identity}, process.env.MB_SECRETKEY)
            })
        }
    
    },

    register: async (req, res)=> {
        var { username, identity, email, password } = req.body
        try {
            await bcrypt.hash(password, parseInt(process.env.PW_SALTROUNDS)).then(function (hash) {
                // Store hash in your password DB.
                password = hash;
            });
        }catch(err) {
        }
        //雜湊加鹽密碼
        

        // 新增資料到資料庫並返回 userId
        let userId
        try {
            if (identity === "teacher") {
                await Teacher.create({
                    username, 
                    password,
                    email
                }).then(user => {
                    userId = user.id
                })
            } else if (identity === "student") {
                var points = process.env.MB_INITIALPOINTS
                await Student.create({
                    username, 
                    password,
                    email,
                    points
                }).then(user => {
                    userId = user.id
                })
            } else {
                res.status(400)
                res.json({   
                    success: false,
                    value:identity,
                    errMessage:["cant find the identity"]
                })
                return
            }
        } catch(err) {
            //email 是否被註冊過或其他錯誤
            var errMessage = (err.errors[0].message === "email must be unique") ? "email has been registerd": "please contact us"
            res.status(400)
            res.json({   
                success: false,
                errMessage: [errMessage]
            })
            return
        }
        

        return res.json({
            success: true,
            token: jwt.sign({ name: req.body.username, userId:userId, identity:identity }, process.env.MB_SECRETKEY)
        })
    },

    getInfo: (req, res, next)=> {
        let authHeader = req.header('Authorization') || ''
        const token = authHeader.replace('Bearer ', '')
        // 如果沒有 token 時回傳錯誤
        let jwtData
        try {
            jwtData = jwt.verify(token, process.env.MB_SECRETKEY)
        }catch(err) {
            res.status(400)
            res.json({   
                success: false,
                errMessage: ["token is wrong"]
            })
            return
        }
        

        if (!jwtData) {
            res.status(400)
            res.json({   
                success: false,
                errMessage: ["token is wrong"]
            })
            return
        }

        return res.json({
            success: true,
            user:jwtData
        })
    },
}

module.exports = MembersController
