import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
import Navbar from "../Layout/Navbar"
import Footer from "../Layout/Footer"

export default function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        tel: '',
        consulta: '',
        mensaje: '',
        aceptaPrivacidad: false
    });

    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setMensaje({ tipo: '', texto: '' });

        // Simulación de envío (aquí conectarías con tu backend)
        setTimeout(() => {
            setMensaje({
                tipo: 'success',
                texto: '¡Mensaje enviado exitosamente! Te contactaremos pronto.'
            });
            setEnviando(false);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                email: '',
                tel: '',
                consulta: '',
                mensaje: '',
                aceptaPrivacidad: false
            });
        }, 1500);
    };

    return (
    
        
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto p-4 gap-8 grid grid-cols-1 md:grid-cols-2">
                
                {/* Formulario de Contacto */}
                <section className="py-8 p-4 bg-white rounded-md shadow-md">
                    <div className="mb-4">
                        <h1 className="font-bold text-2xl">Envíanos un mensaje</h1>
                    </div>

                    {/* Mensaje de feedback */}
                    {mensaje.texto && (
                        <div className={`mb-4 p-4 rounded-lg ${
                            mensaje.tipo === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 px-4 gap-x-8 gap-y-4">
                        
                        {/* Nombre completo */}
                        <div>
                            <label className="block" htmlFor="nombre">
                                Nombre completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full block p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="text"
                                id="nombre"
                                name="nombre"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block" htmlFor="email">
                                Correo electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full block p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block" htmlFor="tel">Teléfono</label>
                            <input
                                className="w-full block p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="tel"
                                name="tel"
                                id="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                placeholder="+57 300 123 4567"
                            />
                        </div>

                        {/* Tipo de consulta */}
                        <div>
                            <label className="block" htmlFor="consulta">
                                Tipo de consulta <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full block p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                name="consulta"
                                id="consulta"
                                required
                                value={formData.consulta}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona un tema</option>
                                <option value="ventas">Ventas</option>
                                <option value="soporte">Soporte técnico</option>
                                <option value="garantia">Garantías</option>
                                <option value="envios">Envíos</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        {/* Mensaje */}
                        <div className="col-span-full flex flex-col">
                            <label htmlFor="mensaje">
                                Mensaje <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                name="mensaje"
                                id="mensaje"
                                rows="8"
                                required
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder="Describe tu consulta o mensaje en detalle..."
                            />
                        </div>

                        {/* Política de privacidad */}
                        <div className="col-span-full flex gap-2 items-start">
                            <input
                                className="cursor-pointer mt-1"
                                type="checkbox"
                                name="aceptaPrivacidad"
                                required
                                checked={formData.aceptaPrivacidad}
                                onChange={handleChange}
                            />
                            <p className="">
                                He leído y acepto la <a className="text-blue-400 hover:underline" href="#">política de privacidad</a> y el tratamiento de mis datos personales
                            </p>
                        </div>

                        {/* Botón enviar */}
                        <div className="col-span-full">
                            <button
                                type="submit"
                                disabled={enviando}
                                className="cursor-pointer w-full font-extrabold py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {enviando ? 'Enviando...' : 'Enviar mensaje'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Columna derecha - Información */}
                <section className="grid grid-cols-1 gap-8">
                    
                    {/* Información de contacto */}
                    <div className="py-8 px-4 bg-white rounded-md shadow-md grid grid-cols-1 gap-8">
                        <div className="mb-4">
                            <h1 className="font-bold text-2xl">Información de contacto</h1>
                        </div>

                        {/* Oficina */}
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <ul className="-mt-1 space-y-2">
                                    <li className="font-bold text-lg">Oficina principal</li>
                                    <li className="text-gray-500">Carrera 11 # 93-07, Oficina 501</li>
                                    <li className="text-gray-500">Bogotá D.C, Colombia</li>
                                    <li className="text-gray-400 text-sm">Zona Rosa - Chapinero</li>
                                </ul>
                            </div>
                        </div>

                        {/* Teléfonos */}
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-green-100 rounded-xl">
                                <Phone className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <ul className="-mt-1 space-y-2">
                                    <li className="font-bold text-lg">Teléfonos</li>
                                    <li className="text-gray-500">Línea fija: +57 (1) 234-5678</li>
                                    <li className="text-gray-500">Celular: +57 300 123 4567</li>
                                    <li className="text-gray-500">WhatsApp: +57 300 123 4567</li>
                                </ul>
                            </div>
                        </div>

                        {/* Correos */}
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-fuchsia-100 rounded-xl">
                                <Mail className="w-6 h-6 text-fuchsia-600" />
                            </div>
                            <div>
                                <ul className="-mt-1 space-y-2">
                                    <li className="font-bold text-lg">Correos Departamentales</li>
                                    <li className="text-gray-500">General: info@techstore.co</li>
                                    <li className="text-gray-500">Ventas: ventas@techstore.co</li>
                                    <li className="text-gray-500">Soporte: soporte@techstore.co</li>
                                    <li className="text-gray-500">Gerencia: gerencia@techstore.co</li>
                                </ul>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-orange-100 rounded-xl">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <ul className="-mt-1 space-y-2">
                                    <li className="font-bold text-lg">Horarios de Atención</li>
                                    <li className="text-gray-500">Lunes a viernes: 8:00 AM - 6:00 PM</li>
                                    <li className="text-gray-500">Sábados: 9:00 AM - 3:00 PM</li>
                                    <li className="text-gray-500">Domingos y festivos: Cerrado</li>
                                    <li className="text-gray-400 text-sm">Zona horaria: GMT-5 (Bogotá)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Redes sociales */}
                    <div className="py-8 px-4 bg-white rounded-md shadow-md grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="col-span-full">
                            <h2 className="font-bold text-xl">Síguenos en redes sociales</h2>
                        </div>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all">
                            <div className="text-2xl">📘</div>
                            <div>
                                <p className="font-medium">Facebook</p>
                                <p className="text-gray-400 text-sm">@techstore.co</p>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all">
                            <div className="text-2xl">📷</div>
                            <div>
                                <p className="font-medium">Instagram</p>
                                <p className="text-gray-400 text-sm">@techstore_co</p>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-sky-400 hover:bg-sky-50 transition-all">
                            <div className="text-2xl">🐦</div>
                            <div>
                                <p className="font-medium">Twitter/X</p>
                                <p className="text-gray-400 text-sm">@techstore_co</p>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all">
                            <div className="text-2xl">💬</div>
                            <div>
                                <p className="font-medium">WhatsApp</p>
                                <p className="text-gray-400 text-sm">Chat directo</p>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all">
                            <div className="text-2xl">📺</div>
                            <div>
                                <p className="font-medium">Youtube</p>
                                <p className="text-gray-400 text-sm">TechStore TV</p>
                            </div>
                        </a>

                        <a href="#" className="flex items-center gap-2 p-2 px-4 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all">
                            <div className="text-2xl">🧳</div>
                            <div>
                                <p className="font-medium">LinkedIn</p>
                                <p className="text-gray-400 text-sm">TechStore Pro</p>
                            </div>
                        </a>
                    </div>

                    {/* Por qué seguirnos */}
                    <div className="py-8 px-4 bg-blue-50 rounded-md shadow-md">
                        <div className="mb-4">
                            <h1 className="font-bold text-xl">¿Por qué seguirnos?</h1>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <p className="text-gray-600">Atención personalizada y especializada</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <p className="text-gray-600">Soporte técnico post-venta incluido</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <p className="text-gray-600">Garantía extendida en todos nuestros productos</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <p className="text-gray-600">Envío gratis en compras superiores a $500.000</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
        </div>
    
    );
}