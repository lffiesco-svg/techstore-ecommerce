import express from "express";
import { verificarToken, soloAdmin} from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.get ("/dashboard", verificarToken, soloAdmin, (req, res) => {
    res.json ({
        message: "✔️ Bienvenido al panal de administración",
        admin: {
            name: req.usuario.name,
            email: req.usuario.email,
            rol: req.usuario.rol
        }
    });
});

export default router;