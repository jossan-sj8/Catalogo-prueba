const productos = [
    { id: 1, cat: "Electronica", codigo: "SKU-001", nombre: "Cámara Pro 4K", precioMayor: 45000, precioEmbalaje: 240000, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
    { id: 2, cat: "Accesorios", codigo: "SKU-002", nombre: "Audífonos Studio", precioMayor: 15000, precioEmbalaje: 80000, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 3, cat: "Electronica", codigo: "SKU-003", nombre: "Smartwatch Elite", precioMayor: 25000, precioEmbalaje: 130000, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 4, cat: "Accesorios", codigo: "SKU-004", nombre: "Mouse Gamer RGB", precioMayor: 12000, precioEmbalaje: 65000, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarProductos(lista) {
    const container = document.getElementById('productos');
    container.innerHTML = lista.map(p => `
        <div class="producto">
            <img src="${p.imagen}">
            <small>${p.codigo}</small>
            <h3>${p.nombre}</h3>
            <div class="selector-precio">
                <label class="precio-card">
                    <input type="radio" name="p-${p.id}" value="mayor" checked id="m-${p.id}">
                    <span class="label">POR MAYOR</span>
                    <span class="val">$${p.precioMayor.toLocaleString()}</span>
                </label>
                <label class="precio-card">
                    <input type="radio" name="p-${p.id}" value="emb" id="e-${p.id}">
                    <span class="label">EMBALAJE</span>
                    <span class="val">$${p.precioEmbalaje.toLocaleString()}</span>
                </label>
            </div>
            <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})" style="width:100%; background:var(--dark); color:white; border:none; padding:10px; border-radius:8px; cursor:pointer;">Agregar</button>
        </div>
    `).join('');
}

function filtrarTodo() {
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    const precioMax = document.getElementById('price-range').value;
    const categorias = Array.from(document.querySelectorAll('.cat-check:checked')).map(cb => cb.value);
    
    document.getElementById('price-val').textContent = `$${parseInt(precioMax).toLocaleString()}`;

    const filtrados = productos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda);
        const coincidePrecio = p.precioMayor <= precioMax;
        const coincideCat = categorias.includes(p.cat);
        return coincideNombre && coincidePrecio && coincideCat;
    });

    renderizarProductos(filtrados);
}

function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    
    carrito.push({
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
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div><strong>${item.nombre}</strong><br><small>${item.tipo}</small></div>
                <div style="text-align:right;">$${item.precio.toLocaleString()}<br>
                <span onclick="eliminar(${idx})" style="color:red; cursor:pointer; font-size:0.7rem;">Eliminar</span></div>
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
    if(confirm("¿Vaciar todo?")) {
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
    let msg = "*PEDIDO PROJECT GON*\n";
    carrito.forEach(i => msg += `- ${i.nombre} (${i.tipo}): $${i.precio}\n`);
    window.open(`https://wa.me/56983968041?text=${encodeURIComponent(msg)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    actualizarInterfaz();
});
