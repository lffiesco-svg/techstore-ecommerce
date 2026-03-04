import { useState, useEffect } from "react";
import { ShoppingCart, Search, Eye } from "lucide-react";
import axios from "axios";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });  // ✅ Agregar
    
    // Filtros
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precioRango, setPrecioRango] = useState("");
    const [ordenamiento, setOrdenamiento] = useState("relevance");

    // Cargar productos al montar
    useEffect(() => {
        fetchProductos();
        cargarCarrito();
    }, []);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        aplicarFiltros();
    }, [busqueda, categoria, precioRango, ordenamiento, productos]);

   const fetchProductos = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8081/api/productos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        setProductos(response.data);
        setProductosFiltrados(response.data);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    } finally {
        setLoading(false);
    }
};

    const cargarCarrito = () => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...productos];

        if (busqueda) {
            resultado = resultado.filter(p => 
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        if (categoria) {
            resultado = resultado.filter(p => p.categoria === categoria);
        }

        if (precioRango) {
            if (precioRango === "0-500000") {
                resultado = resultado.filter(p => p.precio >= 0 && p.precio <= 500000);
            } else if (precioRango === "500000-1500000") {
                resultado = resultado.filter(p => p.precio > 500000 && p.precio <= 1500000);
            } else if (precioRango === "1500000-3000000") {
                resultado = resultado.filter(p => p.precio > 1500000 && p.precio <= 3000000);
            } else if (precioRango === "3000000+") {
                resultado = resultado.filter(p => p.precio > 3000000);
            }
        }

        if (ordenamiento === "price-asc") {
            resultado.sort((a, b) => a.precio - b.precio);
        } else if (ordenamiento === "price-des") {
            resultado.sort((a, b) => b.precio - a.precio);
        } else if (ordenamiento === "name") {
            resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }

        setProductosFiltrados(resultado);
    };

    // ✅ FUNCIÓN MEJORADA: Agregar al carrito con toast y actualización
    const agregarAlCarrito = (producto) => {
        const carritoActual = [...carrito];
        const existe = carritoActual.find(item => item._id === producto._id);

        if (existe) {
            existe.cantidad += 1;
        } else {
            carritoActual.push({
                productId: producto.productId,
                _id: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }

        setCarrito(carritoActual);
        localStorage.setItem('carrito', JSON.stringify(carritoActual));
        
        // ✅ Mostrar toast
        mostrarToast('Producto agregado al carrito', 'success');
        
        // ✅ Disparar evento para actualizar navbar
        window.dispatchEvent(new Event('carritoActualizado'));
    };

    // ✅ FUNCIÓN PARA MOSTRAR TOAST
    const mostrarToast = (texto, tipo) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    };

    const contadorCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            
            {/* ✅ Toast de notificación */}
            {mensaje.texto && (
                <div className={`fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-50 transition-all ${
                    mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                
                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    
                    {/* Buscador */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Filtros Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas las categorías</option>
                                <option value="laptops">Laptops</option>
                                <option value="celulares">Celulares</option>
                                <option value="componentes">Componentes PC</option>
                                <option value="accesorios">Accesorios</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
                            <select
                                value={precioRango}
                                onChange={(e) => setPrecioRango(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Cualquier precio</option>
                                <option value="0-500000">$0 - $500.000</option>
                                <option value="500000-1500000">$500.000 - $1.500.000</option>
                                <option value="1500000-3000000">$1.500.000 - $3.000.000</option>
                                <option value="3000000+">$3.000.000+</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                            <select
                                value={ordenamiento}
                                onChange={(e) => setOrdenamiento(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="relevance">Relevancia</option>
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-des">Precio: Mayor a Menor</option>
                                <option value="name">Nombre A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de Productos */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Cargando productos...</p>
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No se encontraron productos</p>
                    </div>
                ) : (
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {productosFiltrados.map((producto) => (
                            <div key={producto._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                
                                {/* Imagen */}
                                <div className="h-48 bg-gray-100 overflow-hidden relative group">
                                    {producto.imagen ? (
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{producto.nombre}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                                    <p className="text-2xl font-bold text-blue-600 mb-4">
                                        ${producto.precio.toLocaleString('es-CO')}
                                    </p>
                                    
                                    {/* ✅ BOTONES MEJORADOS */}
                                    <div className="flex gap-2">
                                        {/* Botón Ver Detalles */}
                                        <button
                                            onClick={() => window.alert('Funcionalidad de detalles próximamente')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Detalles
                                        </button>

                                        {/* Botón Comprar */}
                                        <button
                                            onClick={() => agregarAlCarrito(producto)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}