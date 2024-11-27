const API_URL = "https://api.mercadolibre.com/sites/MLA/search?q=";

const HIGHLIGHTED_CATEGORIES = [
    { name: "chocolates", limit: 3 },
    { name: "alfajores", limit: 3 },
    { name: "dulces", limit: 3 }
];

// Función para obtener los productos destacados
async function fetchHighlightedProducts() {
    try {
        const allProducts = [];
        for (const category of HIGHLIGHTED_CATEGORIES) {
            const response = await fetch(`${API_URL}${category.name}&limit=${category.limit}`);
            if (!response.ok) throw new Error(`Error al cargar productos de ${category.name}`);
            const data = await response.json();

            // Usar datos directamente del endpoint de búsqueda para reducir el número de solicitudes
            data.results.forEach(product => {
                allProducts.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail // Imagen inicial (menor resolución)
                });
            });
        }
        return allProducts;
    } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        return [];
    }
}

// Función para cargar imágenes de alta calidad de manera progresiva
async function loadHighQualityImage(productId) {
    try {
        const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
        if (response.ok) {
            const data = await response.json();
            return data.pictures?.[0]?.secure_url || null; // Imagen de alta calidad
        }
    } catch (error) {
        console.error(`Error al cargar imagen de alta calidad para el producto ${productId}:`, error);
    }
    return null; // Retornar null si hay un error o no hay imagen
}

// Función para mostrar los productos destacados
async function displayHighlightedProducts() {
    const productosDestacadosRow = document.getElementById("productosDestacadosRow");
    productosDestacadosRow.innerHTML = "";

    const products = await fetchHighlightedProducts();
    products.forEach(async (product) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm", "mb-4");

        // Imagen inicial (thumbnail)
        const img = document.createElement("img");
        img.src = product.thumbnail; // Usar imagen de baja resolución inicialmente
        img.classList.add("card-img-top");
        img.alt = product.title;

        // Intentar cargar imagen de alta calidad de forma diferida
        loadHighQualityImage(product.id).then(highResImage => {
            if (highResImage) {
                img.src = highResImage; // Reemplazar la imagen con la de alta calidad
            }
        });

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = product.title;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = `Precio: $${product.price ? product.price.toFixed(2) : "No disponible"}`;

        const link = document.createElement("a");
        link.href = `Paginas/detalle.html?id=${product.id}`;
        link.classList.add("btn", "btn-primary", "btn-block");
        link.textContent = "Ver más";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(link);

        card.appendChild(img);
        card.appendChild(cardBody);

        col.appendChild(card);
        productosDestacadosRow.appendChild(col);
    });
}

document.addEventListener("DOMContentLoaded", displayHighlightedProducts);
