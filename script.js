const productos = [
    { id: 1, cat: "Electronica", codigo: "SKU-001", nombre: "Cámara Pro DSLR", precioMayor: 45000, precioEmbalaje: 240000, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
    { id: 2, cat: "Accesorios", codigo: "SKU-002", nombre: "Audífonos Studio Pro", precioMayor: 15000, precioEmbalaje: 80000, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 3, cat: "Electronica", codigo: "SKU-003", nombre: "Smartwatch Elite V2", precioMayor: 25000, precioEmbalaje: 130000, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 4, cat: "Accesorios", codigo: "SKU-004", nombre: "Mouse Gamer Phantom", precioMayor: 12000, precioEmbalaje: 65000, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos(lista) {
    const container = document.getElementById('productos');
    container.innerHTML = lista.map(p => `
        <div class="producto-card">
            <img src="${p.imagen}">
            <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 700; margin-bottom: 5px;">${p.codigo}</div>
            <h3>${p.nombre}</h3>
            
            <div class="price-selector">
                <label class="price-option">
                    <input type="radio" name="p-${p.id}" value="mayor" checked id="m-${p.id}">
                    <span class="type">X MAYOR</span>
                    <span class="amount">$${p.precioMayor.toLocaleString()}</span>
                </label>
                <label class="price-option">
                    <input type="radio" name="p-${p.id}" value="emb" id="e-${p.id}">
                    <span class="type">EMBALAJE</span>
                    <span class="amount">$${p.precioEmbalaje.toLocaleString()}</span>
                </label>
            </div>
            
            <button onclick="agregarAlCarrito(${p.id})" style="width:100%; padding:12px; border-radius:10px; border:none; background:#0f172a; color:white; font-weight:700; cursor:pointer;">
                Añadir al Pedido
            </button>
        </div>
    `).join('');
}

function filtrarTodo() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const max = document.getElementById('price-range').value;
    const cats = Array.from(document.querySelectorAll('.cat-check:checked')).map(c => c.value);
    
    document.getElementById('price-val').textContent = `$${parseInt(max).toLocaleString()}`;

    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(query) && 
        p.precioMayor <= max && 
        cats.includes(p.cat)
    );
    renderizarProductos(filtrados);
}

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    
    carrito.push({
        id_unique: Date.now(),
        nombre: p.nombre,
        tipo: esMayor ? 'Mayor' : 'Embalaje',
        precio: esMayor ? p.precioMayor : p.precioEmbalaje
    });
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    mostrarAlerta(`✅ ${p.nombre} añadido`);
}

function actualizarInterfaz() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

function toggleCarrito() {
    document.getElementById('modal-carrito').classList.toggle('active');
    renderizarCarrito();
}

function renderizarCarrito() {
    const container = document.getElementById('items-carrito');
    let total = 0;
    container.innerHTML = carrito.map((item, idx) => {
        total += item.precio;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; background:#f8fafc; padding:12px; border-radius:10px;">
                <div>
                    <div style="font-weight:700; font-size:0.9rem;">${item.nombre}</div>
                    <div style="font-size:0.75rem; color:#4f46e5; font-weight:600;">${item.tipo}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:800;">$${item.precio.toLocaleString()}</div>
                    <button onclick="eliminar(${idx})" style="background:none; border:none; color:#ef4444; font-size:0.7rem; font-weight:700; cursor:pointer;">Eliminar</button>
                </div>
            </div>`;
    }).join('');
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function eliminar(idx) {
    carrito.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    renderizarCarrito();
    mostrarAlerta("🗑️ Producto eliminado", "#ef4444");
}

function vaciarCarrito() {
    if(confirm("¿Vaciar todo el pedido?")) {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarInterfaz();
        renderizarCarrito();
        mostrarAlerta("Carrito vacío", "#64748b");
    }
}

function mostrarAlerta(msg, color = "#0f172a") {
    const t = document.getElementById('notification');
    t.textContent = msg; t.style.background = color; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) return;
    let msg = "*NUEVO PEDIDO PROJECT GON*\n\n";
    carrito.forEach((i, idx) => msg += `${idx+1}. ${i.nombre} (${i.tipo}) - $${i.precio.toLocaleString()}\n`);
    const total = carrito.reduce((s, i) => s + i.precio, 0);
    msg += `\n*TOTAL: $${total.toLocaleString()}*`;
    window.open(`https://wa.me/56983968041?text=${encodeURIComponent(msg)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    actualizarInterfaz();
});
