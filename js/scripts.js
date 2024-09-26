// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const ingredientSelect = document.getElementById('ingredient');
    const searchForm = document.getElementById('search-form');
    const resultsDiv = document.getElementById('results');

    // Función para cargar ingredientes
    const loadIngredients = async () => {
        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
            const data = await response.json();
            const ingredients = data.drinks;

            ingredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient.strIngredient1;
                option.textContent = ingredient.strIngredient1;
                ingredientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar ingredientes:', error);
        }
    };

    // Función para buscar cócteles por nombre
    const searchCocktails = async (query) => {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            return data.drinks;
        } catch (error) {
            console.error('Error al buscar cócteles:', error);
            return null;
        }
    };

    // Función para obtener detalles completos del cóctel
    const getCocktailDetails = async (id) => {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            return data.drinks[0];  // Solo necesitamos el primer cóctel
        } catch (error) {
            console.error('Error al obtener detalles del cóctel:', error);
            return null;
        }
    };

    // Función para mostrar resultados
    const displayResults = async (cocktails) => {
        resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

        if (!cocktails || cocktails.length === 0) {
            resultsDiv.innerHTML = '<p class="text-center">No se encontraron cócteles.</p>';
            return;
        }

        for (const cocktail of cocktails) {
            // Obtener detalles completos del cóctel si no están ya presentes
            const cocktailDetails = cocktail.strAlcoholic ? cocktail : await getCocktailDetails(cocktail.idDrink);

            if (cocktailDetails) {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const img = document.createElement('img');
                img.src = cocktailDetails.strDrinkThumb;
                img.className = 'card-img-top';
                img.alt = cocktailDetails.strDrink;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = cocktailDetails.strDrink;

                const cardText = document.createElement('p');
                cardText.className = 'card-text';
                cardText.textContent = `Tipo: ${cocktailDetails.strAlcoholic || 'Desconocido'}`;

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                resultsDiv.appendChild(col);
            }
        }
    };

    // Función para mostrar mensajes de error
    const showMessage = (message, type = 'danger') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mt-3`;
        alertDiv.textContent = message;
        document.querySelector('.container').prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    };

    // Manejar el evento de envío del formulario
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ingredient = ingredientSelect.value;
        const type = document.getElementById('type').value;
        const name = document.getElementById('name').value.trim();

        // Verificar si hay más de un campo lleno
        const filledFields = [ingredient, type, name].filter(value => value !== '');
        if (filledFields.length > 1) {
            showMessage('Solo puedes buscar por un criterio (ingrediente, tipo o nombre).', 'warning');
            return;
        }

        let cocktails = [];

        if (name) {
            cocktails = await searchCocktails(name);
        } else if (ingredient) {
            // Buscar por ingrediente
            try {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
                const data = await response.json();
                cocktails = data.drinks;
            } catch (error) {
                console.error('Error al buscar por ingrediente:', error);
            }
        } else if (type) {
            // Buscar por tipo sin nombre ni ingrediente
            try {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${type}`);
                const data = await response.json();
                cocktails = data.drinks;
            } catch (error) {
                console.error('Error al buscar por tipo:', error);
            }
        }

        await displayResults(cocktails);
    });

    // Cargar ingredientes al iniciar
    loadIngredients();
});
