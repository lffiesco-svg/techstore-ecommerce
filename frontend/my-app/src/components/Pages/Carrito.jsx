import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, CreditCard, Shield, Package, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function Carrito() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [carrito, setCarrito] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [mostrarModalVaciar, setMostrarModalVaciar] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const [datosEnvio, setDatosEnvio] = useState({
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: 'Efectivo contra entrega'
    });

    useEffect(() => {
        cargarCarrito();
    }, []);

    const cargarCarrito = () => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    };

    const guardarCarrito = (nuevoCarrito) => {
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    };

    const actualizarCantidad = (productId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarProducto(productId);
            return;
        }

        const nuevoCarrito = carrito.map(item =>
            item.productId === productId
                ? { ...item, cantidad: nuevaCantidad }
                : item
        );
        guardarCarrito(nuevoCarrito);
        window.dispatchEvent(new Event('carritoActualizado'));
    };

    const eliminarProducto = (productId) => {
        const nuevoCarrito = carrito.filter(item => item.productId !== productId);
        guardarCarrito(nuevoCarrito);
        mostrarToast('Producto eliminado del carrito', 'success');
        window.dispatchEvent(new Event('carritoActualizado'));
    };

    const vaciarCarritoSilencioso = () => {
        localStorage.removeItem('carrito');
        setCarrito([]);
        window.dispatchEvent(new Event('carritoActualizado'));
    };

    const vaciarCarrito = () => {
        localStorage.removeItem('carrito');
        setCarrito([]);
        setMostrarModalVaciar(false);
        mostrarToast('Carrito vaciado', 'success');
        window.dispatchEvent(new Event('carritoActualizado'));
    };

    const handleInputChange = (e) => {
        setDatosEnvio({
            ...datosEnvio,
            [e.target.name]: e.target.value
        });
    };

    const finalizarCompra = async (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            mostrarToast('El carrito está vacío', 'error');
            return;
        }

        if (!usuario) {
            mostrarToast('Debes iniciar sesión para realizar una compra', 'error');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const { direccion, ciudad, codigoPostal, metodoPago } = datosEnvio;

        if (!direccion || !ciudad || !codigoPostal) {
            mostrarToast('Por favor completa todos los campos', 'error');
            return;
        }

        setProcesando(true);

        try {
            const promesas = carrito.map(producto => {
                return axios.post('http://localhost:8081/api/pedidos/crear', {
                    productId: producto.productId,
                    nombreproducto: producto.nombre,
                    descripcion: `Cantidad: ${producto.cantidad}`,
                    precio: producto.precio * producto.cantidad,
                    imagen: producto.imagen || 'https://via.placeholder.com/150',
                    nombrecliente: `${usuario.name} ${usuario.lastName}`,
                    telefono: usuario.tel || 'Sin teléfono',
                    edad: 25,
                    email: usuario.email,
                    sexo: 'No especificado',
                    ciudad: ciudad,
                    codigopostal: codigoPostal,
                    direccion: direccion,
                    fechaentrega: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    metodoPago: metodoPago,
                    estado: 'Pendiente'
                });
            });

            await Promise.all(promesas);

            mostrarToast('¡Pedido realizado exitosamente!', 'success');
            vaciarCarritoSilencioso();

            setTimeout(() => {
                navigate('/mis-pedidos');
            }, 2000);

        } catch (error) {
            console.error('Error al crear pedido:', error);
            mostrarToast('Error al procesar el pedido', 'error');
        } finally {
            setProcesando(false);
        }
    };

    const mostrarToast = (texto, tipo) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    };

    const calcularSubtotal = () => {
        return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    };

    const subtotal = calcularSubtotal();
    const total = subtotal;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-4">
                <div className="text-sm text-gray-600">
                    <Link to="/" className="hover:text-blue-600">Inicio</Link>
                    <span className="mx-2">›</span>
                    <span className="text-blue-600">Carrito de compras</span>
                </div>
            </div>

            {mensaje.texto && (
                <div className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-50 ${
                    mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            <main className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                
                <section className="col-span-full">
                    <div className="flex items-center gap-4 mb-2">
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                        <h1 className="font-bold text-3xl">Tu carrito</h1>
                    </div>
                    <p className="text-gray-600">Revisa tus productos antes de finalizar la compra</p>
                </section>

                <div className="lg:col-span-2 space-y-4">
                    
                    {carrito.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                            <p className="text-gray-600 mb-6">¡Descubre productos increíbles y comienza tu compra!</p>
                            <Link
                                to="/productos"
                                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition"
                            >
                                Explorar Productos
                            </Link>
                        </div>
                    ) : (
                        <>
                            {carrito.map((producto) => (
                                <div
                                    key={producto.productId}
                                    className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition"
                                >
                                    <img
                                        src={producto.imagen || 'https://via.placeholder.com/150'}
                                        alt={producto.nombre}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />
                                    
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                                        <p className="text-lg font-semibold text-blue-600">
                                            ${producto.precio.toLocaleString('es-CO')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => actualizarCantidad(producto.productId, producto.cantidad - 1)}
                                            className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center font-bold text-xl"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <span className="text-xl font-bold w-12 text-center">{producto.cantidad}</span>
                                        <button
                                            onClick={() => actualizarCantidad(producto.productId, producto.cantidad + 1)}
                                            className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-bold text-xl"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => eliminarProducto(producto.productId)}
                                        className="text-red-500 hover:text-red-700 transition p-2"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Subtotal</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ${(producto.precio * producto.cantidad).toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setMostrarModalVaciar(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition shadow-md"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Vaciar carrito
                                </button>

                                <Link
                                    to="/productos"
                                    className="flex items-center gap-1 text-blue-600 font-medium hover:underline transition"
                                >
                                    ← Continuar Comprando
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <aside className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 space-y-4 h-fit">
                    <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h2 className="font-bold text-2xl">Resumen del Pedido</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-gray-500">
                            <p>Subtotal</p>
                            <p className="font-bold">${subtotal.toLocaleString('es-CO')}</p>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <p>Envío</p>
                            <span className="font-bold text-green-500">Gratis</span>
                        </div>
                        <div className="flex justify-between p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                            <p className="font-bold text-2xl">Total</p>
                            <p className="font-bold text-2xl text-blue-600">${total.toLocaleString('es-CO')}</p>
                        </div>
                    </div>

                    <hr />

                    <div className="flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h3 className="font-bold text-lg">Información de Envío</h3>
                    </div>

                    <form onSubmit={finalizarCompra} className="space-y-4">
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium mb-1">
                                Dirección completa
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={datosEnvio.direccion}
                                onChange={handleInputChange}
                                placeholder="Ej: Calle 123 #45-67"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ciudad" className="block text-sm font-medium mb-1">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={datosEnvio.ciudad}
                                    onChange={handleInputChange}
                                    placeholder="Bogotá"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="codigoPostal" className="block text-sm font-medium mb-1">
                                    Código postal
                                </label>
                                <input
                                    type="text"
                                    id="codigoPostal"
                                    name="codigoPostal"
                                    value={datosEnvio.codigoPostal}
                                    onChange={handleInputChange}
                                    placeholder="110111"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="metodoPago" className="block text-sm font-medium mb-1">
                                Método de pago
                            </label>
                            <select
                                id="metodoPago"
                                name="metodoPago"
                                value={datosEnvio.metodoPago}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Efectivo contra entrega">💵 Efectivo contra entrega</option>
                                <option value="Tarjeta de crédito">💳 Tarjeta de crédito</option>
                                <option value="Transferencia">🏦 Transferencia bancaria</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={procesando || carrito.length === 0}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {procesando ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Finalizar compra
                                </>
                            )}
                        </button>

                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                Compra segura y protegida
                            </li>
                            <li className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-500" />
                                Envío gratis en todas las compras
                            </li>
                            <li className="flex items-center gap-2">
                                <RotateCcw className="w-5 h-5 text-green-500" />
                                30 días para devoluciones
                            </li>
                        </ul>
                    </form>
                </aside>
            </main>

            {mostrarModalVaciar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Vaciar carrito?</h3>
                            <p className="text-gray-600">
                                Esta acción eliminará todos los productos de tu carrito. ¿Estás seguro?
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={vaciarCarrito}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Sí, vaciar
                            </button>
                            <button
                                onClick={() => setMostrarModalVaciar(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}