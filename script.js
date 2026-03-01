const productos = [
    { id: 1, codigo: "SKU-001", nombre: "Cámara Pro 4K", precioMayor: 45000, precioEmbalaje: 240000, unid: 6, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
    { id: 2, codigo: "SKU-002", nombre: "Audífonos Studio", precioMayor: 15000, precioEmbalaje: 80000, unid: 6, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 3, codigo: "SKU-003", nombre: "Smartwatch Elite", precioMayor: 25000, precioEmbalaje: 130000, unid: 6, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 4, codigo: "SKU-004", nombre: "Mouse Gamer RGB", precioMayor: 12000, precioEmbalaje: 65000, unid: 6, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" },
    { id: 5, codigo: "SKU-005", nombre: "Teclado Mecánico", precioMayor: 35000, precioEmbalaje: 190000, unid: 6, imagen: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
    { id: 6, codigo: "SKU-006", nombre: "Smartphone Z", precioMayor: 180000, precioEmbalaje: 850000, unid: 5, imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos(lista = productos) {
    const container = document.getElementById('productos');
    container.innerHTML = lista.map(p => `
        <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}">
            <small style="color:#94a3b8; font-weight:700;">${p.codigo}</small>
            <h3>${p.nombre}</h3>
            <div class="opciones-compra">
                <label class="opcion">
                    <input type="radio" name="p-${p.id}" value="mayor" checked id="m-${p.id}">
                    <span>X Mayor: $${p.precioMayor.toLocaleString()}</span>
                </label>
                <label class="opcion">
                    <input type="radio" name="p-${p.id}" value="emb" id="e-${p.id}">
                    <span>Embalaje: $${p.precioEmbalaje.toLocaleString()}</span>
                </label>
            </div>
            <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">Añadir al Pedido</button>
        </div>
    `).join('');
}

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    
    const item = {
        id_unique: Date.now(),
        nombre: p.nombre,
        tipo: esMayor ? 'X Mayor' : 'Embalaje',
        precio: esMayor ? p.precioMayor : p.precioEmbalaje
    };

    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    mostrarAlerta(`✅ ${p.nombre} añadido`);
}

function toggleCarrito() {
    const modal = document.getElementById('modal-carrito');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) renderizarCarrito();
}

function renderizarCarrito() {
    const container = document.getElementById('items-carrito');
    let total = 0;
    
    if (carrito.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:2rem;">El carrito está vacío</p>`;
        document.getElementById('total').textContent = `$0`;
        return;
    }

    container.innerHTML = carrito.map((item, index) => {
        total += item.precio;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; background:#f8fafc; padding:12px; border-radius:12px;">
                <div>
                    <div style="font-weight:700; font-size:0.95rem;">${item.nombre}</div>
                    <div style="font-size:0.8rem; color:#4f46e5; font-weight:600;">${item.tipo}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:800; color:#0f172a;">$${item.precio.toLocaleString()}</div>
                    <button onclick="eliminarDelCarrito(${index})" style="background:none; border:none; color:#ef4444; font-size:0.75rem; font-weight:700; cursor:pointer; padding:0;">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
    const item = carrito[index];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    renderizarCarrito();
    mostrarAlerta(`🗑️ ${item.nombre} eliminado`, "#ef4444");
}

function vaciarCarrito() {
    if (carrito.length === 0) return;
    if (confirm("¿Vaciar todo el carrito?")) {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarInterfaz();
        renderizarCarrito();
        mostrarAlerta("🛒 Carrito vaciado", "#64748b");
    }
}

function filtrarProductos() {
    const val = document.getElementById('buscador').value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(val) || p.codigo.toLowerCase().includes(val));
    renderizarProductos(filtrados);
}

function actualizarInterfaz() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

function mostrarAlerta(msg, color = "#0f172a") {
    const toast = document.getElementById('notification');
    toast.textContent = msg;
    toast.style.background = color;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) return;
    let msg = "*NUEVO PEDIDO PROJECT GON*\n--------------------------\n";
    carrito.forEach((i, idx) => msg += `${idx+1}. ${i.nombre} (${i.tipo}) - $${i.precio.toLocaleString()}\n`);
    const total = carrito.reduce((s, i) => s + i.precio, 0);
    msg += `--------------------------\n*TOTAL: $${total.toLocaleString()}*`;
    window.open(`https://wa.me/56983968041?text=${encodeURIComponent(msg)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarInterfaz();
});
