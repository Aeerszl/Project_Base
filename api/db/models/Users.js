const mongoose = require("mongoose"); //mongoose, MongoDB veritabanıyla etkileşim kurmak için kullanılan bir Node.js kütüphanesidir.

const schema = mongoose.Schema({
    email: { type: String, required: true, unique: true },//unique aynı kullanıcıdan iki tane oluşturulmasını engeller
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    first_name: String,
    last_name: String,
    phone_number: String,
    
} , {
    versionKey: false,//false, __v sürüm anahtarını devre dışı bırakır.
    timestamps: {
        createdAt: "created_at",//Belgenin ne zaman oluşturulduğunu tutar.
        updatedAt: "updated_at"//Belgenin ne zaman güncellendiğini tutar.
    }
});
//bir classtan türetilen farklı classlar oluşturulabilir "extends ile".
class Users extends mongoose.Model {

    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    static validateFieldsBeforeAuth(email, password) {
        if (typeof password !== "string" || password.length < PASS_LENGTH || is.not.email(email))
            throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Validation Error", "email or password wrong");

        return null;
    }

}

schema.loadClass(Users);//bu classı schema'ya yükler
module.exports = mongoose.model("users", schema);// modeli export ediyoruz ki başka yerlerde kullanabilelim.