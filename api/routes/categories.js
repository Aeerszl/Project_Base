var express = require('express');
var router = express.Router();
const Categories = require("../db/models/Categories");//bunu buraya ekleyerek mongosee bize sunduklarını kullanabiliyoz
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
// biz bazı degerleri herkesin anlayabilecigi standatta oturdugumuzda buna Enum diyoruz
const AuditLogs = require("../lib/AuditLogs");
const logger = require("../lib/logger/LoggerClass");
const config = require('../config');
const auth = require("../lib/auth")(); // auth fonksiyonunu çağırarak import edin
const i18n = new (require("../lib/i18n"))(config.DEFAULT_LANG);
const emitter = require("../lib/Emitter");
/**
 * Create
 * Read
 * Update
 * Delete
 * CRUD
 */
router.all("*", auth.authenticate(), (req, res, next) => {
  next();
    
  });

/* GET users listing. */
router.get('/',auth.checkRoles("category_view"), async(req, res,next )=> {
  try{
    let categories = await Categories.find();//await kulanacaksan async kullanmalısın
    res.json(Response.successResponse(categories));//bize donen veriyi json formatında döndürüyoruz
  }
   /*endpointlerde request response yapısı belirlemliyiz
   bu yuzden bir lib klasoru olusturup orda hata mesajlarını yazabiliriz*/
  catch(err){ 
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
            }
});
router.post("/add",/*auth.checkRoles("category_add"), */async(req, res, )=> {
     let body = req.body
     try{

      if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["name"]));
      let category = new Categories({
          name : body.name,
          is_active : true,
          crated_by : req.user?._id
        });
        await category.save();

        AuditLogs.info(req.user?.email, "Categories", "Add", category);
        logger.info(req.user?.email, "Categories", "Add", category);
        emitter.getEmitter("notifications").emit("messages", { message: category.name + " is added" });
     
        res.json(Response.successResponse({success:true}));//başarılı bir şekilde kaydedildiğinde bize success mesajı döndürüyoruz
     } catch(err){
        logger.error(req.user?.email, "Categories", "Add", err);
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
     }
});

router.post("/update",auth.checkRoles("category_update"), async (req, res) => {
  let body = req.body;
  try {

    if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));

      let updates = {};

      if (body.name) updates.name = body.name;
      if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
        //burada is active booelan ise ekle 
      await Categories.updateOne({ _id: body._id }, updates);
      //kaydetme işlemi yap
   
   
      AuditLogs.info(req.user?.email, "Categories", "Update",{_id: body._id, ...updates});
     
 res.json(Response.successResponse({ success: true }));

  } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
  }
})

router.post("/delete",auth.checkRoles("category_delete"), async (req, res) => {

  let body = req.body;
  try {
  
    if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE", req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED", req.user.language, ["_id"]));
  
      await Categories.deleteOne({ _id: body._id });// mogosse da artık remove yerine deleteOne kullanıyoruz

      AuditLogs.info(req.user?.email, "Categories", "Delete",{_id: body._id});

      res.json(Response.successResponse({ success: true }));
   }
    catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
  })

module.exports = router;

/* NOTLAR ✍️:
GET Listelemek için kullanılır.
POST kaydetme için kullanılır.
PUT güncelleme için kullanılır.
DELETE silme için kullanılır.
*/