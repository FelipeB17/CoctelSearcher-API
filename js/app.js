document.addEventListener('DOMContentLoaded', () => {
    const ingredientSelect = document.getElementById('ingredient-select');
    const categorySelect = document.getElementById('category-select');
    const nameSearch = document.getElementById('name-search');
    const searchButton = document.getElementById('search-button');
    const errorMessage = document.getElementById('error-message');
    const searchContainer = document.getElementById('search-container');
    const resultsContainer = document.getElementById('results-container');
    const homeButton = document.getElementById('home-button');
    const backButton = document.getElementById('back-button');

    // Sistema de historial simple
    window.pageHistory = ['home'];
    window.currentPage = 'home';

    // Cargar ingredientes
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
        .then(response => response.json())
        .then(data => {
            data.drinks.forEach(drink => {
                const option = document.createElement('option');
                option.value = drink.strIngredient1;
                option.textContent = drink.strIngredient1;
                ingredientSelect.appendChild(option);
            });
        });

    // Cargar categorías
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list')
        .then(response => response.json())
        .then(data => {
            data.drinks.forEach(drink => {
                const option = document.createElement('option');
                option.value = drink.strAlcoholic;
                option.textContent = drink.strAlcoholic;
                categorySelect.appendChild(option);
            });
        });

    // Función de búsqueda
    searchButton.addEventListener('click', () => {
        errorMessage.classList.add('d-none');
        let url;
        let selectedFilters = 0;

        if (ingredientSelect.value) {
            url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientSelect.value}`;
            selectedFilters++;
        }
        if (categorySelect.value) {
            url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${categorySelect.value}`;
            selectedFilters++;
        }
        if (nameSearch.value) {
            url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nameSearch.value}`;
            selectedFilters++;
        }

        if (selectedFilters > 1) {
            errorMessage.textContent = 'Por favor, selecciona solo un filtro a la vez.';
            errorMessage.classList.remove('d-none');
            return;
        }

        if (!url) {
            errorMessage.textContent = 'Por favor, selecciona un criterio de búsqueda.';
            errorMessage.classList.remove('d-none');
            return;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => displayResults(data.drinks));
    });

    // Función para mostrar/ocultar los filtros de búsqueda
    window.toggleSearchFilters = function(show) {
        searchContainer.style.display = show ? 'flex' : 'none';
    };

    // Función para limpiar el contenido
    window.clearContent = function() {
        resultsContainer.innerHTML = '';
        errorMessage.classList.add('d-none');
        ingredientSelect.value = '';
        categorySelect.value = '';
        nameSearch.value = '';
    };

    // Función para navegar a una nueva página
    window.navigateTo = function(page) {
        if (window.currentPage !== page) {
            window.pageHistory.push(page);
            window.currentPage = page;
        }
        updateBackButton();
    };

    // Función para volver a la página anterior
    window.goBack = function() {
        if (window.pageHistory.length > 1) {
            window.pageHistory.pop(); // Elimina la página actual
            const previousPage = window.pageHistory[window.pageHistory.length - 1];
            window.currentPage = previousPage;
            
            if (previousPage === 'home') {
                clearContent();
                toggleSearchFilters(true);
            } else if (previousPage === 'results') {
                // Aquí deberías volver a cargar los resultados de la búsqueda anterior
                // Por ahora, simplemente volveremos a la página de inicio
                clearContent();
                toggleSearchFilters(true);
            } else {
                // Si es una página de detalles, volvemos a cargar esa página
                const [type, id] = previousPage.split('-');
                if (type === 'cocktail') {
                    showDetails(id);
                } else if (type === 'ingredient') {
                    showIngredientDetails(id);
                }
            }
        }
        updateBackButton();
    };

    // Función para ir al inicio
    window.goHome = function() {
        clearContent();
        toggleSearchFilters(true);
        window.pageHistory = ['home'];
        window.currentPage = 'home';
        updateBackButton();
    };

    // Actualizar visibilidad del botón de volver
    window.updateBackButton = function() {
        if (window.pageHistory.length > 1) {
            backButton.classList.remove('d-none');
        } else {
            backButton.classList.add('d-none');
        }
    };

    // Evento para el botón de inicio
    homeButton.addEventListener('click', goHome);

    // Evento para el botón de volver
    backButton.addEventListener('click', goBack);

    // Añadir iconos decorativos
    const body = document.body;
    const icon1 = document.createElement('i');
    icon1.className = 'fas fa-cocktail cocktail-icon cocktail-icon-1';
    const icon2 = document.createElement('i');
    icon2.className = 'fas fa-glass-martini-alt cocktail-icon cocktail-icon-2';
    body.appendChild(icon1);
    body.appendChild(icon2);
});