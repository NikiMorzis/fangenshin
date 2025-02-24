document.addEventListener('DOMContentLoaded', function() {
    // === Объявление переменных ===
    const chapterContent = document.getElementById('chapter-content');
    const responses = document.querySelectorAll('.response');
    const choiceContainers = document.querySelectorAll('.choice-container');
    const backButton = document.querySelector('.back-button');
    const restartButton = document.querySelector('.restart-button');

    // Бой 1
    let playerHP = 100;
    const playerDamage = 10;
    let slimeHP = 25;
    const slimeDamage = 3;

    // Бой 2
    let playerHP2 = 100; // Изначальное HP для второго боя
    let playerDamage2 = 10; // Изначальный урон для второго боя
    let monsterHP = 50;
    const monsterDamage = 5;

    const battleContainer = document.getElementById("battle-container");
    const dialogueContainer = document.getElementById("dialogue-container");
    const battleLog = document.getElementById("battle-log");
    const playerHPElement = document.getElementById("player-hp");
    const slimeHPElement = document.getElementById("slime-hp");
    const actionsElement = document.getElementById("actions");
    const resultElement = document.getElementById("result");
    const resultTextElement = document.getElementById("result-text");
    const postBattleDialogue = document.getElementById("post-battle-dialogue");
    const attackButton = document.getElementById("attack-button");
    const startBattleButton = document.getElementById("start-battle");

    // Бой 2 элементы
    const battleContainer2 = document.getElementById("battle-container2"); // Добавлено
    const playerHPElement2 = document.getElementById("player-hp2"); // Добавлено
    const monsterHPElement = document.getElementById("monster-hp"); // Добавлено
    const startBattleButton2 = document.getElementById("start-battle2");

    let history = [];

    // === Функции боя ===
    function startBattle() {
        dialogueContainer.style.display = "none";
        battleContainer.style.display = "block";
    }

    function playerAttack() {
        slimeHP -= playerDamage;
        updateBattleLog(`Вы нанесли слайму ${playerDamage} урона!`);
        updateSlimeHP();
        if (slimeHP <= 0) {
            checkBattleResult();
        } else {
            slimeAttack();
        }
    }

    function slimeAttack() {
        playerHP -= slimeDamage;
        updateBattleLog(`Слайм нанес вам ${slimeDamage} урона!`);
        updatePlayerHP();
        checkBattleResult();
    }

    function updatePlayerHP() {
        playerHPElement.innerText = playerHP;
    }

    function updateSlimeHP() {
        slimeHPElement.innerText = slimeHP;
    }

     function updateMonsterHP() {
      monsterHPElement.innerText = monsterHP;
    }

    function updateBattleLog(message) {
        battleLog.innerHTML += `<p>${message}</p>`;
        battleLog.scrollTop = battleLog.scrollHeight;
    }

    function checkBattleResult() {
        if (playerHP <= 0) {
            playerHP = 0;
            updatePlayerHP();
            showResult("Вы проиграли! Слайм оказался сильнее.");
        } else if (slimeHP <= 0) {
            slimeHP = 0;
            updateSlimeHP();
            // После победы над слаймом
            playerLevelUp(); // Функция повышения уровня
            showResult("Вы победили слайма! Паймон вами гордится!");
        }
    }

    function showResult(message) {
        document.getElementById("result-text").innerText = message;
        document.getElementById("result").style.display = "block";
        document.getElementById("actions").style.display = "none";
    }

    function continueDialogue() {
        battleContainer.style.display = "none";
        resultElement.style.display = "none";
        battleContainer2.style.display = "none";
        postBattleDialogue.style.display = "block";
    }

    // === Новые функции для боя 2 ===
    function startBattle2() {
        dialogueContainer.style.display = "none";
        battleContainer2.style.display = "block";
    }

    function playerAttack2() {
        monsterHP -= playerDamage2;
        updateBattleLog(`Вы нанесли монстру ${playerDamage2} урона!`);
        updateMonsterHP();
        if (monsterHP <= 0) {
            checkBattleResult2();
        } else {
            monsterAttack();
        }
    }

    function monsterAttack() {
        playerHP2 -= monsterDamage;
        updateBattleLog(`Монстр нанес вам ${monsterDamage} урона!`);
        updatePlayerHP2();
        checkBattleResult2();
    }

    function updatePlayerHP2() {
        playerHPElement2.innerText = playerHP2;
    }

    function checkBattleResult2() {
        if (playerHP2 <= 0) {
            playerHP2 = 0;
            updatePlayerHP2();
            showResult("Вы проиграли! Монстры оказались сильнее.");
        } else if (monsterHP <= 0) {
            monsterHP = 0;
            updateMonsterHP();
            showResult("Вы победили монстров! Девочка спасена!");
        }
    }

    // === Функция повышения уровня ===
    function playerLevelUp() {
        playerHP = 300; // Увеличение HP
        playerDamage2 += 15; // Увеличение урона для второго боя
        playerHP2 = playerHP; //Устанавливаем в максимум
        updatePlayerHP();
        updatePlayerHP2();
        updateSlimeHP();
        updateMonsterHP();
    }

    // === Функции для сохранения и загрузки ===
    function saveProgress() {
        if (chapterContent) {
            localStorage.setItem('chapterContent', chapterContent.innerHTML);
        }
        localStorage.setItem('history', JSON.stringify(history));
        console.log('Прогресс сохранен!');
    }

    function loadProgress() {
        const savedContent = localStorage.getItem('chapterContent');
        const savedHistory = localStorage.getItem('history');

        if (savedContent && savedHistory && chapterContent) {
            chapterContent.innerHTML = savedContent;
            try {
                history = JSON.parse(savedHistory);
            } catch (e) {
                console.error("Ошибка при разборе истории из localStorage:", e);
                history = [];
                localStorage.removeItem('history');
            }

            responses.forEach(response => response.classList.add('hidden'));
            choiceContainers.forEach(container => container.classList.add('hidden'));

            if (history.length === 0 && backButton) {
                backButton.style.display = 'none';
            } else if (backButton) {
                backButton.style.display = 'block';
            }

            attachEventListeners();
            console.log('Прогресс загружен!');
        } else {
            console.log('Сохранения не найдены.');
            if (backButton) {
                backButton.style.display = 'none';
            }
        }
    }

    function showResponse(responseId) {
        responses.forEach(response => response.classList.add('hidden'));
        choiceContainers.forEach(container => container.classList.add('hidden'));

        const selectedResponse = document.getElementById(responseId);
        if (selectedResponse) {
            selectedResponse.classList.remove('hidden');
        }

        const currentQuestionContainer = document.activeElement ? document.activeElement.closest('.question-container') : null;
        const currentChoiceContainer = document.activeElement ? document.activeElement.closest('.choice-container') : null;
        if (currentQuestionContainer) {
            history.push(currentQuestionContainer.id);
            if (backButton) {
                backButton.style.display = 'block';
            }
        }
        if (currentChoiceContainer) {
            history.push(currentChoiceContainer.id);
            if (backButton) {
                backButton.style.display = 'block';
            }
        }

        saveProgress();
    }

    function goBack() {
        if (history.length > 0) {
            const lastChoiceId = history.pop();

            responses.forEach(response => response.classList.add('hidden'));
            choiceContainers.forEach(container => container.classList.add('hidden'));

            const lastChoiceContainer = document.getElementById(lastChoiceId);
            if (lastChoiceContainer) {
                lastChoiceContainer.classList.remove('hidden');
            }

            saveProgress();
        }

        if (history.length === 0 && backButton) {
            backButton.style.display = 'none';
        }
    }

    function handleButtonClick(button) {
        const next = button.dataset.next;
        showResponse(next);
    }

    function handleSubmit(button) {
        const next = button.dataset.next;
        const questionContainer = button.closest('.input');
        if (questionContainer) {
            const inputElement = questionContainer.querySelector('input[type="text"]');
            if (inputElement) {
                const inputValue = inputElement.value;
                const responseId = next;

                const playerNameDisplays = document.querySelectorAll(`#${responseId} [id*="NameDisplay"]`);
                const playerPlanDisplays = document.querySelectorAll(`#${responseId} [id*="PlanDisplay"]`);

                playerNameDisplays.forEach(display => {
                    display.textContent = inputValue;
                });
                playerPlanDisplays.forEach(display => {
                    display.textContent = inputValue;
                });
            }
        }
        showResponse(next);
    }

    function restartChapter() {
        localStorage.removeItem('chapterContent');
        localStorage.removeItem('history');
        history = [];
        location.reload();
    }

    function attachEventListeners() {
        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', function() {
                handleButtonClick(this);
            });
        });

        document.querySelectorAll('.submit-button').forEach(button => {
            button.addEventListener('click', function() {
                handleSubmit(this);
            });
        });

        if (backButton) {
            backButton.addEventListener('click', goBack);
        }

        // === Обработчики событий для боя ===
        if (startBattleButton) {
            startBattleButton.addEventListener("click", startBattle);
        }

        if (attackButton) {
            attackButton.addEventListener("click", playerAttack);
        }

        if (resultElement) {
            const continueButton = resultElement.querySelector('button'); // Находим кнопку внутри #result
            if (continueButton) {
                continueButton.addEventListener("click", continueDialogue);
            }
        }
        // === Обработчики событий для боя 2 ===
        if (startBattleButton2) {
            startBattleButton2.addEventListener("click", startBattle2);
        }
    }

    // === Инициализация ===
    updatePlayerHP();
    updatePlayerHP2();
    updateSlimeHP();
    updateMonsterHP();
    attachEventListeners();
    loadProgress();
});
