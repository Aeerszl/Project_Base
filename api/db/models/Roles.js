const mongoose = require("mongoose"); //mongoose, MongoDB veritabanıyla etkileşim kurmak için kullanılan bir Node.js kütüphanesidir.
const RolePrivileges = require("./RolePrivileges");
const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
    is_active: {type: Boolean, default: true},
   created_by: {
    type: mongoose.SchemaTypes.ObjectId
   },
} , {
    versionKey: false,//false, __v sürüm anahtarını devre dışı bırakır.
    timestamps: {
        createdAt: "created_at",//Belgenin ne zaman oluşturulduğunu tutar.
        updatedAt: "updated_at"//Belgenin ne zaman güncellendiğini tutar.
    }
});
//bir classtan türetilen farklı classlar oluşturulabilir "extends ile".
class Roles extends mongoose.Model {
  static async  deleteMany(query) {
 
    if(query._id){// sadece _id varsa çalışır
      await  RolePrivileges.deleteMany({role_id: query._id})//eger role silinirse role_id si aynı olan role_privileges tablosundaki verileri de siler
     }

      await super.deleteMany(query); //super mongoose.Model den geliyor
    }
}
schema.loadClass(Roles);//bu classı schema'ya yükler
module.exports = mongoose.model("roles", schema);// modeli export ediyoruz ki başka yerlerde kullanabilelim.