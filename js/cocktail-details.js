function showDetails(id) {
    clearContent();
    navigateTo(`cocktail-${id}`);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const drink = data.drinks[0];
            const detailsHTML = `
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <h2 class="mb-4">${drink.strDrink}</h2>
                        <h3 class="mb-3">Ingredientes:</h3>
                        <ul class="list-unstyled">
                            ${getIngredients(drink)}
                        </ul>
                        <h3 class="mb-3">Instrucciones:</h3>
                        <p class="lead">${drink.strInstructions}</p>
                    </div>
                </div>
            `;
            document.getElementById('results-container').innerHTML = detailsHTML;
            toggleSearchFilters(false);
        });
}

function getIngredients(drink) {
    let ingredients = '';
    for (let i = 1; i <= 15; i++) {
        if (drink[`strIngredient${i}`]) {
            ingredients += `
                <li class="mb-2">
                    <img src="https://www.thecocktaildb.com/images/ingredients/${drink[`strIngredient${i}`]}-Small.png" alt="${drink[`strIngredient${i}`]}" class="ingredient-img me-2">
                    <a href="#" onclick="showIngredientDetails('${drink[`strIngredient${i}`]}')" class="text-decoration-none">
                        ${drink[`strIngredient${i}`]}
                    </a>
                    ${drink[`strMeasure${i}`] ? ` - ${drink[`strMeasure${i}`]}` : ''}
                </li>
            `;
        }
    }
    return ingredients;
}