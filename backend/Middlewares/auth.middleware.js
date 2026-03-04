//Middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import usuarios from "../models/usuarios.js";

//Verificar el token y consulta el usuario actualizado en BD
export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Token requerido"});
        }

        const token = authHeader.split(" ")[1];

        // decodifica  el token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // consulta el usuario actualizado en la BD (por si cambió su rol o fue eliminado)
        const usuario = await usuarios.findById(decoded.id).select("-pass");
        if (!usuario) {
            return res.status(401).json({message: "Usuario no encontrado"});

        }

        // Guardemos el usuario completo en req para usarlo en los controladores
        req.usuario = usuario;
        next();

        
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({message: "Token expirado, inicia sesión nuevamente"});
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Token inválido"});
        }
        res.status(500).json({message: "Error en la autentificación", error: error.message});

    }
};

// Solo administradores

export const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== "admin") {
        return res.status(403).json({message: "Acceso denegado: se requiere rol de administrador"});
    }
    next();
};

// Solo usuarios
export const SoloUser = (req, res, next) => {
    if (req.usuario?.rol !== "user") {
        return res.status(403).json({message: "Acesso denegado: se requiere rol user"});
    }
    next();
};