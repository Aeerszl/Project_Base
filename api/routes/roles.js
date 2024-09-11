const  express = require("express");
const router = express.Router();

const Roles = require("../db/models/Roles");
const RolePrivileges = require('../db/models/RolePrivileges'); // Modeli içe aktarın
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const role_privileges = require("../config/role_privileges");
router.get("/", async (req, res) => {
    try {
        let roles = await Roles.find();
        res.json(Response.successResponse(roles));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});


router.post("/add", async (req, res) => {
    let body = req.body;
       try {
            if(!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","role_name field must be filled")//Enum yapısı kullanarak hata mesajı oluşturabiliriz
           
           //permission alanı boş olamaz ve bir dizi olmalıdır ve  dizide en az bir eleman olmalıdır
            if(!body.permission || !Array.isArray(body.permission) || body.permission.length == 0) {
         throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","permissions field must be filled")//Enum yapısı kullanarak hata mesajı oluşturabiliriz


          }  
   
           let role =new Roles({
           role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id//? işareti eğer req.user varsa id yi al yoksa null döndür
           });
           await role.save();
                   
     //RolePrivileges alanına ekleme yapacaz birden fazla
       for (let i = 0; i < body.permission.length; i++) {
                let priv= new RolePrivileges({
                    role_id: role._id,
                    permission: body.permission[i],
                    created_by: req.user?.id
                });//RolePrivileges modelinden yeni bir nesne oluşturuyoruz
            await priv.save();//oluşturduğumuz nesneyi kaydediyoruz     
            }
            res.json(Response.successResponse({success: true}));
    
        } catch (err) {
           let errorResponse = Response.errorResponse(err);
           res.status(errorResponse.code).json(errorResponse);
       }
   
   });

   router.post("/update", async (req, res) => {
    let body = req.body;
       try {
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","_id field must be filled")//Enum yapısı kullanarak hata mesajı oluşturabiliriz
   
              let updates = {};
                if (body.role_name) updates.role_name = body.role_name;
                if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
               
                if(body.permission && Array.isArray(body.permission) && body.permission.length > 0) {
                
                let permission = await RolePrivileges.find({role_id: body._id}); 
                
            // body.permissions => ["category_view", "user_add"]
            // permissions => [{role_id: "abc", permission: "user_add", _id: "bcd"}]; şeklinde olacak
  /*silinenler*/let removedPermissions = permission.filter(x => !body.permission.includes(x.permission));       
 /*eklenenler*/let newPermissions = body.permission.filter(x => !permission.map(p=>p.permission).includes(x));
                                         // map kullanmamızın sebebi sadece permission alanını almak istememiz
            
            
            if(removedPermissions.length > 0) {
                  await RolePrivileges.deleteMany({ _id: { $in: removedPermissions.map(x => x._id) } });
                  }

                  if (newPermissions.length > 0) {
                    for (let i = 0; i < newPermissions.length; i++) {
                        let priv = new RolePrivileges({
                            role_id: body._id,
                            permission: newPermissions[i],
                            created_by: req.user?.id
                        });
                        await priv.save();
                    }
                }
             }           
              await Roles.updateOne({ _id: body._id }, updates);

            res.json(Response.successResponse({success: true}));
       } catch (err) {
           let errorResponse = Response.errorResponse(err);
           res.status(errorResponse.code).json(errorResponse);
       }
   
   });


   //role i silerken aynı zamanda role_privileges tablosundan da silme işlemi yapılacak
   // farklı olarak bunu Role.js de yaptık burada da yapabilirdik
   router.post("/delete", async (req, res) => {
    let body = req.body;
       try {
            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation error!","_id field must be filled")//Enum yapısı kullanarak hata mesajı oluşturabiliriz
     
                await Roles.deleteMany({ _id: body._id });
                
            res.json(Response.successResponse({success: true}));
       } catch (err) {
           let errorResponse = Response.errorResponse(err);
           res.status(errorResponse.code).json(errorResponse);
       }
   
   });
   router.get("/role_privileges", async (req, res) => {
    res.json(role_privileges);
});
module.exports = router;