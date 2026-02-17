// Base de datos de productos
const productos = [
    {
        id: 1,
        codigo: "PROD-001",
        nombre: "Producto 1",
        descripcion: "Descripción del producto 1",
        precioMayor: 1000,        // Precio por unidad comprando 5+
        precioEmbalaje: 4500,     // Precio del embalaje completo
        unidadesPorEmbalaje: 6,   // Cuántas unidades trae el embalaje
        imagen: "https://via.placeholder.com/300x200?text=Producto+1"
    },
    {
        id: 2,
        codigo: "PROD-002",
        nombre: "Producto 2",
        descripcion: "Descripción del producto 2",
        precioMayor: 1500,
        precioEmbalaje: 8000,
        unidadesPorEmbalaje: 6,
        imagen: "https://via.placeholder.com/300x200?text=Producto+2"
    },
    {
        id: 3,
        codigo: "PROD-003",
        nombre: "Producto 3",
        descripcion: "Descripción del producto 3",
        precioMayor: 2000,
        precioEmbalaje: 11000,
        unidadesPorEmbalaje: 6,
        imagen: "https://via.placeholder.com/300x200?text=Producto+3"
    },
    {
        id: 4,
        codigo: "PROD-004",
        nombre: "Producto 4",
        descripcion: "Descripción del producto 4",
        precioMayor: 2500,
        precioEmbalaje: 14000,
        unidadesPorEmbalaje: 6,
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
            <div class="codigo">Código: ${producto.codigo}</div>
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            
            <div class="opciones-compra">
                <div class="opcion-precio">
                    <input type="radio" 
                           id="mayor-${producto.id}" 
                           name="tipo-${producto.id}" 
                           value="mayor" 
                           checked>
                    <label for="mayor-${producto.id}">
                        <strong>Por Mayor (mín. 5 unid.)</strong><br>
                        <span class="precio">$${producto.precioMayor}</span> c/u
                    </label>
                </div>
                
                <div class="opcion-precio">
                    <input type="radio" 
                           id="embalaje-${producto.id}" 
                           name="tipo-${producto.id}" 
                           value="embalaje">
                    <label for="embalaje-${producto.id}">
                        <strong>Por Embalaje (${producto.unidadesPorEmbalaje} unid.)</strong><br>
                        <span class="precio">$${producto.precioEmbalaje}</span> embalaje
                    </label>
                </div>
            </div>
            
            <div class="cantidad-selector">
                <label for="cantidad-${producto.id}">Cantidad:</label>
                <input type="number" 
                       id="cantidad-${producto.id}" 
                       min="1" 
                       value="5" 
                       class="input-cantidad">
            </div>
            
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                Agregar al Carrito
            </button>
        `;
        container.appendChild(div);
        
        // Listener para cambiar cantidad mínima según tipo
        const radioMayor = document.getElementById(`mayor-${producto.id}`);
        const radioEmbalaje = document.getElementById(`embalaje-${producto.id}`);
        const inputCantidad = document.getElementById(`cantidad-${producto.id}`);
        
        radioMayor.addEventListener('change', () => {
            inputCantidad.min = 5;
            if (inputCantidad.value < 5) inputCantidad.value = 5;
        });
        
        radioEmbalaje.addEventListener('change', () => {
            inputCantidad.min = 1;
            inputCantidad.value = 1;
        });
    });
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    
    // Obtener tipo seleccionado
    const radioMayor = document.getElementById(`mayor-${idProducto}`);
    const tipo = radioMayor.checked ? 'mayor' : 'embalaje';
    
    // Obtener cantidad
    const cantidad = parseInt(document.getElementById(`cantidad-${idProducto}`).value);
    
    // Validar cantidad mínima para mayor
    if (tipo === 'mayor' && cantidad < 5) {
        alert('La compra por mayor requiere mínimo 5 unidades');
        return;
    }
    
    // Calcular precio
    let precioUnitario, precioTotal, descripcionTipo;
    
    if (tipo === 'mayor') {
        precioUnitario = producto.precioMayor;
        precioTotal = precioUnitario * cantidad;
        descripcionTipo = `Por Mayor (${cantidad} unidades)`;
    } else {
        precioUnitario = producto.precioEmbalaje;
        precioTotal = precioUnitario * cantidad;
        const totalUnidades = cantidad * producto.unidadesPorEmbalaje;
        descripcionTipo = `Por Embalaje (${cantidad} embalaje${cantidad > 1 ? 's' : ''} = ${totalUnidades} unidades)`;
    }
    
    // Verificar si ya existe en carrito con mismo tipo
    const itemExistente = carrito.find(item => 
        item.id === idProducto && item.tipo === tipo
    );
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        itemExistente.precioTotal = itemExistente.precioUnitario * itemExistente.cantidad;
    } else {
        carrito.push({
            id: producto.id,
            codigo: producto.codigo,
            nombre: producto.nombre,
            tipo: tipo,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            precioTotal: precioTotal,
            descripcionTipo: descripcionTipo,
            unidadesPorEmbalaje: producto.unidadesPorEmbalaje
        });
    }
    
    guardarCarrito();
    actualizarContador();
    alert(`${producto.nombre} agregado al carrito\n${descripcionTipo}\nTotal: $${precioTotal}`);
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
        
        let detalleUnidades = '';
        if (item.tipo === 'embalaje') {
            const totalUnidades = item.cantidad * item.unidadesPorEmbalaje;
            detalleUnidades = `<small style="color: #666;">(${totalUnidades} unidades totales)</small><br>`;
        }
        
        div.innerHTML = `
            <div class="item-info">
                <strong>${item.nombre}</strong><br>
                <small style="color: #888;">Código: ${item.codigo}</small><br>
                <small style="color: #007bff;">${item.descripcionTipo}</small><br>
                ${detalleUnidades}
                <small>Precio unitario: $${item.precioUnitario}</small>
            </div>
            <div class="item-acciones">
                <strong class="item-precio">$${item.precioTotal}</strong>
                <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">🗑️</button>
            </div>
        `;
        container.appendChild(div);
        total += item.precioTotal;
    });
    
    document.getElementById('total').textContent = total.toLocaleString();
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
    
    let mensaje = '🛒 *NUEVO PEDIDO*\n\n';
    let total = 0;
    
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. *${item.nombre}*\n`;
        mensaje += `   📦 Código: ${item.codigo}\n`;
        mensaje += `   💰 Modalidad: ${item.descripcionTipo}\n`;
        mensaje += `   💵 Precio unitario: $${item.precioUnitario}\n`;
        
        if (item.tipo === 'embalaje') {
            const totalUnidades = item.cantidad * item.unidadesPorEmbalaje;
            mensaje += `   📊 Total unidades: ${totalUnidades}\n`;
        }
        
        mensaje += `   💲 Subtotal: $${item.precioTotal}\n\n`;
        total += item.precioTotal;
    });
    
    mensaje += `━━━━━━━━━━━━━━━━\n`;
    mensaje += `*TOTAL: $${total.toLocaleString()}*\n\n`;
    mensaje += `¡Gracias por tu pedido! 😊`;
    
    const numeroWhatsApp = "56983968041";
    
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarContador();
});
