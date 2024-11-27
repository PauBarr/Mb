document.addEventListener("DOMContentLoaded", async () => {
    const productId = new URLSearchParams(window.location.search).get("id");
    const API_URL = `https://api.mercadolibre.com/items/${productId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al cargar el producto.");
        const product = await response.json();

        loadProductDetails(product);

        // Configurar evento para agregar al carrito
        document.getElementById("addToCart").addEventListener("click", () => {
            addToCart(product);
            updateCartSidebar();
            openCartSidebar();
        });
    } catch (error) {
        console.error("Error al cargar el detalle del producto:", error);
        document.getElementById("productDetail").innerHTML = '<p class="text-center">No se pudo cargar el producto.</p>';
    }
});

function loadProductDetails(product) {
    // Mostrar información básica del producto
    document.getElementById("productImage").src = product.pictures?.[0]?.secure_url || "../imagenes/placeholder-producto.jpg";
    document.getElementById("productTitle").textContent = product.title || "Producto no disponible";
    document.getElementById("productPrice").textContent = `Precio: $${product.price.toFixed(2)}`;
    document.getElementById("productDescription").textContent = product.description?.plain_text || "Descripción no disponible.";
}

function addToCart(product) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Incrementar cantidad si ya existe en el carrito
        cartItems[existingProductIndex].quantity += 1;
    } else {
        // Agregar nuevo producto al carrito
        cartItems.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.pictures?.[0]?.secure_url || "../imagenes/placeholder-producto.jpg",
            quantity: 1,
        });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function updateCartSidebar() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotalElement = document.getElementById("cartTotal");

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
    } else {
        cartItems.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("cart-item", "d-flex", "align-items-center", "justify-content-between", "mb-3");

            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info flex-grow-1 ml-3">
                    <h6 class="mb-1">${item.title}</h6>
                    <small>
                        Cantidad: 
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateItemQuantity(${index}, ${item.quantity - 1})">-</button>
                        ${item.quantity}
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateItemQuantity(${index}, ${item.quantity + 1})">+</button>
                    </small>
                </div>
                <div class="text-right">
                    <span class="text-success d-block">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger mt-1" onclick="removeItem(${index})">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);

            total += item.price * item.quantity;
        });
    }

    cartTotalElement.textContent = total.toFixed(2);
}

function updateItemQuantity(index, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (newQuantity <= 0) {
        cartItems.splice(index, 1);
    } else {
        cartItems[index].quantity = newQuantity;
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartSidebar();
}

function removeItem(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartSidebar();
}

function openCartSidebar() {
    document.getElementById("cartSidebar").classList.add("open");
}

function closeCartSidebar() {
    document.getElementById("cartSidebar").classList.remove("open");
}

// Configurar eventos
document.getElementById("closeCart").addEventListener("click", closeCartSidebar);
document.getElementById("checkout").addEventListener("click", () => {
    window.location.href = "../formulario.html";
});

// Inicialización
document.addEventListener("DOMContentLoaded", updateCartSidebar);
