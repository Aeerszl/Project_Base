const express = require("express");
const router = express.Router();

// req bize gonderilen istegin icinde bulunan bilgileri tutar
// res bize cevap vermemiz icin gerekli olan fonksiyonlari saglar
// next bir sonraki router'e gecmemizi saglar
router.get("/:id", (req, res, next) => {
    res.json({
        body: req.body,
        params: req.params,
        query: req.query,
        header: req.headers,
      });


});
module.exports = router;