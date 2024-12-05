// Toggle function to show/hide recipe steps
        function toggleSteps(recipeId) {
            const stepsDiv = document.getElementById(`steps-${recipeId}`);
            stepsDiv.classList.toggle('hidden');
        }

        // Function to fetch recipes based on search and filter parameters
        function fetchRecipes() {
            const searchQuery = document.getElementById('search').value;
            const difficulty = Array.from(document.querySelectorAll('input[name="difficulty[]"]:checked')).map(input => input.value);
            const dishTypes = Array.from(document.querySelectorAll('input[name="dish_types[]"]:checked')).map(input => input.value);

            let url = 'recipe-list.php?';  // PHP file to fetch recipes from
            if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
            if (difficulty.length > 0) url += `difficulty[]=${difficulty.join('&difficulty[]=')}&`;
            if (dishTypes.length > 0) url += `dish_types[]=${dishTypes.join('&dish_types[]=')}&`;

            // Debugging: Log the URL that will be sent
            console.log("Fetching from URL:", url);

            // Fetch data from recipe-list.php with search and filter parameters
            fetch(url)
                .then(response => {
                    // Log the response to check what comes back
                    console.log("Response received:", response);
                    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(recipes => {
                    const recipeContainer = document.getElementById('recipe-container');
                    recipeContainer.innerHTML = ''; // Clear previous recipes

                    if (recipes.length === 0) {
                        recipeContainer.innerHTML = '<p>No recipes found.</p>';
                    } else {
                        // Loop through recipes and display each one
                        recipes.forEach(recipe => {
                            const recipeBox = document.createElement('div');
                            recipeBox.classList.add('recipe-box');
                            recipeBox.setAttribute('onclick', `toggleSteps(${recipe.recipe_ID})`);

                            recipeBox.innerHTML = `
                                <img src="images/${recipe.recipe_image}" alt="Recipe Image">
                                <h2>${recipe.recipename}</h2>
                                <p><strong>Description:</strong> ${recipe.recipedescrip}</p>
                                <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                                <p><strong>Type:</strong> ${recipe.dish_types}</p>
                                <div id="steps-${recipe.recipe_ID}" class="hidden">
                                    <p><strong>Steps:</strong> ${recipe.recipesteps}</p>
                                </div>
                            `;
                            recipeContainer.appendChild(recipeBox);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                    document.getElementById('recipe-container').innerHTML = '<p>Error loading recipes.</p>';
                });
        }

        // Call fetchRecipes when the page loads to show all recipes by default
        window.onload = fetchRecipes;