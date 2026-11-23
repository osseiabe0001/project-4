function preserveChefInNavigation() {
    const chef = new URLSearchParams(window.location.search).get("chef");
    if (chef !== "flay" && chef !== "ramsay") {
        return;
    }

    document.querySelectorAll("a[href]").forEach((link) => {
        const destination = new URL(link.href, window.location.href);
        if (["food.html", "Calculator.html", "minigame.html", "dinnerdash.html"].includes(destination.pathname.split("/").pop())) {
            destination.searchParams.set("chef", chef);
            link.href = destination.href;
        }
    });
}
// used ai to fid what the person clickecked on the recipes page

preserveChefInNavigation();

{
    const quizForm = document.getElementById("quiz-form");
    if (quizForm) {
        const answers = {
            q1: "b",
            q2: "a",
            q3: "a",
            q4: "a",
            q5: "c"
        };
        const results = document.getElementById("quiz-results");

        quizForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let score = 0;
            const questions = Object.entries(answers);
            let questionIndex = 0;

            while (questionIndex < questions.length) {
                const [question, correctAnswer] = questions[questionIndex];
                const selectedAnswer = quizForm.querySelector(`input[name="${question}"]:checked`);
                if (selectedAnswer?.value === correctAnswer) {
                    score += 1;
                }
                questionIndex += 1;
            }

            results.textContent = `Your score: ${score} out of ${questions.length}.`;
        });
    }
}

{
    const greeting = document.getElementById("greeting");
    if (greeting) {
        function updateGreeting() {
            const now = new Date();
            const hour = now.getHours();
            let timeGreeting;

            if (hour < 12) {
                timeGreeting = "Good morning!";
            } else if (hour < 18) {
                timeGreeting = "Good afternoon!";
            } else {
                timeGreeting = "Good night!";
            }

            const currentTime = now.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            });

            greeting.textContent =
                `${timeGreeting} It is ${currentTime}. Welcome to Abenas sizziling kitchen!`;
        }

        updateGreeting();
        setInterval(updateGreeting, 60_000);
    }
}

{
const recipes = [
    {
        name: "Pizza",
        description: "A classic Italian dish with a crispy crust, savory tomato sauce, and melted cheese.",
        ingredients: [
            { name: "Flour", amount: 500, unit: "g" },
            { name: "Tomatoes", amount: 200, unit: "g" },
            { name: "Yeast", amount: 7, unit: "g" },
            { name: "Olive oil", amount: 30, unit: "ml" },
            { name: "Cheese", amount: 250, unit: "g" },
            { name: "Basil", amount: 10, unit: "g" },
            { name: "Garlic", amount: 2, unit: "cloves" },
            { name: "Oregano", amount: 2, unit: "g" },
            { name: "Salt", amount: 10, unit: "g" },
            { name: "Pepper", amount: 1, unit: "g" },
            { name: "Water", amount: 300, unit: "ml" },
            { name: "Sugar", amount: 5, unit: "g" }
        ]
    },
    {
        name: "Grilled Chicken",
        description: "Tender chicken seasoned with herbs and grilled until golden.",
        ingredients: [
            { name: "Chicken", amount: 700, unit: "g" },
            { name: "Garlic", amount: 3, unit: "cloves" },
            { name: "Lemon", amount: 1, unit: "whole" },
            { name: "Paprika", amount: 5, unit: "g" },
            { name: "Olive oil", amount: 30, unit: "ml" }
        ]
    },
    {
        name: "Burger",
        description: "A juicy beef patty served on a toasted bun with fresh vegetables.",
        ingredients: [
            { name: "Beef patty", amount: 4, unit: "patties" },
            { name: "Bun", amount: 4, unit: "buns" },
            { name: "Lettuce", amount: 4, unit: "leaves" },
            { name: "Tomato", amount: 2, unit: "whole" },
            { name: "Onion", amount: 1, unit: "whole" },
            { name: "Pickles", amount: 8, unit: "slices" },
            { name: "Ketchup", amount: 30, unit: "ml" },
            { name: "Mustard", amount: 20, unit: "ml" }
        ]
    },
    {
        name: "french fries",
        description: "Crispy golden fries perfect for any meal.",
        ingredients: [
            { name: "Potatoes", amount: 800, unit: "g" },
            { name: "Oil", amount: 500, unit: "ml" },
            { name: "Salt", amount: 8, unit: "g" }
        ]
    }
];

const recipeList = document.getElementById("recipe-list");
if (recipeList) {
const selectionStorageKey = "selectedIngredients";
const selectionFromUrl = new URLSearchParams(window.location.search).get("ingredients");
const selectedIngredients = JSON.parse(
    selectionFromUrl ?? localStorage.getItem(selectionStorageKey) ?? "[]"
);
const calculatorLink = document.getElementById("calculator-link");

function saveSelections() {
    const serializedSelections = JSON.stringify(selectedIngredients);
    localStorage.setItem(selectionStorageKey, serializedSelections);

    const calculatorUrl = new URL(calculatorLink.href);
    calculatorUrl.searchParams.set("ingredients", serializedSelections);
    calculatorLink.href = calculatorUrl.href;
}

saveSelections();

for (let recipeIndex = 0; recipeIndex < recipes.length; recipeIndex++) {
    const recipe = recipes[recipeIndex];
    const recipeCard = document.createElement("article");
    recipeCard.className = "recipe-card";

    const title = document.createElement("h2");
    title.textContent = recipe.name;
    recipeCard.appendChild(title);

    const description = document.createElement("p");
    description.textContent = recipe.description;
    recipeCard.appendChild(description);

    const ingredientsHeading = document.createElement("h3");
    ingredientsHeading.textContent = "Ingredients";
    recipeCard.appendChild(ingredientsHeading);

    const ingredientList = document.createElement("ul");
    ingredientList.className = "ingredient-list";

    for (let ingredientIndex = 0; ingredientIndex < recipe.ingredients.length; ingredientIndex++) {
        const ingredient = recipe.ingredients[ingredientIndex];
        const listItem = document.createElement("li");
        const ingredientCard = document.createElement("button");
        const isSelected = selectedIngredients.some((selection) =>
            selection.recipe === recipe.name && selection.name === ingredient.name
        );

        ingredientCard.type = "button";
        ingredientCard.className = "ingredient-card";
        ingredientCard.textContent = ingredient.name;
        ingredientCard.classList.toggle("selected", isSelected);
        ingredientCard.onclick = function () {
            const nowSelected = this.classList.toggle("selected");
            const existingIndex = selectedIngredients.findIndex((selection) =>
                selection.recipe === recipe.name && selection.name === ingredient.name
            );

            if (nowSelected && existingIndex === -1) {
                selectedIngredients.push({
                    recipe: recipe.name,
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    baseServings: 4
                });
            } else if (!nowSelected && existingIndex !== -1) {
                selectedIngredients.splice(existingIndex, 1);
            }

            saveSelections();
            alert(`${ingredient.name} ${nowSelected ? "selected" : "unselected"}`);
        };

        listItem.appendChild(ingredientCard);
        ingredientList.appendChild(listItem);
    }

    recipeCard.appendChild(ingredientList);
    recipeList.appendChild(recipeCard);
}
}
}

if (document.getElementById("scale-form")) {
const baseServings = 4;
const selectionStorageKey = "selectedIngredients";
const selectionFromUrl = new URLSearchParams(window.location.search).get("ingredients");
const selectedIngredients = JSON.parse(
    selectionFromUrl ?? localStorage.getItem(selectionStorageKey) ?? "[]"
);

const scaleForm = document.getElementById("scale-form");
const servingsInput = document.getElementById("servings");
const ingredientAmounts = document.getElementById("ingredient-amounts");
const scaleSummary = document.getElementById("scale-summary");
const resultsTitle = document.getElementById("results-title");
const recipesLink = document.getElementById("recipes-link");

if (selectionFromUrl !== null) {
    localStorage.setItem(selectionStorageKey, JSON.stringify(selectedIngredients));
    const recipesUrl = new URL(recipesLink.href);
    recipesUrl.searchParams.set("ingredients", JSON.stringify(selectedIngredients));
    recipesLink.href = recipesUrl.href;
}

function scaleRecipe(servings, baseIngredientAmt, recipeServings = baseServings) {
    return (servings / recipeServings) * baseIngredientAmt;
}

function updateRecipe(servings) {
    const formattedAmount = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2
    });

    ingredientAmounts.replaceChildren();

    if (selectedIngredients.length === 0) {
        resultsTitle.textContent = "No ingredients selected";
        scaleSummary.textContent = "Go to Recipes and select the ingredients you want to scale.";
        return;
    }

    resultsTitle.textContent = "Selected ingredients";

    for (let index = 0; index < selectedIngredients.length; index++) {
        const ingredient = selectedIngredients[index];
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const amountCell = document.createElement("td");

        nameCell.textContent = `${ingredient.recipe}: ${ingredient.name}`;
        amountCell.textContent =
            `${formattedAmount.format(scaleRecipe(servings, ingredient.amount, ingredient.baseServings))} ${ingredient.unit}`;

        row.append(nameCell, amountCell);
        ingredientAmounts.appendChild(row);
    }

    scaleSummary.textContent = `Quantities for ${servings} ${servings === 1 ? "person" : "people"} (base recipe serves 4)`;
}

scaleForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!servingsInput.reportValidity()) {
        return;
    }

    updateRecipe(Number(servingsInput.value));
});

updateRecipe(baseServings);
}

if (document.getElementById("catch-field")) {
    const chefs = {
        flay: {
            name: "Chef Flay",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVH8a_Uz2s7xId3zqU33HIBmcqCiyGfgMZo7UcVrKQg&s=10",
            bonusPoints: 5,
            extraLives: 0
        },
        ramsay: {
            name: "Chef Ramsay",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPrNnYMtn3WemNjcvsGZRa0M9_XdiC6Y5RVTvJCIN8A&s=10",
            bonusPoints: 0,
            extraLives: 1
        }
    };
    const chef = chefs[new URLSearchParams(window.location.search).get("chef")] ?? chefs.flay;
    const field = document.getElementById("catch-field");
    const fallingItems = document.getElementById("falling-items");
    const catcher = document.getElementById("catcher");
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    const timerDisplay = document.getElementById("timer");
    const message = document.getElementById("game-message");
    const overlay = document.getElementById("game-overlay");
    const overlayTitle = document.getElementById("overlay-title");
    const overlayMessage = document.getElementById("overlay-message");
    const startButton = document.getElementById("start-game-btn");
    let score = 0;
    let gameRunning = false;
    let lives = 3 + chef.extraLives;
    let timeLeft = 45;
    let catcherLane = 1;
    let lastFrameTime = 0;
    let spawnInterval;
    let timerInterval;
    let animationFrame;

    document.getElementById("chef-name").textContent = chef.name;
    catcher.querySelector("img").src = chef.image;
    catcher.querySelector("img").alt = chef.name;

    function renderStats() {
        scoreDisplay.textContent = String(score);
        livesDisplay.textContent = `${"♥ ".repeat(lives).trim()}${"♡ ".repeat(Math.max(0, 3 + chef.extraLives - lives)).trim()}`.trim();
        timerDisplay.textContent = String(timeLeft);
        catcher.style.left = `${catcherLane * 33.333 + 16.667}%`;
    }

    function moveCatcher(direction) {
        if (!gameRunning) {
            return;
        }
        catcherLane = Math.max(0, Math.min(2, catcherLane + direction));
        renderStats();
    }

    function spawnItem() {
        if (!gameRunning) {
            return;
        }

        const isBurnt = Math.random() < 0.2;
        const ingredients = ["🍅", "🧀", "🥚", "🥬", "🥕", "🍄", "🧈", "🌶️"];
        const item = document.createElement("span");
        item.className = `falling-item ${isBurnt ? "burnt-item" : ""}`;
        item.textContent = isBurnt ? "🔥" : ingredients[Math.floor(Math.random() * ingredients.length)];
        item.setAttribute("aria-label", isBurnt ? "Burnt food" : "Ingredient");
        item.dataset.lane = String(Math.floor(Math.random() * 3));
        item.dataset.y = "-48";
        item.dataset.speed = String(150 + Math.random() * 90 + score * 0.35);
        item.style.left = `${Number(item.dataset.lane) * 33.333 + 16.667}%`;
        fallingItems.appendChild(item);
    }

    function finishGame(won) {
        gameRunning = false;
        window.clearInterval(spawnInterval);
        window.clearInterval(timerInterval);
        window.cancelAnimationFrame(animationFrame);
        fallingItems.replaceChildren();
        overlay.hidden = false;
        startButton.textContent = "Play again";
        overlayTitle.textContent = won ? "Nice cooking!" : "Game over";
        overlayMessage.textContent = `${chef.name} scored ${score} points.`;
        message.textContent = won ? "You made it through the rush!" : "Try again for a better score.";
    }

    function animateItems(timestamp) {
        if (!gameRunning) {
            return;
        }

        const deltaSeconds = lastFrameTime ? (timestamp - lastFrameTime) / 1000 : 0;
        lastFrameTime = timestamp;
        const catchY = field.clientHeight - 82;

        fallingItems.querySelectorAll(".falling-item").forEach((item) => {
            const nextY = Number(item.dataset.y) + Number(item.dataset.speed) * deltaSeconds;
            item.dataset.y = String(nextY);
            item.style.top = `${nextY}px`;

            if (nextY >= catchY) {
                if (Number(item.dataset.lane) === catcherLane) {
                    if (item.classList.contains("burnt-item")) {
                        lives -= 1;
                        message.textContent = "Flames! You lost a life.";
                    } else {
                        const points = 10 + chef.bonusPoints;
                        score += points;
                        message.textContent = `Ingredient caught! +${points} points.`;
                    }
                    renderStats();
                }
                item.remove();
            }
        });

        if (lives <= 0) {
            finishGame(false);
            return;
        }
        animationFrame = window.requestAnimationFrame(animateItems);
    }

    function startGame() {
        window.clearInterval(spawnInterval);
        window.clearInterval(timerInterval);
        window.cancelAnimationFrame(animationFrame);
        score = 0;
        lives = 3 + chef.extraLives;
        timeLeft = 45;
        catcherLane = 1;
        lastFrameTime = 0;
        gameRunning = true;
        fallingItems.replaceChildren();
        overlay.hidden = true;
        message.textContent = "Catch ingredients and avoid the flames.";
        renderStats();
        spawnInterval = window.setInterval(spawnItem, 650);
        timerInterval = window.setInterval(() => {
            timeLeft -= 1;
            renderStats();
            if (timeLeft <= 0) {
                finishGame(true);
            }
        }, 1000);
        animationFrame = window.requestAnimationFrame(animateItems);
    }

    document.getElementById("move-left").addEventListener("click", () => moveCatcher(-1));
    document.getElementById("move-right").addEventListener("click", () => moveCatcher(1));
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
            event.preventDefault();
            moveCatcher(-1);
        } else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
            event.preventDefault();
            moveCatcher(1);
        }
    });
    startButton.addEventListener("click", startGame);
    renderStats();
}

if (document.getElementById("kitchen-counter")) {
const startingTime = 45;
        const flipsToServe = 5;
        const emergenciesToHandle = Math.floor(Math.random() * 4) + 2;
        const chefProfiles = {
            flay: {
                name: "Chef Flay",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVH8a_Uz2s7xId3zqU33HIBmcqCiyGfgMZo7UcVrKQg&s=10",
                perk: "Emergency wins +5 sec",
                emergencyTimeBonus: 5,
                flipPoints: 5
            },
            ramsay: {
                name: "Chef Ramsay",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPrNnYMtn3WemNjcvsGZRa0M9_XdiC6Y5RVTvJCIN8A&s=10",
                perk: "Each flip earns +8 pts",
                emergencyTimeBonus: 0,
                flipPoints: 8
            }
        };
        //used ai to get the chef you choose in the url and display their profile and perks in the game
        const chefKey = new URLSearchParams(window.location.search).get("chef");
        const chef = chefProfiles[chefKey] ?? chefProfiles.flay;
        const gameTitle = document.getElementById("game-title");
        const orderTitle = document.getElementById("order-title");
        const chefAvatar = document.getElementById("chef-avatar");
        const chefName = document.getElementById("chef-name");
        const chefPerk = document.getElementById("chef-perk");
        const emergencies = [
            {
                action: "flip",
                title: "Soufflé is sinking!",
                instruction: "Flip Item to save the soufflé."
            },
            {
                action: "heat",
                title: "Oven overheating!",
                instruction: "Adjust Heat before the soufflé burns."
            },
            {
                action: "fan",
                title: "Smoke in the kitchen!",
                instruction: "Use Emergency Fan to clear the smoke."
            }
        ];
        const kitchenStations = [];
        const stationNames = ["Oven", "Prep counter", "Plating station"];

        const counter = document.getElementById("kitchen-counter");
        const timerDisplay = document.getElementById("timer");
        const kitchenStatus = document.getElementById("kitchen-status");
        const scoreDisplay = document.getElementById("score");
        const burnWarning = document.getElementById("burn-warning");
        const gameMessage = document.getElementById("game-message");
        const stationList = document.getElementById("station-list");
        const orderStatus = document.getElementById("order-status");
        const flipProgress = document.getElementById("flip-progress");
        const emergencyProgress = document.getElementById("emergency-progress");
        const comboDisplay = document.getElementById("combo-display");
        const emergencyPanel = document.getElementById("emergency-panel");
        const emergencyTitle = document.getElementById("emergency-title");
        const emergencyInstruction = document.getElementById("emergency-instruction");
        const emergencyTimer = document.getElementById("emergency-timer");
        const flipButton = document.getElementById("flip-btn");
        const heatButton = document.getElementById("heat-btn");
        const fanButton = document.getElementById("fan-btn");
        const restartButton = document.getElementById("restart-btn");

        let timeLeft = startingTime;
        let score = 0;
        let flips = 0;
        let emergenciesHandled = 0;
        let emergencyCombo = 0;
        let lastEmergencyAction = null;
        let gameInterval;
        let gameActive = true;
        let pendingEmergency = null;
        let emergencyTimeLeft = 0;
        let nextEmergencyIn = randomEmergencyDelay();

        gameTitle.textContent = "Dinner Rush";
        orderTitle.textContent = `Order #42: ${chef.name}'s Fluffy Soufflé`;
        chefAvatar.src = chef.image;
        chefAvatar.alt = chef.name;
        chefName.textContent = chef.name;
        chefPerk.textContent = chef.perk;

        for (let index = 0; index < stationNames.length; index++) {
            const health = Math.floor(Math.random() * 41) + 60;
            kitchenStations.push({
                name: stationNames[index],
                health,
                ready: health >= 70
            });
        }

        function renderStations() {
            stationList.replaceChildren();

            for (let index = 0; index < kitchenStations.length; index++) {
                const station = kitchenStations[index];
                const stationCard = document.createElement("div");
                const stationName = document.createElement("span");
                const stationStatus = document.createElement("span");

                stationCard.className = "station";
                stationName.className = "station-name";
                stationName.textContent = station.name;
                stationStatus.className = `station-status ${station.ready ? "station-ready" : "station-attention"}`;
                stationStatus.textContent = `${station.ready ? "READY" : "CHECK"} · ${station.health}%`;
                stationCard.append(stationName, stationStatus);
                stationList.appendChild(stationCard);
            }
        }

        function updateKitchenState() {
            counter.classList.remove("normal-temp", "warning-temp", "danger-temp");

            if (pendingEmergency) {
                counter.classList.add("danger-temp");
                kitchenStatus.textContent = "Emergency! Choose the matching action!";
                burnWarning.setAttribute("aria-hidden", "false");
            } else if (timeLeft > 10) {
                counter.classList.add("normal-temp");
                kitchenStatus.textContent = "Kitchen is running smoothly.";
                burnWarning.setAttribute("aria-hidden", "true");
            } else if (timeLeft >= 5) {
                counter.classList.add("warning-temp");
                kitchenStatus.textContent = "Careful, Chef! Check the oven!";
                burnWarning.setAttribute("aria-hidden", "false");
            } else {
                counter.classList.add("danger-temp");
                kitchenStatus.textContent = "DANGER! The soufflé is about to burn!";
                burnWarning.setAttribute("aria-hidden", "false");
            }

            timerDisplay.textContent = String(timeLeft).padStart(2, "0");
            scoreDisplay.textContent = String(score);
            flipProgress.textContent = `${flips}/${flipsToServe}`;
            emergencyProgress.textContent = `${emergenciesHandled}/${emergenciesToHandle}`;
            comboDisplay.textContent = `Combo x${emergencyCombo}`;
            emergencyTimer.textContent = String(emergencyTimeLeft);
            emergencyTimer.parentElement.classList.toggle("urgent", emergencyTimeLeft <= 2);
            flipButton.classList.toggle("action-hint", pendingEmergency?.action === "flip");
            heatButton.classList.toggle("action-hint", pendingEmergency?.action === "heat");
            fanButton.classList.toggle("action-hint", pendingEmergency?.action === "fan");
        }

        function randomEmergencyDelay() {
            return Math.floor(Math.random() * 4) + 3;
        }

        function startEmergency() {
            const availableEmergencies = emergencies.filter((emergency) =>
                emergency.action !== lastEmergencyAction
            );
            pendingEmergency = availableEmergencies[Math.floor(Math.random() * availableEmergencies.length)];
            lastEmergencyAction = pendingEmergency.action;
            emergencyTimeLeft = Math.floor(Math.random() * 3) + 4;
            emergencyTitle.textContent = pendingEmergency.title;
            emergencyInstruction.textContent = pendingEmergency.instruction;
            emergencyPanel.hidden = false;
            gameMessage.textContent = "Act now! Pick the action that matches the emergency.";
            updateKitchenState();
        }

        function clearEmergency() {
            pendingEmergency = null;
            emergencyTimeLeft = 0;
            emergencyPanel.hidden = true;
            nextEmergencyIn = randomEmergencyDelay();
        }

        function takeAction(action) {
            if (!gameActive) {
                return;
            }

            if (pendingEmergency) {
                if (pendingEmergency.action !== action) {
                    timeLeft = Math.max(0, timeLeft - 2);
                    emergencyCombo = 0;
                    gameMessage.textContent = "Wrong station! You lost 2 seconds—try the matching action!";
                    updateKitchenState();

                    if (timeLeft <= 0) {
                        finishGame(false);
                    }
                    return;
                }

                emergencyCombo += 1;
                const pointsEarned = 10 + Math.min(emergencyCombo - 1, 4) * 5;
                score += pointsEarned;
                emergenciesHandled += 1;
                timeLeft = Math.min(startingTime, timeLeft + chef.emergencyTimeBonus);
                clearEmergency();
                gameMessage.textContent =
                    `Emergency handled! ${emergenciesHandled}/${emergenciesToHandle}. +${pointsEarned} points, combo x${emergencyCombo}! ${chef.emergencyTimeBonus ? `+${chef.emergencyTimeBonus} sec from ${chef.name}.` : ""}`;
                updateKitchenState();
                if (flips >= flipsToServe && emergenciesHandled >= emergenciesToHandle) {
                    finishGame(true);
                }
                return;
            }

            if (action === "flip") {
                flips += 1;
                score += chef.flipPoints;
                emergencyCombo = 0;
                gameMessage.textContent =
                    `Good flip! ${flips}/${flipsToServe} flips. Handle ${Math.max(0, emergenciesToHandle - emergenciesHandled)} more alerts. +${chef.flipPoints} points.`;
                updateKitchenState();

                if (flips >= flipsToServe && emergenciesHandled >= emergenciesToHandle) {
                    finishGame(true);
                }
                return;
            }

            timeLeft = Math.min(startingTime, timeLeft + (action === "heat" ? 2 : 3));
            gameMessage.textContent =
                action === "heat" ? "Heat balanced. +2 seconds." : "A gust cleared the oven. +3 seconds.";
            updateKitchenState();
        }

        function finishGame(won) {
            gameActive = false;
            window.clearInterval(gameInterval);
            flipButton.disabled = true;
            heatButton.disabled = true;
            fanButton.disabled = true;
            restartButton.hidden = false;

            if (won) {
                counter.classList.remove("normal-temp", "warning-temp", "danger-temp");
                counter.classList.add("normal-temp");
                kitchenStatus.textContent = "Perfect bake! Order complete.";
                gameMessage.textContent = `${chef.name} served the order! Final score: ${score} points.`;
                orderStatus.textContent = "STATUS: SERVED!";
                clearEmergency();
                return;
            }

            timeLeft = 0;
            timerDisplay.textContent = "00";
            counter.classList.remove("normal-temp", "warning-temp");
            counter.classList.add("danger-temp");
            kitchenStatus.textContent = "The soufflé burned. Service failed.";
            burnWarning.setAttribute("aria-hidden", "false");
            gameMessage.textContent = `${chef.name}'s soufflé burned! Final score: ${score} points.`;
            orderStatus.textContent = "STATUS: BURNT!";
            clearEmergency();
        }

        function tick() {
            if (!gameActive) {
                return;
            }

            timeLeft -= 1;

            if (pendingEmergency) {
                emergencyTimeLeft -= 1;

                if (emergencyTimeLeft <= 0) {
                    timeLeft = Math.max(0, timeLeft - 5);
                    emergencyCombo = 0;
                    clearEmergency();
                    gameMessage.textContent = "Emergency missed! The kitchen lost 5 seconds.";
                }
            } else {
                nextEmergencyIn -= 1;

                if (nextEmergencyIn <= 0) {
                    startEmergency();
                }
            }

            updateKitchenState();

            if (timeLeft <= 0) {
                finishGame(false);
            }
        }

        flipButton.addEventListener("click", () => {
            takeAction("flip");
        });

        heatButton.addEventListener("click", () => {
            takeAction("heat");
        });

        fanButton.addEventListener("click", () => {
            takeAction("fan");
        });

        restartButton.addEventListener("click", () => {
            window.location.reload();
        });

        renderStations();
        updateKitchenState();
        gameInterval = window.setInterval(tick, 1000);
}
