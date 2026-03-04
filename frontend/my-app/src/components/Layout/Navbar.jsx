import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    
    const userMenuRef = useRef(null);  // ✅ Ref para detectar clicks fuera

    // Cargar usuario del localStorage
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    // Actualizar contador del carrito
    useEffect(() => {
        actualizarContador();

        const handleCarritoActualizado = () => {
            actualizarContador();
        };

        window.addEventListener('carritoActualizado', handleCarritoActualizado);

        return () => {
            window.removeEventListener('carritoActualizado', handleCarritoActualizado);
        };
    }, []);

    // ✅ Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const actualizarContador = () => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            const carrito = JSON.parse(carritoGuardado);
            const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            setCartCount(total);
        } else {
            setCartCount(0);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        setUsuario(null);
        setShowUserMenu(false);
        navigate('/');
    };

    const getInitials = (name, lastName) => {
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg mr-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"> 
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            TechStore Pro
                        </h1>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                            Inicio 
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        
                        <Link to="/productos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                            Productos 
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        
                        <Link to="/categorias" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                            Categorías 
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        
                        <Link to="/contacto" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                            Contacto 
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>
                    
                    {/* Cart and User Icons */}
                    <div className="flex items-center space-x-2">
                        
                        {/* Cart Icon */}
                        <Link to="/carrito" className="relative group p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105">
                            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300"/>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Usuario logueado o Login Icon */}
                        {usuario ? (
                            <div className="relative" ref={userMenuRef}>  {/* ✅ Ref agregado */}
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    {getInitials(usuario.name, usuario.lastName)}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-gray-900 font-semibold">{usuario.name} {usuario.lastName}</p>
                                            <p className="text-gray-500 text-sm">{usuario.email}</p>
                                        </div>

                                        <Link
                                            to="/perfil"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <UserCircle className="w-5 h-5 mr-3" />
                                            Mi Perfil
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="relative group p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105">
                                <User className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300"/>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700"/> : <Menu className="w-6 h-6 text-gray-700"/>}
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            {usuario && (
                                <div className="text-gray-700 font-medium py-2 border-b border-gray-200">
                                    <p className="font-semibold">{usuario.name} {usuario.lastName}</p>
                                    <p className="text-sm text-gray-500">{usuario.email}</p>
                                </div>
                            )}
                            
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                            <Link to="/productos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2" onClick={() => setMobileMenuOpen(false)}>Productos</Link>
                            <Link to="/categorias" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2" onClick={() => setMobileMenuOpen(false)}>Categorías</Link>
                            <Link to="/contacto" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
                            
                            {usuario && (
                                <>
                                    <Link to="/perfil" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2" onClick={() => setMobileMenuOpen(false)}>Mi Perfil</Link>
                                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 py-2 text-left">Cerrar sesión</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;