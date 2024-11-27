const API_URL = "https://api.mercadolibre.com/sites/MLA/search?q=";
const ITEM_DETAIL_URL = "https://api.mercadolibre.com/items/";
let allProducts = [];

// Función para obtener productos de la API
async function fetchProducts() {
    try {
        const categories = ["chocolates", "alfajores", "dulces"];
        const promises = categories.map(category =>
            fetch(`${API_URL}${category}&limit=10`).then(response => response.json())
        );

        const results = await Promise.all(promises);

        // Procesar productos y asociar cada uno a su categoría
        const products = results.flatMap((result, index) => 
            result.results.map(product => ({
                id: product.id,
                title: product.title,
                price: product.price,
                category: categories[index], // Asociar categoría manualmente
                image: product.thumbnail
            }))
        );

        // Obtener imágenes de alta calidad
        const detailedProducts = await Promise.all(
            products.map(async product => {
                try {
                    const detailResponse = await fetch(`${ITEM_DETAIL_URL}${product.id}`);
                    if (!detailResponse.ok) throw new Error(`Detalle no encontrado para ${product.id}`);
                    const detail = await detailResponse.json();
                    return {
                        ...product,
                        image: detail.pictures?.[0]?.secure_url || product.image // Actualizar imagen si está disponible
                    };
                } catch (error) {
                    console.error(`Error al obtener detalles para ${product.id}:`, error);
                    return product; // Mantener datos básicos en caso de error
                }
            })
        );

        allProducts = detailedProducts;
        displayProducts(allProducts); // Mostrar productos al cargar
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Función para mostrar productos en el catálogo
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm");

        const img = document.createElement("img");
        img.src = product.image;
        img.classList.add("card-img-top");
        img.alt = product.title;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = product.title;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = `Precio: $${product.price.toFixed(2)}`;

        const link = document.createElement("a");
        link.href = `detalle.html?id=${product.id}`;
        link.classList.add("btn", "btn-dark", "btn-block");
        link.textContent = "Ver más";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(link);

        card.appendChild(img);
        card.appendChild(cardBody);

        col.appendChild(card);
        productList.appendChild(col);
    });
}

// Función para aplicar filtros dinámicos
function applyFilters(event) {
    event.preventDefault();

    const category = document.getElementById("category").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const filteredProducts = allProducts.filter(product =>
        (category === "" || product.category === category) && // solo pasen productos que coincidan exactamente con la categoría seleccionada 
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    displayProducts(filteredProducts);
}

// Inicializar el catálogo y configurar los filtros
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    document.getElementById("filterForm").addEventListener("submit", applyFilters);
});
