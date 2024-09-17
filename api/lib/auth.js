const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("./Response"); 
const { HTTP_CODES } = require("../config/Enum"); 
const config = require("../config");

const privs = require("../config/role_privileges");
const CustomError = require("./Error");
module.exports = function () {
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        try {

            let user = await Users.findOne({ _id: payload.id });

            if (user) {
/*Kullanıcı Rollerini Almak:*/    let userRoles = await UserRoles.find({ user_id: payload.id });

/*Rollerin Yetkilerini Almak:*/   let rolePrivileges = await RolePrivileges.find({ role_id: { $in: userRoles.map(ur => ur.role_id) } });

/*Yetkileri Belirlemek:*/         let privileges = rolePrivileges.map(rp => privs.privileges.find(x => x.key == rp.permission))

/*1 günlük gecerli jwt token olusşturma*/
                         done(null, {//eger ilk paramatre null olmazsa user bulunamadı hatası döner
                    id: user._id,
                    roles: privileges,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    language: user.language,
                    exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME
                });

            } else {
                done(new Error("User not found"), null);
            }

        } catch (err) {
            done(err, null);
        }

    });

    passport.use(strategy);
     return {
        initialize: function () {//Bu fonksiyon, passport kütüphanesini başlatmak için kullanılır. passport genellikle kimlik doğrulama işlemleri için kullanılan bir Node.js kütüphanesidir.
            return passport.initialize();
        },
        authenticate: function () {//JWT token'ı ile kimlik doğrulama yapmak için kullanılır.
            return passport.authenticate("jwt", { session: false })
        },
        checkRoles: (...expectedRoles) => {
            return (req, res, next) => {

                let i = 0;
                let privileges = req.user.roles.filter(x => x).map(x => x.key);/*Rollerin Alınması ve Kontrolü:*/ 

                while (i < expectedRoles.length && !privileges.includes(expectedRoles[i])) i++;/* İzinlerin Kontrolü: */
                if (i >= expectedRoles.length) {
                    let response = Response.errorResponse(new CustomError(HTTP_CODES.UNAUTHORIZED, "Need Permission", "Need Permission"));
                    return res.status(response.code).json(response);
                }

                return next(); // Authorized  Yetkili İse Devam Etme:


            }
        }
    }
}

/*
  > JSON Web Token (JWT), iki sistem (genellikle bir istemci ve bir sunucu) arasında
   güvenli bir şekilde bilgi alışverişi yapmak için kullanılan bir standarttır. 

 > checkRoles: Bu kod parçası, bir kullanıcı isteğinin (request) belirli bir rol ya da 
 yetkiye sahip  olup olmadığını kontrol eden bir middleware fonksiyonu. Bu tür bir yapı,  
 özellikle role-based access control (RBAC) olarak bilinen rol tabanlı erişim kontrolü 
 için  kullanılır.AŞAĞIDA checkRoles ADIM ADIM ACIKLANMIŞTIR.
  -  Rollerin Alınması ve Kontrolü:
+ req.user.roles: Kullanıcının rolleri burada yer alıyor. Genellikle bu bilgi, kimlik doğrulama aşamasında belirlenir ve kullanıcının JWT (JSON Web Token) ya da oturum verileriyle gelir.
+ filter(x => x): Rollerin boş veya geçersiz olmayanları filtrelenir.
+ map(x => x.key): Bu adım, her bir rol objesinden yalnızca rolün anahtarını (muhtemelen admin, editor, user gibi) almak için kullanılır. Bu şekilde, kullanıcının sahip olduğu roller bir dizi içinde saklanır: privileges.
     
  -  İzinlerin Kontrolü:
+ Bu while döngüsü, kullanıcıya atanan rolleri (privileges), beklenen roller (expectedRoles) ile karşılaştırır. Eğer beklenen rollerden biri kullanıcının rollerinde varsa, döngü sona erer.
      
  -  Yetki Yetersizliği Durumu:
+ Eğer döngü sonunda kullanıcının sahip olduğu roller, beklenen rollerle uyuşmuyorsa, bu kısım devreye girer.
+ Kullanıcı yetkili değilse, 401 Unauthorized statüsü döner ve bir hata mesajı ile yanıt oluşturulur.


*/