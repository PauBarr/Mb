async function loadComponent(id, file) {
    const container = document.getElementById(id);
    try {
        const response = await fetch(file);
        if (response.ok) {
            const content = await response.text();
            container.innerHTML = content;
        } else {
            console.error(`Error al cargar ${file}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error al cargar ${file}: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbarContainer", "../componentes/navbar.html");
    loadComponent("footerContainer", "../componentes/footer.html");
});
