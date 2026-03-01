const productos = [
    { id: 1, codigo: "SKU-101", nombre: "Smartwatch Series X", descripcion: "Monitor de salud y GPS integrado.", precioMayor: 35000, precioEmbalaje: 180000, unidadesPorEmbalaje: 6, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 2, codigo: "SKU-102", nombre: "Cámara DSLR Pro", descripcion: "Sensor full frame 24MP con lente 18-55mm.", precioMayor: 450000, precioEmbalaje: 2100000, unidadesPorEmbalaje: 5, imagen: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500" },
    { id: 3, codigo: "SKU-103", nombre: "Smartphone Lite Z", descripcion: "6GB RAM, 128GB Almacenamiento, Pantalla AMOLED.", precioMayor: 120000, precioEmbalaje: 550000, unidadesPorEmbalaje: 5, imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
    { id: 4, codigo: "SKU-104", nombre: "Audífonos Noise Cancelling", descripcion: "Batería de 40 horas y carga rápida.", precioMayor: 85000, precioEmbalaje: 400000, unidadesPorEmbalaje: 5, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 5, codigo: "SKU-105", nombre: "Mouse Gamer RGB", descripcion: "16000 DPI con switches mecánicos.", precioMayor: 15000, precioEmbalaje: 70000, unidadesPorEmbalaje: 6, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" },
    { id: 6, codigo: "SKU-106", nombre: "Teclado Mecánico", descripcion: "Layout español, switches brown.", precioMayor: 45000, precioEmbalaje: 240000, unidadesPorEmbalaje: 6, imagen: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos(lista = productos) {
    const container = document.getElementById('productos');
    container.innerHTML = lista.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}">
            <small class="sku">${p.codigo}</small>
            <h3>${p.nombre}</h3>
            <div class="opciones-compra">
                <label class="opcion">
                    <input type="radio" name="p-${p.id}" value="mayor" checked id="m-${p.id}">
                    <span>Mayor: $${p.precioMayor.toLocaleString()}</span>
                </label>
                <label class="opcion">
                    <input type="radio" name="p-${p.id}" value="emb" id="e-${p.id}">
                    <span>Embalaje: $${p.precioEmbalaje.toLocaleString()}</span>
                </label>
            </div>
            <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">Agregar</button>
        </div>
    `).join('');
}

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    
    const item = {
        nombre: p.nombre,
        tipo: esMayor ? 'X Mayor' : 'Embalaje',
        subtotal: esMayor ? p.precioMayor : p.precioEmbalaje
    };

    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    mostrarAlerta(`✅ ${p.nombre} añadido`);
}

function eliminarDelCarrito(index) {
    const nombre = carrito[index].nombre;
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    renderizarCarrito();
    mostrarAlerta(`🗑️ ${nombre} eliminado`, "#ef4444"); // ALERTA ROJA AL ELIMINAR
}

function vaciarCarrito() {
    if(confirm("¿Deseas quitar todos los productos?")) {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarInterfaz();
        renderizarCarrito();
        mostrarAlerta("🛒 Carrito vaciado", "#64748b");
    }
}

function mostrarAlerta(msg, color = "#0f172a") {
    const toast = document.getElementById('notification');
    toast.textContent = msg;
    toast.style.background = color;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function actualizarInterfaz() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

function filtrarProductos() {
    const val = document.getElementById('buscador').value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(val) || p.codigo.toLowerCase().includes(val));
    renderizarProductos(filtrados);
}

// ... Resto de funciones (toggleCarrito, renderizarCarrito, enviarPorWhatsApp) idénticas al anterior
// Asegúrate de actualizar el onclick de eliminar en renderizarCarrito a eliminarDelCarrito(index)
