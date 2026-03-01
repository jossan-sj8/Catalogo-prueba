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
            <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 700;">${p.codigo}</div>
            <h3 style="margin-bottom:1rem">${p.nombre}</h3>
            <div class="price-selector">
                <label class="price-card">
                    <input type="radio" name="p-${p.id}" value="mayor" checked id="m-${p.id}">
                    <span class="type">POR MAYOR</span>
                    <span class="val">$${p.precioMayor.toLocaleString()}</span>
                </label>
                <label class="price-card">
                    <input type="radio" name="p-${p.id}" value="emb" id="e-${p.id}">
                    <span class="type">EMBALAJE</span>
                    <span class="val">$${p.precioEmbalaje.toLocaleString()}</span>
                </label>
            </div>
            <button onclick="agregarAlCarrito(${p.id})" style="width:100%; padding:14px; border-radius:12px; border:none; background:#0f172a; color:white; font-weight:700; cursor:pointer;">
                Añadir al Carrito
            </button>
        </div>
    `).join('');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function filtrarTodo() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const max = document.getElementById('price-range').value;
    const cats = Array.from(document.querySelectorAll('.cat-check:checked')).map(c => c.value);
    document.getElementById('price-val').textContent = `$${parseInt(max).toLocaleString()}`;
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(query) && p.precioMayor <= max && cats.includes(p.cat));
    renderizarProductos(filtrados);
}

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    carrito.push({ nombre: p.nombre, tipo: esMayor ? 'Mayor' : 'Embalaje', precio: esMayor ? p.precioMayor : p.precioEmbalaje });
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #eee;">
                <div><strong>${item.nombre}</strong><br><small style="color:#4f46e5">${item.tipo}</small></div>
                <div style="text-align:right;"><strong>$${item.precio.toLocaleString()}</strong><br>
                <span onclick="eliminar(${idx})" style="color:#ef4444; cursor:pointer; font-size:0.75rem; font-weight:700;">Eliminar</span></div>
            </div>`;
    }).join('');
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function eliminar(idx) {
    carrito.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfaz();
    renderizarCarrito();
}

// LÓGICA DE MODAL DE CONFIRMACIÓN
function confirmarVaciar() {
    if(carrito.length > 0) document.getElementById('confirm-modal').style.display = 'flex';
}

function cerrarConfirmar() {
    document.getElementById('confirm-modal').style.display = 'none';
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarInterfaz();
    renderizarCarrito();
    cerrarConfirmar();
    mostrarAlerta("🗑️ Carrito vacío", "#64748b");
}

function mostrarAlerta(msg, color = "#0f172a") {
    const t = document.getElementById('notification');
    t.textContent = msg; t.style.background = color; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    actualizarInterfaz();
});
