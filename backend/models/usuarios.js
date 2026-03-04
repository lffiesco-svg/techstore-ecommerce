import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    lastName: {type:String, required:true},
    tel: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    pass: {type:String, required:true},
    rol :{type: String, enum: ["user", "admin"], default: "user"},

    codigoRecuperacion: {type: String},
    codigoExpiracion: {type: Date}
});

// forzar que se guarde en usuarios
const usuarios = mongoose.model("usuarios", UserSchema, "usuarios");


export default usuarios;