require("dotenv").config()
const db = require('../models');
const bcrypt = require('bcrypt'); // 做密碼雜湊需要引入
const jwt = require('jsonwebtoken') //做 jwt token 需引入
const Teacher = db.Teacher;
const Student = db.Student;



const MembersController = {
    login: (req, res, next)=> {
        res.json({test: "login"})
    },

    register: async (req, res, next)=> {
        var { username, identity, email, password } = req.body

        //確認身分後去找 email 是否被註冊過
        var isValid
        if (identity === "teacher") {
            isValid = await Teacher.findOne({
                where: {
                    email: email
                }
            })
        } else {
            isValid = await Student.findOne({
                where: {
                    email: email
                }
            })
        }
        if(isValid) {
            res.status(400)
            res.json(
                { errMessage: [
                    {
                        value:email,
                        msg: "email has been registered.",
                        param: "email",
                        location: "body"
                    } 
                ]}) 
            return
        }

        //雜湊加鹽密碼
        await bcrypt.hash(password, parseInt(process.env.PW_SALTROUNDS)).then(function (hash) {
            // Store hash in your password DB.
            password = hash;
        });

        // 新增資料到資料庫並返回 userId
        let userId
        if (identity === "teacher") {
            await Teacher.create({
                username, 
                password,
                email
            }).then(user => {
                userId = user.id
            })
        } else {
            var points = process.env.MB_INITIALPOINTS
            await Student.create({
                username, 
                password,
                email,
                points
            }).then(user => {
                userId = user.id
            })
        }

        return res.json({
            success: true,
            //做 token，帶入三個參數，最後一個參數為 optional
            token: jwt.sign({ name: req.body.username, userId:userId, identity:identity }, process.env.MB_SECRETKEY)
        })
    },

    getInfo: (req, res, next)=> {
        res.json({test: "getinfo"})
    },
}

module.exports = MembersController
