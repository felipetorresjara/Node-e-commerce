const { response } = require("express");

const searchInfo = (req, res = response) => {
    res.json({
        msg: 'Search ...'
    })
}

module.exports = {
    searchInfo
}