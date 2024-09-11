const mongoose = require("mongoose");
/*role_id  roles tablosundaki _id ye denk geliyor
  permission role_privileges  deki key alanına denk geliyor
  created_by  kimin eklediğini tutuyor
*/
const schema = mongoose.Schema({
    role_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    permission: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
class RolePrivileges extends mongoose.Model {

}

schema.loadClass(RolePrivileges);
module.exports = mongoose.model("role_privileges", schema);