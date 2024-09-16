const express = require("express");
const moment = require("moment");//terminalde npm install moment yazarak indirebilirsiniz
const Response = require("../lib/Response");
const AuditLogs = require("../db/models/AuditLogs");  
const router = express.Router();

// req bize gonderilen istegin icinde bulunan bilgileri tutar
// res bize cevap vermemiz icin gerekli olan fonksiyonlari saglar
// next bir sonraki router'e gecmemizi saglar
router.post("/", async (req, res) => {
try {
  let body = req.body;
  let query = {};
  let skip=body.skip;
  let limit=body.limit;
  if( typeof  body.skip!=="number"){
    skip=0;
  }
  if(typeof body.limit !=="number"|| body.limit>500){ 
    limit=500;
  }
  if(body.begin_date && body.end_date){
      query.created_at = {
        $gte: moment(body.begin_date),//gte:buyuk esit anlamına gelir
        $lte: moment(body.end_date)//lte:kucuk esit anlamına gelir
      }
  }
  else{
    query.created_at = {
      $gte:moment().subtract(1, "day").startOf("day"),//bir gün önceki tüm logları getirir
      $lte:moment()//şu anki tüm logları getirir 
    }

  }                                                                    //created_at:-1 demek en son eklenen en başta olacak
  let auditLogs = await AuditLogs.find(query).sort({ created_at: -1 }).skip(skip).limit(limit);
  res.json(Response.successResponse(auditLogs));
} 


catch (err) {
  let errorResponse = Response.errorResponse(err);
  res.status(errorResponse.code).json(errorResponse);
}
});
module.exports = router;