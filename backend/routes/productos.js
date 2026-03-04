import express from "express";
import { verificarToken, soloAdmin } from "../Middlewares/auth.middleware.js";
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from "../controllers/productosCon.js";

const router = express.Router();

console.log("🔥 Ruta de productos CARGADA con middleware");

// ✅ Ver productos (user y admin autenticados)
router.get("/", verificarToken, obtenerProductos);

// ✅ Crear productos (solo admin)
router.post("/", verificarToken, soloAdmin, crearProducto);

// ✅ Actualizar productos (solo admin)
router.put("/:id", verificarToken, soloAdmin, actualizarProducto);

// ✅ Eliminar productos (solo admin)
router.delete("/:id", verificarToken, soloAdmin, eliminarProducto);

export default router;