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
    
    // Función para buscar cócteles
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
    
    // Función para filtrar por ingrediente y tipo
    const filterCocktails = (cocktails, ingredient, type) => {
        return cocktails.filter(cocktail => {
            const hasIngredient = ingredient ? cocktail.strIngredient1.toLowerCase() === ingredient.toLowerCase() ||
                cocktail.strIngredient2?.toLowerCase() === ingredient.toLowerCase() ||
                cocktail.strIngredient3?.toLowerCase() === ingredient.toLowerCase() ||
                cocktail.strIngredient4?.toLowerCase() === ingredient.toLowerCase() ||
                cocktail.strIngredient5?.toLowerCase() === ingredient.toLowerCase() : true;
            const matchesType = type ? cocktail.strAlcoholic === type : true;
            return hasIngredient && matchesType;
        });
    };
    
    // Función para mostrar resultados
    const displayResults = (cocktails) => {
        resultsDiv.innerHTML = ''; // Limpiar resultados anteriores
        
        if (!cocktails || cocktails.length === 0) {
            resultsDiv.innerHTML = '<p class="text-center">No se encontraron cócteles.</p>';
            return;
        }
        
        cocktails.forEach(cocktail => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            
            const card = document.createElement('div');
            card.className = 'card h-100';
            
            const img = document.createElement('img');
            img.src = cocktail.strDrinkThumb;
            img.className = 'card-img-top';
            img.alt = cocktail.strDrink;
            
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = cocktail.strDrink;
            
            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = `Tipo: ${cocktail.strAlcoholic}`;
            
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);
            resultsDiv.appendChild(col);
        });
    };
    
    // Manejar el evento de envío del formulario
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const ingredient = ingredientSelect.value;
        const type = document.getElementById('type').value;
        const name = document.getElementById('name').value.trim();
        
        if (!ingredient && !type && !name) {
            alert('Por favor, ingresa al menos un criterio de búsqueda.');
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
        }
        
        // Si se proporciona tipo, filtrar los resultados
        if (type && cocktails) {
            // Para filtrar por tipo, necesitamos detalles completos de cada cóctel
            const detailedCocktails = await Promise.all(cocktails.map(async (cocktail) => {
                const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`);
                const detailData = await res.json();
                return detailData.drinks ? detailData.drinks[0] : null;
            }));
            cocktails = detailedCocktails.filter(cocktail => cocktail && cocktail.strAlcoholic === type);
        }
        
        displayResults(cocktails);
    });
    
    // Cargar ingredientes al iniciar
    loadIngredients();
});
