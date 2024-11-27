document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartSummary = document.getElementById("cartSummary");

    if (cartItems.length === 0) {
        cartSummary.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
        return;
    }

    let total = 0;
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-hover");

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Total</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    cartItems.forEach(item => {
        total += item.price * item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    cartSummary.appendChild(table);

    const totalElement = document.createElement("p");
    totalElement.classList.add("font-weight-bold", "text-right", "mt-3");
    totalElement.textContent = `Total a Pagar: $${total.toFixed(2)}`;
    cartSummary.appendChild(totalElement);

    // Procesar el formulario
    document.getElementById("purchaseForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            payment: document.getElementById("payment").value,
            cartItems,
            total: total.toFixed(2),
        };

        console.log("Datos del formulario enviados:", formData);

        alert("¡Compra realizada con éxito!");
        localStorage.removeItem("cartItems");
        window.location.href = "./index.html";
    });
});
