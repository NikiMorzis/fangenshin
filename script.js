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
    let playerHP2 = 300; // Изначальное HP для второго боя после levelUp
    let playerDamage2 = 25; // Изначальный урон для второго боя после levelUp
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

    let history = [];

    // === Функции боя ===
    function startBattle() {
        console.log("startBattle() вызвана");
        dialogueContainer.style.display = "none";
        battleContainer.style.display = "block";
    }

    function playerAttack() {
        console.log("playerAttack() вызвана, slimeHP:", slimeHP);
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
        console.log("slimeAttack() вызвана, playerHP:", playerHP);
        playerHP -= slimeDamage;
        updateBattleLog(`Слайм нанес вам ${slimeDamage} урона!`);
        updatePlayerHP();
        checkBattleResult();
    }

    function updatePlayerHP() {
        console.log("updatePlayerHP() вызвана, playerHP:", playerHP);
        playerHPElement.innerText = playerHP;
    }

    function updateSlimeHP() {
        console.log("updateSlimeHP() вызвана, slimeHP:", slimeHP);
        slimeHPElement.innerText = slimeHP;
    }

    function updateMonsterHP() {
        console.log("updateMonsterHP() вызвана, monsterHP:", monsterHP);
        monsterHPElement.innerText = monsterHP;
    }

    function updateBattleLog(message) {
        battleLog.innerHTML += `<p>${message}</p>`;
        battleLog.scrollTop = battleLog.scrollHeight;
    }

    function checkBattleResult() {
        console.log("checkBattleResult() вызвана, playerHP:", playerHP, "slimeHP:", slimeHP);
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
        console.log("showResult() вызвана, message:", message);
        resultTextElement.innerText = message;
        resultElement.style.display = "block";
        actionsElement.style.display = "none";
    }

    function continueDialogue() {
        console.log("continueDialogue() вызвана");
        battleContainer.style.display = "none";
        resultElement.style.display = "none";
        battleContainer2.style.display = "none"; // Скрываем второй контейнер битвы
        postBattleDialogue.style.display = "block";
    }

    // === Новые функции для боя 2 ===
    function startBattle2() {
        console.log("startBattle2() вызвана");
        dialogueContainer.style.display = "none";
        battleContainer2.style.display = "block";
    }

    function playerAttack2() {
        console.log("playerAttack2() вызвана, monsterHP:", monsterHP);
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
        console.log("monsterAttack() вызвана, playerHP2:", playerHP2);
        playerHP2 -= monsterDamage;
        updateBattleLog(`Монстр нанес вам ${monsterDamage} урона!`);
        updatePlayerHP2();
        checkBattleResult2();
    }

    function updatePlayerHP2() {
        console.log("updatePlayerHP2() вызвана, playerHP2:", playerHP2);
        playerHPElement2.innerText = playerHP2;
    }

    function checkBattleResult2() {
        console.log("checkBattleResult2() вызвана, playerHP2:", playerHP2, "monsterHP:", monsterHP);
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
        console.log("playerLevelUp() вызвана");
        playerHP = 300; // Увеличение HP
        playerDamage2 = 25; // Увеличение урона для второго боя
        playerHP2 = playerHP; // Устанавливаем в максимум
        updatePlayerHP();
        updatePlayerHP2();
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

            //attachEventListeners(); // Удаляем вызов этой функции!
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

// === Обработчики событий (Event Delegation) ===
document.addEventListener('click', function(event) {
    console.log("Клик:", event.target); // Добавлено для отладки.  Показывает, куда был клик
    // Обработчики для кнопок боя
    if (event.target.matches('#start-battle')) {
        startBattle();
    } else if (event.target.matches('#attack-button')) {
        playerAttack();
    } else if (event.target.matches('#start-battle2')) {
        startBattle2();
    } else if (event.target.matches('#attack-button2')) {
        playerAttack2();
    } else if (event.target.matches('#result button')) {
        continueDialogue();
    }

    // Обработчик для кнопок выбора (choice-button)
    if (event.target.classList.contains('choice-button')) {
        console.log("Нажата кнопка выбора:", event.target.dataset.next); // Добавлено для отладки
        handleButtonClick(event.target); // Передаем нажатую кнопку в handleButtonClick
    }
});

function handleButtonClick(button) {
    const next = button.dataset.next;
    console.log("Переход к:", next); // Добавлено для отладки
    showResponse(next);
}

// Все привязки событий удалены из attachEventListeners
function attachEventListeners() {
      // === Обработчик события для кнопки "Назад" ===
      if (backButton) {
          backButton.addEventListener('click', goBack);
      }

      // === Обработчики событий для кнопок отправки формы ===
      document.querySelectorAll('.submit-button').forEach(button => {
          button.addEventListener('click', function() {
              handleSubmit(this);
          });
      });
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
                playerPlanDisplays.textContent = inputValue;
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


// === Инициализация ===
updatePlayerHP();
updatePlayerHP2();
updateSlimeHP();
updateMonsterHP();
attachEventListeners(); // Оставляем привязку только для backButton и submit-button
loadProgress();
});
