function showIngredientDetails(ingredient) {
    clearContent();
    navigateTo(`ingredient-${ingredient}`);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            const ingredientData = data.ingredients[0];
            const detailsHTML = `
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <img src="https://www.thecocktaildb.com/images/ingredients/${ingredientData.strIngredient}-Medium.png" alt="${ingredientData.strIngredient}" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <h2 class="mb-4">${ingredientData.strIngredient}</h2>
                        <p class="lead">${ingredientData.strDescription || 'No hay descripción disponible.'}</p>
                    </div>
                </div>
            `;
            document.getElementById('results-container').innerHTML = detailsHTML;
            toggleSearchFilters(false);
        });
}