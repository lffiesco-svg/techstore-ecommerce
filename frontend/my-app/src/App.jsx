import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from "./components/pages/ForgotPassword";
import VerifyCode from "./components/pages/VerifyCode";
import AdminPanel from './components/Pages/AdminPanel';
import Home from './components/Pages/Home';
import Productos from './components/Pages/Productos';
import Contacto from './components/Pages/Contacto';
import Perfil from './components/Pages/Perfil';
import Carrito from './components/Pages/Carrito';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rutas SIN Layout (sin navbar/footer) */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-code" element={<VerifyCode />} />



                    {/* Rutas CON Layout (con navbar/footer) */}
                    <Route path='/' element={<Layout><Home /></Layout>} />
                    <Route path="/productos" element={<Layout><Productos /></Layout>} />
                    <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
                    <Route path="/carrito" element={<Layout><Carrito /></Layout>} />
                    
                    <Route 
                        path="/perfil" 
                        element={
                            
                                <PrivateRoute>
                                    <Perfil />
                                </PrivateRoute>
                            
                        } 
                    />

                    <Route
                        path="/admin"
                        element={
                            
                                <PrivateRoute rolRequerido="admin">
                                    <AdminPanel />
                                </PrivateRoute>
                            
                        }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;