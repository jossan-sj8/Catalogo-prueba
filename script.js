// Base de datos de ejemplo
const productos = [
    { id: 1, cat: "Electronica", codigo: "SKU-001", nombre: "Cámara Pro DSLR", precioMayor: 45000, precioEmbalaje: 240000, imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
    { id: 2, cat: "Accesorios", codigo: "SKU-002", nombre: "Audífonos Studio Pro", precioMayor: 15000, precioEmbalaje: 80000, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 3, cat: "Electronica", codigo: "SKU-003", nombre: "Smartwatch Elite V2", precioMayor: 25000, precioEmbalaje: 130000, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 4, cat: "Accesorios", codigo: "SKU-004", nombre: "Mouse Gamer Phantom", precioMayor: 12000, precioEmbalaje: 65000, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500" }
];

let carrito = JSON.parse(localStorage.getItem('gon_cart')) || [];

// Renderizar Productos
function renderizarProductos(lista) {
    const container = document.getElementById('productos');
    if(!container) return;
    
    container.innerHTML = lista.map(p => `
        <div class="producto-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <div class="sku">${p.codigo}</div>
            <h3>${p.nombre}</h3>
            
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
            
            <button class="btn-add" onclick="agregarAlCarrito(${p.id})">
                Añadir al Carrito
            </button>
        </div>
    `).join('');
}

// Filtros y Buscador
function filtrarTodo() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const maxPrice = document.getElementById('price-range').value;
    const catsSelected = Array.from(document.querySelectorAll('.cat-check:checked')).map(cb => cb.value);
    
    document.getElementById('price-val').textContent = `$${parseInt(maxPrice).toLocaleString()}`;

    const filtrados = productos.filter(p => {
        const matchName = p.nombre.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query);
        const matchPrice = p.precioMayor <= maxPrice;
        const matchCat = catsSelected.includes(p.cat);
        return matchName && matchPrice && matchCat;
    });

    renderizarProductos(filtrados);
}

// Lógica del Carrito
function agregarAlCarrito(id) {
    const p = productos.find(x => x.id === id);
    const esMayor = document.getElementById(`m-${id}`).checked;
    
    const item = {
        cartId: Date.now(),
        nombre: p.nombre,
        tipo: esMayor ? 'X Mayor' : 'Embalaje',
        precio: esMayor ? p.precioMayor : p.precioEmbalaje
    };
    
    carrito.push(item);
    guardarYActualizar();
    mostrarAlerta(`✅ ${p.nombre} añadido`);
}

function renderizarCarrito() {
    const container = document.getElementById('items-carrito');
    let total = 0;
    
    container.innerHTML = carrito.map((item, index) => {
        total += item.precio;
        return `
            <div class="cart-item">
                <div>
                    <div style="font-weight:800; font-size:0.95rem;">${item.nombre}</div>
                    <div style="font-size:0.75rem; color:var(--accent); font-weight:700;">${item.tipo}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:800;">$${item.precio.toLocaleString()}</div>
                    <button onclick="eliminarItem(${index})" style="background:none; border:none; color:var(--danger); font-size:0.75rem; font-weight:700; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarYActualizar();
    renderizarCarrito();
}

function guardarYActualizar() {
    localStorage.setItem('gon_cart', JSON.stringify(carrito));
    document.getElementById('contador-carrito').textContent = carrito.length;
}

// UI Toggles
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function toggleCarrito() {
    document.getElementById('modal-carrito').classList.toggle('active');
    renderizarCarrito();
}

// Modales de Confirmación
function confirmarVaciar() {
    if(carrito.length === 0) return;
    document.getElementById('confirm-modal').style.display = 'flex';
}

function cerrarConfirmar() {
    document.getElementById('confirm-modal').style.display = 'none';
}

function vaciarCarrito() {
    carrito = [];
    guardarYActualizar();
    renderizarCarrito();
    cerrarConfirmar();
    mostrarAlerta("🗑️ Carrito vaciado con éxito", "#64748b");
}

// Utilidades
function mostrarAlerta(msg, color = "#0f172a") {
    const t = document.getElementById('notification');
    t.textContent = msg;
    t.style.background = color;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function enviarPorWhatsApp() {
    if (carrito.length === 0) {
        mostrarAlerta("⚠️ El carrito está vacío", "#f59e0b");
        return;
    }
    let msg = "*NUEVO PEDIDO PROJECT GON*\n\n";
    carrito.forEach((i, idx) => {
        msg += `${idx + 1}. ${i.nombre} (${i.tipo}) - $${i.precio.toLocaleString()}\n`;
    });
    const total = carrito.reduce((s, i) => s + i.precio, 0);
    msg += `\n*TOTAL A PAGAR: $${total.toLocaleString()}*`;
    
    window.open(`https://wa.me/56983968041?text=${encodeURIComponent(msg)}`);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    document.getElementById('contador-carrito').textContent = carrito.length;
});
