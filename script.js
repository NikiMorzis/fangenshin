document.addEventListener('DOMContentLoaded', function() {
  // === Объявление переменных ===
  const chapterContent = document.getElementById('chapter-content');
  const responses = document.querySelectorAll('.response');
  const choiceContainers = document.querySelectorAll('.choice-container');
  const backButton = document.querySelector('.back-button');
  const restartButton = document.querySelector('.restart-button');

  // Бой
  let playerHP = 100;
  const playerDamage = 10;
  let slimeHP = 25;
  const slimeDamage = 3;

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
      showResult("Вы победили слайма! Паймон вами гордится!");
    }
  }

  function showResult(message) {
    resultTextElement.innerText = message;
    resultElement.style.display = "block";
    actionsElement.style.display = "none";
  }

  function continueDialogue() {
    battleContainer.style.display = "none";
    resultElement.style.display = "none";
    postBattleDialogue.style.display = "block";
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

    // === Обработчик для кнопки "Переиграть главу" ===
    if (restartButton) {
      restartButton.addEventListener('click', restartChapter);
    }
  }

  // === Инициализация ===
  updatePlayerHP();
  updateSlimeHP();
  attachEventListeners();
  loadProgress();
});
