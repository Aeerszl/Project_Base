const mongoose = require("mongoose"); //mongoose, MongoDB veritabanıyla etkileşim kurmak için kullanılan bir Node.js kütüphanesidir.

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


}

schema.loadClass(Roles);//bu classı schema'ya yükler
module.exports = mongoose.model("roles", schema);// modeli export ediyoruz ki başka yerlerde kullanabilelim.