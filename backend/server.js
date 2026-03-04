import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "./db/db.js";
import createProd from './routes/createProdRou.js';
import register from './routes/registrerRou.js';
import login from './routes/loginRou.js';
import productosProtegidos from './routes/productos.js';  
import PerfilRouter from './routes/perfil.js'; 
import pedidosRoutes from "./routes/pedidos.js";
import recuperarRoutes from "./routes/recuperarRou.js";
import adminRoutes from "./routes/admin.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

app.use(express.json());

// ✅ CORS configurado para aceptar peticiones de Netlify
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5501',
        'http://127.0.0.1:5501',
        'https://profound-shortbread-66d470.netlify.app'
    ],
    credentials: true
}));

// Primera ruta
app.get('/', (req, res) => {
    res.send('🚀 API TechStore Pro - Backend funcionando correctamente');
});

// Rutas de la API
app.use("/api/", createProd);
app.use("/api/", register);
app.use("/api/Auth", login);
app.use("/api/productos", productosProtegidos);  
app.use("/api/", PerfilRouter);
app.use("/api/pedidos", pedidosRoutes);
app.use('/api/recuperar', recuperarRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Puerto dinámico (Render asigna automáticamente el puerto)
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});