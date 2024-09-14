var express = require('express');
var router = express.Router();
const Categories = require("../db/models/Categories");//bunu buraya ekleyerek mongosee bize sunduklarını kullanabiliyoz
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
// biz bazı degerleri herkesin anlayabilecigi standatta oturdugumuzda buna Enum diyoruz
const AuditLogs = require("../lib/AuditLogs");


/**
 * Create
 * Read
 * Update
 * Delete
 * CRUD
 */


/* GET users listing. */
router.get('/', async(req, res, next)=> {
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
router.post("/add", async(req, res, next)=> {
     let body = req.body
     try{

      if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","name field must be filled")//Enum yapısı kullanarak hata mesajı oluşturabiliriz
        let category = new Categories({
          name : body.name,
          is_active : true,
          crated_by : req.user?._id
        });
        await category.save();
        AuditLogs.info(req.user?.email, "Categories", "Add", category);
     
        res.json(Response.successResponse({success:true}));//başarılı bir şekilde kaydedildiğinde bize success mesajı döndürüyoruz
     } catch(err){
          let errorResponse = Response.errorResponse(err);
          res.status(errorResponse.code).json(errorResponse);
     }
});

router.post("/update", async (req, res) => {
  let body = req.body;
  try {

    if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","_id field must be filled")

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

router.post("/delete", async (req, res) => {

  let body = req.body;
  try {
  
    if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","_id field must be filled")
  
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
