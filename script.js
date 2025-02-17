 document.addEventListener('DOMContentLoaded', function() {
    const chapterContent = document.getElementById('chapter-content');
    const responses = document.querySelectorAll('.response');
    const lossResponses = document.querySelectorAll('.loss');
    const choiceContainers = document.querySelectorAll('.choice-container');
    const submitButtons = document.querySelectorAll('.submit-button');
    const backButton = document.querySelector('.back-button');
    const restartButton = document.querySelector('.restart-button'); // Получаем кнопку "Переиграть главу"
    let history = [];

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
        localStorage.removeItem('chapterContent'); // Удаляем сохраненный контент
        localStorage.removeItem('history'); // Удаляем историю
        history = []; // Сбрасываем историю
        location.reload(); // Перезагружаем страницу
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

        // Добавляем обработчик для кнопки "Переиграть главу"
        if (restartButton) {
            restartButton.addEventListener('click', restartChapter);
        }
    }

    attachEventListeners();
    loadProgress();
});
 function handleSubmit(button) {
        const next = button.dataset.next;
        const questionContainer = button.closest('.response');
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
          const choiceContainer = button.closest('.choice-container');
           if (choiceContainer) {
           choiceContainer.classList.add('hidden');
        }
        showResponse(next);
    }