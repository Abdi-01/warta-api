const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    register: async (req, res, next) => {
        try {
            // Generate OTP
            let karakter = '0123456789abcdefghijklmnopqrstuvwxyz'
            let OTP = ''

            for (let i = 0; i < 6; i++) { // dibuat hanya 6 karakter
                OTP += karakter.charAt(Math.floor(Math.random() * karakter.length))
            }

            // hashing password
            let hashPassword = Crypto.createHmac("sha256", "wartaNews").update(req.body.password).digest("hex")

            // Fungsi Register
            // if (req.body.username && req.body.email && req.body.password) {
            let getFromSQL = `Insert into user (username,password,email,otp) 
                 values (${db.escape(req.body.username)},${db.escape(hashPassword)},${db.escape(req.body.email)},${db.escape(OTP)});`

            let get = await dbQuery(getFromSQL)

            let getUser = await dbQuery(`Select * from user where iduser=${get.insertId}`)
            let { iduser, username, email, role, otp, idstatus } = getUser[0]

            // Membuat Token
            let token = createToken({ iduser, username, email, role, idstatus })
            console.log("data token :", token)

            // Membuat konfigurasi email
            // 1. Konten email
            let mail = {
                from: 'Admin WARTA.com <radengugi@gmail.com>', //email pengirim, sesuai config nodemailer
                to: email, //email penerima sesuai data Select dari database
                subject: '[WARTA-WEB] Verification Email', //subject email
                html: `<div style="text-align:'center'">
                         <p>Your OTP : <b>${otp}</b></p>
                         <a href='http://localhost:3000/verification/${token}'>Verification your email</a>
                 </div>` //isi dari email
            }

            // 2. Konfigurasi Transporter
            await transporter.sendMail(mail)

            res.status(200).send({ success: true, message: "Register Success" })
        } catch (error) {
            console.log(error)
        }
    },
    getUser: async (req, res, next) => {
        try {
            // if (req.user.idrole == 1) {
            let getSQL, dataSearch = [];

            for (let prop in req.query) {
                dataSearch.push(`${prop}=${db.escape(req.query[prop])}`)
            }

            if (dataSearch.length > 0) {
                getSQL = `Select * from user where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select * from user;`
            }

            let get = await dbQuery(getSQL)
            res.status(200).send(get)
            // } else {
            //     res.status(500).send('Your cannot Get Users !!!')
            // }
        } catch (error) {
            next(error)
        }
    },
    login: async (req, res, next) => {
        try {
            if (req.body.email && req.body.password) {
                let hashPassword = Crypto.createHmac("sha256", "wartaNews").update(req.body.password).digest("hex")
                let getSQL = `Select * from user where email=${db.escape(req.body.email)} and password=${db.escape(hashPassword)};`
                let get = await dbQuery(getSQL)

                let { iduser, username, email, otp } = get[0]

                // Membuat Token
                let token = createToken({ iduser, username, email })
                console.log("data token :", token)

                res.status(200).send({ iduser, username, email, token })
            }
        } catch (error) {
            next(error)
        }
    },
    keepLogin: async (req, res, next) => {
        try {
            if (req.user.iduser) {
                let getSQL = `Select * from user where iduser=${db.escape(req.user.iduser)};`
                let get = await dbQuery(getSQL)
                let { iduser, username, email, otp } = get[0]

                // Membuat Token
                let token = createToken({ iduser, username, email })
                console.log("data token :", token)

                res.status(200).send({ iduser, username, email, token })
            }
        } catch (error) {
            next(error)
        }
    },
    verified: async (req, res, next) => {
        try {
            console.log("Hasil readToken :", req.user)
            let queryUpdate = `Update user set idstatus = 1 where iduser=${req.user.iduser};`
            queryUpdate = await dbQuery(queryUpdate)
            res.status(200).send({ success: true, messages: "Verification Success" });
        } catch (error) {
            next(error)
        }
    },
    reVerified: async (req, res, next) => {
        try {
            let hashPassword = Crypto.createHmac("sha256", "wartaNews").update(req.body.password).digest("hex")
            let getUser = await dbQuery(`Select * from user where email=${db.escape(req.body.email)} and password=${db.escape(hashPassword)};`)

            let { iduser, username, email, role, idstatus } = getUser[0]

            // Generate OTP
            let karakter = '0123456789abcdefghijklmnopqrstuvwxyz'
            let OTP = ''

            for (let i = 0; i < 6; i++) { // dibuat hanya 6 karakter
                OTP += karakter.charAt(Math.floor(Math.random() * karakter.length))
            }

            // Update otp
            await dbQuery(`Update user set otp=${db.escape(OTP)} where iduser=${iduser};`)

            // Membuat Token
            let token = createToken({ iduser, username, email, role, idstatus })

            // Membuat konfigurasi email
            // 1. Konten email
            let mail = {
                from: 'Admin WARTA.com <radengugi@gmail.com>', //email pengirim, sesuai config nodemailer
                to: email, //email penerima sesuai data Select dari database
                subject: '[WARTA-WEB] Re-Verification Email', //subject email
                html: `<div style="text-align:'center'">
                        <p>Hello ${username}, NEW OTP : <b>${OTP}</b></p>
                        <a href='http://localhost:3000/verification/${token}'>Re-Verification your email</a>
                </div>` //isi dari email
            }

            // 2. Konfigurasi Transporter
            await transporter.sendMail(mail)
            res.status(200).send({ success: true, message: "Verification Success, Check Your Email" })
        } catch (error) {
            next(error)
        }
    },
}