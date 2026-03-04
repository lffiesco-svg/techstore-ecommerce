// Src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";  
import { useNavigate } from "react-router-dom";
import axios from "axios";  // 

const AuthContext = createContext();  // 

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", {  // ✅ /api/auth/login
                email: email,
                pass: password,
            });

            const data = response.data;  //

            // Guardamos el usuario y token en estado
            setUsuario({
                ...data.usuario,
                token: data.token,
            });

            // Guardamos en localStorage también
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('token', data.token);
            
            // Redirigimos según el rol
            if (data.usuario.rol === "admin") {
                navigate("/admin");
            } else {
                navigate("/productos");
            }
            
        } catch (error) {
            console.error("Error en login:", error);
            
            // Manejo de errores
            if (error.response) {
                throw new Error(error.response.data.message || "Error al iniciar sesión");
            } else if (error.request) {
                throw new Error("No se pudo conectar con el servidor");
            } else {
                throw new Error('Error al procesar la solicitud');
            }
        }
    };  // ✅ Cerrar función login

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};