import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Edit2, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function Perfil() {
    const { usuario: usuarioAuth, logout } = useAuth();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        tel: ''
    });

    const [datosOriginales, setDatosOriginales] = useState({});

    // Cargar datos del perfil
    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        setLoading(true);
        try {
            const email = usuarioAuth?.email || localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).email : null;
            
            if (!email) {
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:8081/api/obtener', {
                email: email
            });

            const perfil = response.data.usuario;
            setUsuario(perfil);
            
            const datos = {
                name: perfil.name,
                lastName: perfil.lastName,
                email: perfil.email,
                tel: perfil.tel || ''
            };
            
            setFormData(datos);
            setDatosOriginales(datos);

        } catch (error) {
            console.error('Error al cargar perfil:', error);
            setMensaje({
                tipo: 'error',
                texto: 'Error al cargar el perfil'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditar = () => {
        setEditando(true);
    };

    const handleCancelar = () => {
        setFormData(datosOriginales);
        setEditando(false);
        setMensaje({ tipo: '', texto: '' });
    };

    const handleGuardar = async () => {
        // Validar campos
        if (!formData.name || !formData.lastName || !formData.tel) {
            setMensaje({
                tipo: 'error',
                texto: 'Todos los campos son obligatorios'
            });
            return;
        }

        setGuardando(true);
        try {
            const response = await axios.put('http://localhost:8081/api/actualizar', {
                email: usuario.email,
                name: formData.name,
                lastName: formData.lastName,
                tel: formData.tel
            });

            const perfilActualizado = response.data.usuario;
            setUsuario(perfilActualizado);
            
            const nuevosDatos = {
                name: perfilActualizado.name,
                lastName: perfilActualizado.lastName,
                email: perfilActualizado.email,
                tel: perfilActualizado.tel
            };
            
            setFormData(nuevosDatos);
            setDatosOriginales(nuevosDatos);

            // Actualizar localStorage
            localStorage.setItem('usuario', JSON.stringify(perfilActualizado));

            setMensaje({
                tipo: 'success',
                texto: 'Perfil actualizado correctamente'
            });
            
            setEditando(false);

        } catch (error) {
            console.error('Error al actualizar:', error);
            setMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || 'Error al actualizar el perfil'
            });
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminarCuenta = async () => {
        try {
            await axios.delete('http://localhost:8081/api/eliminar', {
                data: { email: usuario.email }
            });

            setMensaje({
                tipo: 'success',
                texto: 'Cuenta eliminada correctamente'
            });

            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            setMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || 'Error al eliminar la cuenta'
            });
        } finally {
            setMostrarModalEliminar(false);
        }
    };

    const getInitials = (name, lastName) => {
        return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                
                {/* Encabezado */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl bg-gradient-to-r from-blue-500 to-purple-500">
                        {usuario && getInitials(usuario.name, usuario.lastName)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">
                            {usuario?.name} {usuario?.lastName}
                        </h2>
                        <p className="text-gray-500">{usuario?.email}</p>
                    </div>
                </div>

                <hr className="mb-6" />

                {/* Mensajes */}
                {mensaje.texto && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        mensaje.tipo === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Formulario */}
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* Nombre */}
                    <div>
                        <label className="font-semibold block mb-2">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="font-semibold block mb-2">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Email */}
                    <div className="col-span-2">
                        <label className="font-semibold block mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full p-3 bg-gray-100 rounded-lg outline-none cursor-not-allowed"
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="col-span-2">
                        <label className="font-semibold block mb-2">Teléfono</label>
                        <input
                            type="text"
                            name="tel"
                            value={formData.tel}
                            onChange={handleChange}
                            disabled={!editando}
                            className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="mt-8">
                    {!editando ? (
                        <button
                            onClick={handleEditar}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-5 h-5" />
                            Editar Perfil
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleGuardar}
                                    disabled={guardando}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {guardando ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleCancelar}
                                    className="flex-1 py-3 rounded-xl bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Cancelar
                                </button>
                            </div>

                            <button
                                onClick={() => setMostrarModalEliminar(true)}
                                className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Eliminar Cuenta
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Eliminar Cuenta */}
            {mostrarModalEliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                ¿Estás seguro de que deseas eliminar tu cuenta?
                            </h3>
                            <p className="text-gray-600 mb-2">
                                ⚠️ Esta acción es permanente y no se puede deshacer.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleEliminarCuenta}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                            <button
                                onClick={() => setMostrarModalEliminar(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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