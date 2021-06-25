const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    addNews: async (req, res, next) => {
        try {
            let queryInsert = `Insert into news set ?`
            queryInsert = await dbQuery(queryInsert, { ...req.body })

            res.status(200).send({ status: "Success Add News ✅", results: queryInsert })
        } catch (error) {
            next(error)
        }
    },
    getNews: async (req, res, next) => {
        try {
            // if (req.user.idrole == 1) {
            let getSQL, dataSearch = [];

            for (let prop in req.query) {
                dataSearch.push(`${prop}=${db.escape(req.query[prop])}`)
            }

            if (dataSearch.length > 0) {
                getSQL = `Select * from news where ${dataSearch.join(' AND ')};`
            } else {
                getSQL = `Select * from news;`
            }

            let get = await dbQuery(getSQL)
            res.status(200).send(get)
        } catch (error) {
            next(error)
        }
    },
    updateNews: async (req, res, next) => {
        try {
            let { idnews, judul, deskripsi, kategori, images } = req.body
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
}