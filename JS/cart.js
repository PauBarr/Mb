// Obtener el carrito desde localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

// Guardar el carrito en localStorage
function saveCartItems(items) {
    localStorage.setItem("cartItems", JSON.stringify(items));
}

// Mostrar los productos en el carrito
function displayCartItems() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center w-100">El carrito está vacío.</p>';
        totalPriceElement.textContent = "0.00";
        return;
    }

    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        const col = document.createElement("div");
        col.classList.add("col-md-12", "mb-3");

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm", "p-2");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "justify-content-between", "align-items-center");

        const info = document.createElement("div");
        info.classList.add("d-flex", "align-items-center");

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        img.style.width = "80px";
        img.style.height = "80px";
        img.classList.add("rounded", "mr-3");

        const details = document.createElement("div");
        details.innerHTML = `
            <h5 class="card-title mb-0">${item.title}</h5>
            <p class="mb-0 text-muted">Precio unitario: $${item.price.toFixed(2)}</p>
        `;

        info.appendChild(img);
        info.appendChild(details);

        const actions = document.createElement("div");
        actions.classList.add("d-flex", "align-items-center");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;
        quantity.classList.add("mx-3", "font-weight-bold");

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
        increaseButton.addEventListener("click", () => {
            updateItemQuantity(index, item.quantity + 1);
        });

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
        decreaseButton.addEventListener("click", () => {
            if (item.quantity > 1) {
                updateItemQuantity(index, item.quantity - 1);
            }
        });

        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.classList.add("btn", "btn-danger", "btn-sm", "ml-3");
        removeButton.addEventListener("click", () => {
            removeItem(index);
        });

        actions.appendChild(decreaseButton);
        actions.appendChild(quantity);
        actions.appendChild(increaseButton);
        actions.appendChild(removeButton);

        cardBody.appendChild(info);
        cardBody.appendChild(actions);

        card.appendChild(cardBody);
        col.appendChild(card);

        cartItemsContainer.appendChild(col);

        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Actualizar la cantidad de un producto
function updateItemQuantity(index, quantity) {
    const cartItems = getCartItems();
    cartItems[index].quantity = quantity;
    saveCartItems(cartItems);
    displayCartItems();
}

// Eliminar un producto del carrito
function removeItem(index) {
    const cartItems = getCartItems();
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    displayCartItems();
}

// Vaciar el carrito
function clearCart() {
    saveCartItems([]);
    displayCartItems();
}

// Finalizar compra
function finalizePurchase() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Guardar resumen del carrito para mostrar en el formulario
    localStorage.setItem("purchaseSummary", JSON.stringify(cartItems));
    window.location.href = "../Paginas/formulario.html";
}

// Configuración inicial
document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    document.getElementById("clear-cart").addEventListener("click", clearCart);
    document.getElementById("buy-now").addEventListener("click", finalizePurchase);
});
