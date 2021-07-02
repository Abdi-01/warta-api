const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    addNews: async (req, res, next) => {
        try {
            let { judul, deskripsi, kategori, images, author, view } = req.body
            let queryInsert = `Insert into news (judul,deskripsi, kategori, images, author, view)
            values (${db.escape(judul)},${db.escape(deskripsi)},${db.escape(kategori)},
            ${db.escape(images)},${db.escape(author)},${db.escape(view)});`
            // let queryInsert = `Insert into news set ?`
            // queryInsert = await dbQuery(queryInsert, { ...req.body })
            queryInsert = await dbQuery(queryInsert)

            res.status(200).send({ status: "Success Add News ✅", results: queryInsert })
        } catch (error) {
            next(error)
        }
    },
    getNews: async (req, res, next) => {
        try {
            // if (req.user.idrole == 1) {
            let getSQL, dataSearch = [],
                getKomentar = `Select * from komentar;`

            for (let prop in req.query) {
                dataSearch.push(`${prop}=${db.escape(req.query[prop])}`)
            }

            if (dataSearch.length > 0) {
                getSQL = `Select * from news where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select * from news;`
            }

            let get = await dbQuery(getSQL)
            let getComment = await dbQuery(getKomentar)
            get.forEach(item => {
                item.comment = []
                getComment.forEach(el => {
                    if (item.idnews == el.idnews) {
                        item.comment.push(el)
                    }
                })
            })
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    updateNews: async (req, res, next) => {
        try {
            let { idnews, judul, deskripsi, kategori, images } = req.body
            console.log(req.body)
            let queryUpdate = `Update news set judul = ${db.escape(judul)}, deskripsi = ${db.escape(deskripsi)},
            kategori = ${db.escape(kategori)}, images = ${db.escape(images)} where idnews=${db.escape(idnews)};`

            await dbQuery(queryUpdate)
            res.status(200).send({ status: "Success Update News ✅", results: queryUpdate })
        } catch (error) {
            next(error)
        }
    },
    deleteNews: async (req, res, next) => {
        try {
            await dbQuery(`Delete from news where idnews=${req.params.idnews};`)
            res.status(200).send("Delete product success ✅")
        } catch (error) {
            next(error)
        }
    },
    updateView: async (req, res, next) => {
        try {
            let { idnews, view } = req.body
            await dbQuery(`Update news set view = ${db.escape(view)} where idnews =${idnews}`)
            res.status(200).send("Update view success✅")
        } catch (error) {
            next(error)
        }
    },
    addKomentar: async (req, res, next) => {
        try {
            // let { idnews, komentar } = req.body
        
            let queryInsert = `Insert into komentar (idnews, komentar, iduser)
                values (${db.escape(req.body.idnews)}, ${db.escape(req.body.komentar)}, ${db.escape(req.body.iduser)});`

            queryInsert = await dbQuery(queryInsert)
            // console.log("Cek Komentar :", queryInsert)

            // let { idkomentar, idnews, iduser, komentar } = queryInsert[0]

            // // Membuat Token
            // let token = createToken({ idkomentar, idnews, iduser, komentar })
            // console.log("data token :", token)

            // res.status(200).send({ idkomentar, idnews, iduser, komentar, token })
            res.status(200).send({ status: "Success Add Komentar ✅", results: queryInsert })
        } catch (error) {
            next(error)
        }
    },
    getKomentar: async (req, res, next) => {
        try {
            let getSQL, dataSearch = [];

            for (let prop in req.query) {
                dataSearch.push(`${prop}=${db.escape(req.query[prop])}`)
            }

            if (dataSearch.length > 0) {
                getSQL = `select idkomentar, idnews, komentar, username from komentar k JOIN user u on u.iduser = k.iduser where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `select idkomentar, idnews, komentar, username from komentar k JOIN user u on u.iduser = k.iduser;`
            }

            let get = await dbQuery(getSQL)
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    deleteKomentar: async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    },
}