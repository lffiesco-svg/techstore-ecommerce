import express from "express";
import { 
    crearPedido, 
    obtenerPedido, 
    obtenerTodos, 
    actualizarEstado, 
    eliminarPedido,
    enviarEmailResumen  // ✅ Importar la nueva función
} from "../controllers/pedidos.js";

const router = express.Router();

router.post("/crear", crearPedido);
router.post("/obtener", obtenerPedido);
router.get("/todos", obtenerTodos);
router.put("/actualizar-estado", actualizarEstado);
router.delete("/eliminar", eliminarPedido);

// ✅ Nueva ruta para enviar email resumen
router.post("/enviar-email-resumen", enviarEmailResumen);

export default router;
