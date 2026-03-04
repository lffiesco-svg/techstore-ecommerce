import productos from "../models/productos.js";

// ✅ Obtener todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const listarProductos = await productos.find();
        res.status(200).json(listarProductos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

// ✅ Crear producto (solo admin)
export const crearProducto = async (req, res) => {
    try {
        const { productId, nombre, descripcion, precio, imagen } = req.body;

        // Validaciones según tu modelo
        if (!productId || !nombre || !descripcion || !precio || !imagen) {
            return res.status(400).json({ 
                message: "Todos los campos son requeridos: productId, nombre, descripcion, precio, imagen" 
            });
        }

        // Verificar si el productId ya existe
        const productoExistente = await productos.findOne({ productId });
        if (productoExistente) {
            return res.status(400).json({ message: "El productId ya existe" });
        }

        const nuevoProducto = new productos({
            productId,
            nombre,
            descripcion,
            precio,
            imagen
        });

        await nuevoProducto.save();

        res.status(201).json({
            message: "Producto creado exitosamente",
            producto: nuevoProducto
        });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
};

// ✅ Actualizar producto (solo admin)
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, nombre, descripcion, precio, imagen } = req.body;

        const productoActualizado = await productos.findByIdAndUpdate(
            id,
            { productId, nombre, descripcion, precio, imagen },
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            producto: productoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ message: "Error al actualizar producto", error: error.message });
    }
};

// ✅ Eliminar producto (solo admin)
export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const productoEliminado = await productos.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto eliminado exitosamente",
            producto: productoEliminado
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
};