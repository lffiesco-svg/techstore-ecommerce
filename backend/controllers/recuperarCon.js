import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import user from "../models/usuarios.js";
import dotenv from "dotenv";

dotenv.config();

// ========== ALMACENAR CÓDIGOS TEMPORALMENTE ==========
const codigosVerificacion = new Map();

// ========== CONFIGURAR NODEMAILER ==========
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ========== FUNCIÓN: SOLICITAR CÓDIGO DE VERIFICACIÓN ==========
export const solicitarCodigo = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }

        const usuario = await user.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        codigosVerificacion.set(email, {
            codigo: codigo,
            expira: Date.now() + 10 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.email,
            subject: "🔐 Código de Verificación - TechStore Pro",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4F46E5;">Recuperación de Contraseña</h2>
                    <p>Hola <strong>${usuario.name}</strong>,</p>
                    <p>Tu código de verificación es:</p>
                    <div style="background: #EEF2FF; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                        <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">${codigo}</h1>
                    </div>
                    <p style="color: #ef4444;">Este código expira en 15 minutos.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px; text-align: center;">© 2025 TechStore Pro</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Código de verificación enviado al correo",
            email: email
        });

    } catch (error) {
        console.error("Error al solicitar código:", error);
        res.status(500).json({
            message: "Error al enviar código de verificación",
            error: error.message
        });
    }
};

// ========== FUNCIÓN: VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA ==========
export const cambiarContrasena = async (req, res) => {
    console.log('🔥🔥🔥 INICIANDO cambiarContrasena 🔥🔥🔥');
    
    try {
        console.log('📦 req.body recibido:', req.body);
        
        const { email, codigo, nuevaPassword } = req.body;

        console.log('Valores extraídos:');
        console.log('  - email:', email);
        console.log('  - codigo:', codigo);
        console.log('  - nuevaPassword:', nuevaPassword);

        if (!email || !codigo || !nuevaPassword) {
            console.log('❌ Validación falló - campos faltantes');
            return res.status(400).json({
                message: "Email, código y nueva contraseña son requeridos"
            });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        const codigoGuardado = codigosVerificacion.get(email);
        
        if (!codigoGuardado) {
            return res.status(400).json({
                message: "No se ha solicitado un código para este email"
            });
        }

        if (Date.now() > codigoGuardado.expira) {
            codigosVerificacion.delete(email);
            return res.status(400).json({
                message: "El código ha expirado. Solicita uno nuevo"
            });
        }

        if (codigoGuardado.codigo !== codigo) {
            return res.status(400).json({
                message: "Código de verificación incorrecto"
            });
        }

        const usuario = await user.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaPassword, salt);

        usuario.pass = contrasenaEncriptada;
        await usuario.save();

        codigosVerificacion.delete(email);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.email,
            subject: "✅ Contraseña Actualizada - TechStore Pro",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4F46E5;">🔐 Contraseña Actualizada</h2>
                    <p>Hola <strong>${usuario.name}</strong>,</p>
                    <p>Tu contraseña ha sido actualizada exitosamente.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px; text-align: center;">© 2025 TechStore Pro</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log('✅ Contraseña actualizada exitosamente para:', email);

        res.status(200).json({
            message: "Contraseña actualizada correctamente",
            usuario: {
                name: usuario.name,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("❌ ERROR COMPLETO:", error);
        console.error("❌ Stack trace:", error.stack);
        res.status(500).json({
            message: "Error al cambiar la contraseña",
            error: error.message
        });
    }
};