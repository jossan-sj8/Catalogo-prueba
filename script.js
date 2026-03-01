const productos = [
    { id: 1, codigo: "PROD-01", nombre: "Cámara Pro 4K", descripcion: "Lente de alta resolución para exteriores.", precioMayor: 45000, precioEmbalaje: 240000, unidadesPorEmbalaje: 6, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
    { id: 2, codigo: "PROD-02", nombre: "Audífonos Studio", descripcion: "Cancelación de ruido activa profesional.", precioMayor: 12000, precioEmbalaje: 60000, unidadesPorEmbalaje: 6, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    // Agrega más productos aquí...
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos(data = productos) {
    const container = document.getElementById('productos');
    container.innerHTML = data.map(p => `
        <div class="producto">
            <span class="codigo-tag">${p.codigo}</span>
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">${p.descripcion}</p>
            
            <div class="opciones-compra">
                <label class="opcion">
                    <input type="radio" name="tipo-${p.id}" value="mayor" checked id="m-${p.id}">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 600;">Por Mayor (5+)</div>
                        <div class="precio">$${p.precioMayor.toLocaleString()}</div>
                    </div>
                </label>
                <label class="opcion">
                    <input type="radio" name="tipo-${p.id}" value="embalaje" id="e-${p.id}">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 600;">Embalaje (${p.unidadesPorEmbalaje} ud.)</div>
                        <div class="precio">$${p.precioEmbalaje.toLocaleString()}</div>
                    </div>
                </label>
            </div>
            
            <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.8rem; font-weight: 600;">Cant:</span>
                <input type="number" id="cant-${p.id}" value="5" min="1" class="input-cantidad" 
                       style="width: 60px; padding: 5px; border-radius: 5px; border: 1px solid #ddd;">
            </div>

            <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">
                Añadir al carrito
            </button>
        </div>
    `).join('');
}

function filtrarProductos() {
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.codigo.toLowerCase().includes(busqueda)
    );
    renderizarProductos(filtrados);
}

function agregarAlCarrito(id) {
    const p = productos.find(prod => prod.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    const cant = parseInt(document.getElementById(`cant-${id}`).value);
    
    if (esMayor && cant < 5) {
        showNotification("Mínimo 5 unidades para precio por mayor", "#ef4444");
        return;
    }

    const item = {
        id: p.id,
        nombre: p.nombre,
        tipo: esMayor ? 'Mayor' : 'Embalaje',
        cantidad: cant,
        precio: esMayor ? p.precioMayor : p.precioEmbalaje,
        subtotal: cant * (esMayor ? p.precioMayor : p.precioEmbalaje)
    };

    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    showNotification("¡Producto añadido!");
}

function actualizarContador() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

function toggleCarrito() {
    const modal = document.getElementById('modal-carrito');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) renderizarCarrito();
}

function renderizarCarrito() {
    const container = document.getElementById('items-carrito');
    let total = 0;
    container.innerHTML = carrito.map((item, index) => {
        total += item.subtotal;
        return `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between;">
                <div>
                    <div style="font-weight: 700;">${item.nombre}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${item.tipo} x ${item.cantidad}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700;">$${item.subtotal.toLocaleString()}</div>
                    <button onclick="eliminar(${index})" style="border:none; background:none; color:#ef4444; font-size: 0.8rem; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function eliminar(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarContador();
    renderizarCarrito();
}

function showNotification(msg, color = "#0f172a") {
    const toast = document.getElementById('notification');
    toast.textContent = msg;
    toast.style.background = color;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) return;
    let msg = "*NUEVO PEDIDO PROJECT GON*\n\n";
    carrito.forEach(i => msg += `• ${i.nombre} (${i.tipo}) x${i.cantidad}: *$${i.subtotal.toLocaleString()}*\n`);
    const total = carrito.reduce((s, i) => s + i.subtotal, 0);
    msg += `\n*TOTAL: $${total.toLocaleString()}*`;
    window.open(`https://wa.me/56983968041?text=${encodeURIComponent(msg)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarContador();
});
