var express = require('express');
const bcrypt = require("bcrypt-nodejs");
const is= require('is_js');//is_js kütüphanesi ile veri türü kontrolü yapılabilir
var router = express.Router();
const Response = require("../lib/Response");
const Users = require('../db/models/Users');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const UserRoles = require('../db/models/UserRoles');
const Roles = require('../db/models/Roles');
/* GET users listing. */
router.get('/', async(req, res, next) =>{
try{
  let users = await Users.find();
  res.json(Response.successResponse(users));
}
catch(err){
let errorResponse = Response.errorResponse(err);
res.status(errorResponse.status).json(errorResponse);
}

});

//ADD USER
router.post("/add"  , async(req, res, next) =>{
let body = req.body;
try{ 
  if(!body.email  ) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","email field must be filled");
  
  if(!is.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","email field must be an email format");/*email kontrol  !is yerine is.not kullanılabilr*/
  
  if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","password field must be filled");

  if(body.password.length < Enum.PASS_LENGHT){
    throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","password LENGH MUST BE GREATER THAN 8"+Enum.PASS_LENGHT);

  } 
 //kullanıcı eklerken rolde eklemek lazım
 if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0) {
  throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","roles field must be filled and must be an array");
}

let roles = await Roles.find({ _id: { $in: body.roles } });

if (roles.length == 0) {
  throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","roles field must be filled and must be an array");
}



  let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8),null);//şifreleme işlemi yapılıyor

  await Users.create({
email: body.email,
password,// bu şekilde şifrenin acık bir şekilde veritabanına kaydedilmesi güvenli değildir o yüzden hashleme yapılmalıdır
is_active: true,
first_name: body.first_name,
last_name: body.last_name,
phone_number: body.phone_number  
}) 

 //rol atama işlemi  
for (let i = 0; i < roles.length; i++) {
  await UserRoles.create({
    role_id: roles[i]._id,
    user_id: user._id
  })
}



//save yerine create kullandık
res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({success: true},Enum.HTTP_CODES.CREATED));


} catch(err){
  let errorResponse = Response.errorResponse(err);
  res.status(errorResponse.status).json(errorResponse);
}
})

//UPDATE USER
 router.post("/update" , async(req, res, next) =>{
      let body = req.body;
      try{
            let updates = {};

            if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","_id field must be filled");
             if(body.password && body.password.length < Enum.PASS_LENGHT)
              {
               updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8),null);      
              }             
             if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
             if(body.first_name) updates.first_name = body.first_name;
             if(body.last_name) updates.last_name = body.last_name;
             if(body.phone_number) updates.phone_number = body.phone_number; 
               
           
    if (Array.isArray(body.roles) && body.roles.length > 0) {

      let userRoles = await UserRoles.find({ user_id: body._id });

      let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id));
      let newRoles = body.roles.filter(x => !userRoles.map(r => r.role_id).includes(x));

      if (removedRoles.length > 0) {
        await UserRoles.deleteMany({ _id: { $in: removedRoles.map(x => x._id.toString()) } });
      }

      if (newRoles.length > 0) {
        for (let i = 0; i < newRoles.length; i++) {
          let userRole = new UserRoles({
            role_id: newRoles[i],
            user_id: body._id
          });

          await userRole.save();
        }
      }

    }
         await Users.updateOne({_id: body._id}, updates);
          res.json(Response.successResponse({success: true}));
           
         }

       catch(err){ 
                    let errorResponse = Response.errorResponse(err);
                    res.status(errorResponse.code).json(errorResponse);
                 
                }
     })

     //DELETE USER
     router.post("/delete", async(req, res, next) =>{
       let body = req.body;
       try{
         if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error! ","_id field must be filled");
         await Users.deleteOne({_id: body._id});
         await UserRoles.deleteMany({user_id: body._id});
         res.json(Response.successResponse({success: true}));
       }
       catch(err){
         let errorResponse = Response.errorResponse(err);
         res.status(errorResponse.status).json(errorResponse);
       }
     })

// Register ADD USER
router.post("/register", async (req, res) => {
  let body = req.body;
  try {

    let user = await Users.findOne({});

    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }

    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "email field must be filled");

    if (is.not.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "email field must be an email format");

    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "password field must be filled");

    if (body.password.length < Enum.PASS_LENGTH) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "password length must be greater than " + Enum.PASS_LENGTH);
    }

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let createdUser = await Users.create({
      email: body.email,
      password,
      is_active: true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });

    let role = await Roles.create({
      role_name: Enum.SUPER_ADMIN,
      is_active: true,
      created_by: createdUser._id
    })

    await UserRoles.create({
      role_id: role._id,
      user_id: createdUser._id
    });



    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
})

  


module.exports = router;
