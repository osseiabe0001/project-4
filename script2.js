
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
