// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Producto 1",
        precio: 1000,
        descripcion: "Descripción del producto 1",
        imagen: "https://via.placeholder.com/300x200?text=Producto+1"
    },
    {
        id: 2,
        nombre: "Producto 2",
        precio: 1500,
        descripcion: "Descripción del producto 2",
        imagen: "https://via.placeholder.com/300x200?text=Producto+2"
    },
    {
        id: 3,
        nombre: "Producto 3",
        precio: 2000,
        descripcion: "Descripción del producto 3",
        imagen: "https://via.placeholder.com/300x200?text=Producto+3"
    },
    {
        id: 4,
        nombre: "Producto 4",
        precio: 2500,
        descripcion: "Descripción del producto 4",
        imagen: "https://via.placeholder.com/300x200?text=Producto+4"
    }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos() {
    const container = document.getElementById('productos');
    container.innerHTML = '';
    
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                Agregar al Carrito
            </button>
        `;
        container.appendChild(div);
    });
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const itemExistente = carrito.find(item => item.id === idProducto);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContador();
    alert(`${producto.nombre} agregado al carrito`);
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('contador-carrito').textContent = total;
}

function toggleCarrito() {
    const modal = document.getElementById('modal-carrito');
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        renderizarCarrito();
    }
}

function renderizarCarrito() {
    const container = document.getElementById('items-carrito');
    container.innerHTML = '';
    
    if (carrito.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">El carrito está vacío</p>';
        document.getElementById('total').textContent = '0';
        return;
    }
    
    let total = 0;
    
    carrito.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-carrito';
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                <small>Cantidad: ${item.cantidad} x $${item.precio}</small>
            </div>
            <div>
                <strong>$${item.precio * item.cantidad}</strong>
                <button onclick="eliminarDelCarrito(${index})">🗑️</button>
            </div>
        `;
        container.appendChild(div);
        total += item.precio * item.cantidad;
    });
    
    document.getElementById('total').textContent = total;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarContador();
    renderizarCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarContador();
        renderizarCarrito();
    }
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    let mensaje = '¡Hola! Quiero hacer el siguiente pedido:\n\n';
    let total = 0;
    
    carrito.forEach(item => {
        mensaje += `• ${item.nombre}\n`;
        mensaje += `  Cantidad: ${item.cantidad}\n`;
        mensaje += `  Precio: $${item.precio * item.cantidad}\n\n`;
        total += item.precio * item.cantidad;
    });
    
    mensaje += `*Total: $${total}*`;
    
    // ⚠️ CAMBIA ESTE NÚMERO POR TU NÚMERO DE WHATSAPP
    // Formato: código país + número (sin +, sin espacios, sin guiones)
    // Ejemplo Argentina: 5491112345678
    // Ejemplo México: 5215512345678
    const numeroWhatsApp = "56983968041";
    
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarContador();
});
