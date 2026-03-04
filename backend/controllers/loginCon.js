import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usuarios from "../models/usuarios.js";

export const login = async (req, res) => {
    try {
        const{email, pass}=req.body;
        // validar campos llenos
        if(!email || !pass) {
            return res.status(400).json({message: "Por favor, ingrese correo y contraseña"})
        };

        // validar si existe el usuario
        const verificarUsuario = await usuarios.findOne({email});
        if (!verificarUsuario) {
            return res.status(401).json({message: "Este usuario no existe"});
        };

        // validar contraseña


        const verificarPass = await bcrypt.compare(pass, verificarUsuario.pass);
        if (!verificarPass) {
            return res.status(401).json({message: "contraseña incorrecta"})
        };

        // Generamos el token JWT con el rol incluido
        const token = jwt.sign({
            id: verificarUsuario._id,
            rol: verificarUsuario.rol,

        },
        process.env.JWT_SECRET,
        {expiresIn: '2h'}
            
        );
        // validar
        res.status(200).json({
            message: "✅ Ha iniciado sesión",
            token,
            usuario:{
                id:verificarUsuario._id,
                name:verificarUsuario.name,
                lastName:verificarUsuario.lastName,
                email:verificarUsuario.email,
                tel:verificarUsuario.tel,
                rol:verificarUsuario.rol
            }
        });
        

    } catch (error) {
        console.error(" ❗️ Error al iniciar sesión", error);
        res.status(400).json({message:"❗️ Error",error:error.message});
    }
}