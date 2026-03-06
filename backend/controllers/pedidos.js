import pedidos from "../models/pedidos.js";
import nodemailer from "nodemailer";

// ✅ Configurar Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Crear nuevo pedido (SIN envío de email)
export const crearPedido = async (req, res) => {
    try {
        const {
            productId,
            nombreproducto,
            descripcion,
            precio,
            imagen,
            nombrecliente,
            telefono,
            edad,
            email,
            sexo,
            ciudad,
            codigopostal,
            direccion,
            fechaentrega,
            metodoPago,
            estado
        } = req.body;

        // Validación simple
        if (!productId || !nombreproducto || !precio || !nombrecliente) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const nuevoPedido = new pedidos({
            productId,
            nombreproducto,
            descripcion,
            precio,
            imagen,
            nombrecliente,
            telefono,
            edad,
            email,
            sexo,
            ciudad,
            codigopostal,
            direccion,
            fechaentrega,
            metodoPago,
            estado
        });

        await nuevoPedido.save();

        res.status(201).json({
            message: "Pedido creado correctamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear pedido", error: error.message });
    }
};

// ✅ NUEVA FUNCIÓN: Enviar email de resumen con TODOS los productos
export const enviarEmailResumen = async (req, res) => {
    try {
        const { productos, datosCliente, datosEnvio, total } = req.body;

        console.log('📧 Enviando email resumen...');
        console.log('📧 Cantidad de productos:', productos.length);
        console.log('📧 Email destino:', datosCliente.email);

        // Generar HTML de los productos
        const productosHTML = productos.map(prod => `
            <div class="product-item">
                <img src="${prod.imagen || 'https://via.placeholder.com/80'}" alt="${prod.nombreproducto}" class="product-image">
                <div style="flex: 1;">
                    <strong>${prod.nombreproducto}</strong><br>
                    <span style="color: #666;">${prod.descripcion}</span><br>
                    <span style="color: #888; font-size: 14px;">Cantidad: ${prod.cantidad}</span>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #667eea; font-size: 18px;">$${prod.precio.toLocaleString('es-CO')}</strong>
                </div>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: datosCliente.email,
            subject: '🎉 ¡Pedido Confirmado! - TechStore Pro',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: white;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                        .content {
                            padding: 30px;
                        }
                        .product-info {
                            background: #f8f9fa;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .product-item {
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            margin-bottom: 15px;
                            padding-bottom: 15px;
                            border-bottom: 1px solid #e0e0e0;
                        }
                        .product-item:last-child {
                            border-bottom: none;
                        }
                        .product-image {
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 8px;
                        }
                        .detail-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #eee;
                        }
                        .detail-label {
                            font-weight: bold;
                            color: #555;
                        }
                        .total {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 15px;
                            border-radius: 8px;
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #666;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ ¡Pedido Confirmado!</h1>
                            <p>Gracias por tu compra, ${datosCliente.nombrecliente}</p>
                        </div>
                        
                        <div class="content">
                            <p>Hola <strong>${datosCliente.nombrecliente}</strong>,</p>
                            <p>Tu pedido ha sido confirmado exitosamente. A continuación encontrarás los detalles:</p>
                            
                            <div class="product-info">
                                <h3>📦 Productos (${productos.length})</h3>
                                ${productosHTML}
                            </div>

                            <div class="product-info">
                                <h3>📍 Información de Envío</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Dirección:</span>
                                    <span>${datosEnvio.direccion}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Ciudad:</span>
                                    <span>${datosEnvio.ciudad}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Código Postal:</span>
                                    <span>${datosEnvio.codigoPostal}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Teléfono:</span>
                                    <span>${datosCliente.telefono}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Método de Pago:</span>
                                    <span>${datosEnvio.metodoPago}</span>
                                </div>
                            </div>

                            <div class="total">
                                Total: $${total.toLocaleString('es-CO')}
                            </div>

                            <p style="text-align: center;">
                                <strong>Estado del Pedido:</strong> 
                                <span style="background: #ffc107; color: white; padding: 5px 15px; border-radius: 20px;">
                                    Pendiente
                                </span>
                            </p>

                            <p style="color: #666; margin-top: 30px;">
                                Te enviaremos actualizaciones sobre tu pedido a este correo. 
                                Si tienes alguna pregunta, no dudes en contactarnos.
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p><strong>TechStore Pro</strong></p>
                            <p>Tu tienda de tecnología de confianza</p>
                            <p>📧 soporte@techstore.co | 📞 +57 300 123 4567</p>
                            <p style="color: #999; font-size: 12px; margin-top: 15px;">
                                Este es un correo automático, por favor no responder directamente.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email resumen enviado exitosamente a:', datosCliente.email);

        res.status(200).json({ message: "Email enviado correctamente" });

    } catch (error) {
        console.error('❌ Error al enviar email resumen:', error);
        res.status(500).json({ message: "Error al enviar email", error: error.message });
    }
};

// Obtener un pedido por ID
export const obtenerPedido = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId es requerido" });
        }

        const pedido = await pedidos.findOne({ productId });

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ pedido });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido", error: error.message });
    }
};

// Obtener todos los pedidos
export const obtenerTodos = async (req, res) => {
    try {
        console.log("🔍 Buscando pedidos...");
        
        const lista = await pedidos.find().maxTimeMS(5000);

        console.log("✅ Pedidos encontrados:", lista.length);
        
        res.status(200).json({ pedidos: lista });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ message: "Error al obtener los pedidos", error: error.message });
    }
};

// Actualizar estado del pedido
export const actualizarEstado = async (req, res) => {
    try {
        const { productId, nuevoEstado } = req.body;

        if (!productId || !nuevoEstado) {
            return res.status(400).json({ message: "productId y nuevoEstado son requeridos" });
        }

        const pedidoActualizado = await pedidos.findOneAndUpdate(
            { productId },
            { estado: nuevoEstado },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({
            message: "Estado actualizado correctamente",
            pedido: pedidoActualizado
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estado", error: error.message });
    }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId es requerido" });
        }

        const eliminado = await pedidos.findOneAndDelete({ productId });

        if (!eliminado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ message: "Pedido eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
    }
};