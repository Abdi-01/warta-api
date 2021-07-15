const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, "wartaNews")
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, "wartaNews", (err, decoded) => {
            if (err) {
                return res.status(401).send("User not authorization")
            }
            req.user = decoded
            next()
        })
    }
}