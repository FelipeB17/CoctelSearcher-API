function displayResults(drinks) {
    clearContent();
    navigateTo('results');
    const resultsContainer = document.getElementById('results-container');
    if (drinks) {
        drinks.forEach(drink => {
            const card = document.createElement('div');
            card.className = 'col-md-3 mb-4';
            card.innerHTML = `
                <div class="card cocktail-card">
                    <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${drink.strDrink}</h5>
                        <button onclick="showDetails('${drink.idDrink}')" class="btn btn-primary w-100">
                            <i class="fas fa-info-circle me-2"></i>Ver detalles
                        </button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        resultsContainer.innerHTML = '<p class="col-12 text-center">No se encontraron resultados.</p>';
    }
    toggleSearchFilters(true);
}