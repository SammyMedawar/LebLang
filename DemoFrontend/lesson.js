// Lesson Page JavaScript
class LessonPage {
    constructor() {
        this.lessonId = null;
        this.categoryId = null;
        this.lesson = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        this.userAnswers = [];
        this.scores = {};
        this.lessonScore = 0;
        this.correctAnswers = 0;
        this.isAnswerChecked = false;
        this.matchingPairs = [];
        this.selectedMatchingItems = [];
        this.init();
    }

    async init() {
        this.lessonId = this.getLessonIdFromURL();
        this.categoryId = this.getCategoryIdFromURL();
        
        if (!this.lessonId) {
            this.showModal('Error', 'Invalid lesson. Redirecting to homepage.');
            setTimeout(() => goHome(), 2000);
            return;
        }

        await this.loadData();
        this.renderLessonHeader();
        this.loadQuestion();
        this.setupEventListeners();
    }

    getLessonIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id'));
    }

    getCategoryIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('category'));
    }

    async loadData() {
        try {
            // Load lessons
            const lessonsResponse = await fetch('./backend/lessons.json');
            const allLessons = await lessonsResponse.json();
            this.lesson = allLessons.find(lesson => lesson.id === this.lessonId);

            if (!this.lesson) {
                throw new Error('Lesson not found');
            }

            // Load questions for this lesson
            const questionsResponse = await fetch('./backend/questions.json');
            const allQuestions = await questionsResponse.json();
            this.questions = allQuestions.filter(q => this.lesson.questions.includes(q.id));

            // Load scores
            const scoresResponse = await fetch('./backend/scores.json');
            this.scores = await scoresResponse.json();

            // Load from localStorage if available
            this.loadLocalScores();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showModal('Error', 'Failed to load lesson data. Please try again.');
        }
    }

    renderLessonHeader() {
        if (!this.lesson) return;

        // Update page title
        document.title = `${this.lesson.title} - LebLang`;

        // Update header elements
        const lessonTitle = document.getElementById('lessonTitle');
        const lessonDescription = document.getElementById('lessonDescription');

        if (lessonTitle) lessonTitle.textContent = this.lesson.title;
        if (lessonDescription) lessonDescription.textContent = this.lesson.description;

        this.updateProgress();
    }

    updateProgress() {
        const questionCounter = document.getElementById('questionCounter');
        const lessonProgressFill = document.getElementById('lessonProgressFill');

        if (questionCounter) {
            questionCounter.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
        }

        if (lessonProgressFill) {
            const progressPercentage = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            lessonProgressFill.style.width = `${progressPercentage}%`;
        }
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completLesson();
            return;
        }

        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.isAnswerChecked = false;
        this.selectedMatchingItems = [];
        this.matchingPairs = [];

        this.renderQuestion();
        this.updateProgress();
        this.resetButtons();
    }

    renderQuestion() {
        const questionText = document.getElementById('questionText');
        const questionTextArabic = document.getElementById('questionTextArabic');
        const questionContent = document.getElementById('questionContent');
        const answerArea = document.getElementById('answerArea');
        const feedbackArea = document.getElementById('feedbackArea');

        // Hide feedback area
        feedbackArea.style.display = 'none';

        // Set question text
        if (questionText) questionText.textContent = this.currentQuestion.question;
        if (questionTextArabic) questionTextArabic.textContent = this.currentQuestion.questionArabic || '';

        // Clear previous content
        questionContent.innerHTML = '';
        answerArea.innerHTML = '';

        // Render based on question type
        switch (this.currentQuestion.type) {
            case 'multiple_choice':
                this.renderMultipleChoice();
                break;
            case 'translation':
                this.renderTranslation();
                break;
            case 'fill_blank':
                this.renderFillBlank();
                break;
            case 'matching':
                this.renderMatching();
                break;
            default:
                console.error('Unknown question type:', this.currentQuestion.type);
        }
    }

    renderMultipleChoice() {
        const answerArea = document.getElementById('answerArea');
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'options-grid';

        this.currentQuestion.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.dataset.index = index;

            const optionText = document.createElement('span');
            optionText.textContent = option;

            const optionLatin = document.createElement('span');
            optionLatin.className = 'option-latin';
            
            if (this.currentQuestion.optionsLatin && this.currentQuestion.optionsLatin[index]) {
                optionLatin.textContent = `(${this.currentQuestion.optionsLatin[index]})`;
            } else if (this.currentQuestion.optionsArabic && this.currentQuestion.optionsArabic[index]) {
                optionLatin.textContent = `(${this.currentQuestion.optionsArabic[index]})`;
                optionLatin.className = 'option-latin arabic-text';
            }

            optionBtn.appendChild(optionText);
            if (optionLatin.textContent) {
                optionBtn.appendChild(optionLatin);
            }

            optionBtn.addEventListener('click', () => {
                this.selectMultipleChoiceOption(index);
            });

            optionsGrid.appendChild(optionBtn);
        });

        answerArea.appendChild(optionsGrid);
    }

    renderTranslation() {
        const answerArea = document.getElementById('answerArea');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.placeholder = 'Type your answer here...';
        input.id = 'translationInput';

        input.addEventListener('input', () => {
            this.enableCheckButton();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnswerChecked) {
                this.checkAnswer();
            }
        });

        answerArea.appendChild(input);
    }

    renderFillBlank() {
        const answerArea = document.getElementById('answerArea');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.placeholder = 'Fill in the blank...';
        input.id = 'fillBlankInput';

        input.addEventListener('input', () => {
            this.enableCheckButton();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnswerChecked) {
                this.checkAnswer();
            }
        });

        answerArea.appendChild(input);
    }

    renderMatching() {
        const answerArea = document.getElementById('answerArea');
        const matchingContainer = document.createElement('div');
        matchingContainer.className = 'matching-container';

        // Create left column (Arabic/Source)
        const leftColumn = document.createElement('div');
        leftColumn.className = 'matching-column';
        leftColumn.innerHTML = '<h4>Arabic</h4>';

        // Create right column (English/Target)
        const rightColumn = document.createElement('div');
        rightColumn.className = 'matching-column';
        rightColumn.innerHTML = '<h4>English</h4>';

        // Shuffle the pairs for display
        const shuffledPairs = [...this.currentQuestion.pairs];
        const shuffledEnglish = shuffledPairs.map(p => p.english).sort(() => Math.random() - 0.5);

        shuffledPairs.forEach((pair, index) => {
            const arabicItem = document.createElement('div');
            arabicItem.className = 'matching-item';
            arabicItem.dataset.pairId = index;
            arabicItem.dataset.side = 'arabic';
            arabicItem.innerHTML = `
                <div class="arabic-text">${pair.arabic}</div>
                <div class="option-latin">(${pair.latin})</div>
            `;

            arabicItem.addEventListener('click', () => {
                this.selectMatchingItem(arabicItem, 'arabic', index);
            });

            leftColumn.appendChild(arabicItem);
        });

        shuffledEnglish.forEach((english, index) => {
            const englishItem = document.createElement('div');
            englishItem.className = 'matching-item';
            englishItem.dataset.english = english;
            englishItem.dataset.side = 'english';
            englishItem.textContent = english;

            englishItem.addEventListener('click', () => {
                this.selectMatchingItem(englishItem, 'english', english);
            });

            rightColumn.appendChild(englishItem);
        });

        matchingContainer.appendChild(leftColumn);
        matchingContainer.appendChild(rightColumn);
        answerArea.appendChild(matchingContainer);
    }

    selectMultipleChoiceOption(index) {
        if (this.isAnswerChecked) return;

        // Remove previous selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select current option
        const selectedBtn = document.querySelector(`[data-index="${index}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }

        this.userAnswers[this.currentQuestionIndex] = index;
        this.enableCheckButton();
    }

    selectMatchingItem(element, side, value) {
        if (this.isAnswerChecked) return;

        // Toggle selection
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            this.selectedMatchingItems = this.selectedMatchingItems.filter(item => item.element !== element);
        } else {
            element.classList.add('selected');
            this.selectedMatchingItems.push({ element, side, value });
        }

        // Check if we have a pair selected
        if (this.selectedMatchingItems.length === 2) {
            const arabicItem = this.selectedMatchingItems.find(item => item.side === 'arabic');
            const englishItem = this.selectedMatchingItems.find(item => item.side === 'english');

            if (arabicItem && englishItem) {
                this.createMatchingPair(arabicItem, englishItem);
            }

            // Clear selection
            this.selectedMatchingItems.forEach(item => {
                item.element.classList.remove('selected');
            });
            this.selectedMatchingItems = [];
        }

        this.checkMatchingComplete();
    }

    createMatchingPair(arabicItem, englishItem) {
        const pairId = arabicItem.value;
        const englishText = englishItem.value;
        
        // Find the correct pair
        const correctPair = this.currentQuestion.pairs[pairId];
        const isCorrect = correctPair && correctPair.english === englishText;

        this.matchingPairs.push({
            arabicIndex: pairId,
            englishText: englishText,
            isCorrect: isCorrect
        });

        // Mark items as matched
        arabicItem.element.classList.add('matched');
        englishItem.element.classList.add('matched');
        arabicItem.element.style.pointerEvents = 'none';
        englishItem.element.style.pointerEvents = 'none';
    }

    checkMatchingComplete() {
        const totalPairs = this.currentQuestion.pairs.length;
        if (this.matchingPairs.length === totalPairs) {
            this.userAnswers[this.currentQuestionIndex] = this.matchingPairs;
            this.enableCheckButton();
        }
    }

    enableCheckButton() {
        const checkBtn = document.getElementById('checkAnswerBtn');
        if (checkBtn) {
            checkBtn.disabled = false;
        }
    }

    resetButtons() {
        const checkBtn = document.getElementById('checkAnswerBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const finishBtn = document.getElementById('finishLessonBtn');

        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.style.display = 'inline-block';
        }
        if (nextBtn) nextBtn.style.display = 'none';
        if (finishBtn) finishBtn.style.display = 'none';
    }

    checkAnswer() {
        if (this.isAnswerChecked) return;

        this.isAnswerChecked = true;
        let isCorrect = false;
        let userAnswer = this.userAnswers[this.currentQuestionIndex];

        switch (this.currentQuestion.type) {
            case 'multiple_choice':
                isCorrect = userAnswer === this.currentQuestion.correctAnswer;
                this.showMultipleChoiceFeedback(isCorrect);
                break;
            case 'translation':
                const input = document.getElementById('translationInput');
                userAnswer = input.value.trim().toLowerCase();
                isCorrect = this.checkTranslationAnswer(userAnswer);
                this.showTranslationFeedback(isCorrect, input);
                break;
            case 'fill_blank':
                const fillInput = document.getElementById('fillBlankInput');
                userAnswer = fillInput.value.trim().toLowerCase();
                isCorrect = this.checkFillBlankAnswer(userAnswer);
                this.showFillBlankFeedback(isCorrect, fillInput);
                break;
            case 'matching':
                isCorrect = this.checkMatchingAnswer();
                this.showMatchingFeedback(isCorrect);
                break;
        }

        if (isCorrect) {
            this.correctAnswers++;
            this.lessonScore += 20; // 20 points per correct answer
        }

        this.showFeedback(isCorrect);
        this.showNextButton();
    }

    checkTranslationAnswer(userAnswer) {
        const correctAnswer = this.currentQuestion.correctAnswer.toLowerCase();
        const correctAnswerLatin = this.currentQuestion.correctAnswerLatin?.toLowerCase();
        const acceptedAnswers = this.currentQuestion.acceptedAnswers?.map(a => a.toLowerCase()) || [];

        return userAnswer === correctAnswer || 
               userAnswer === correctAnswerLatin ||
               acceptedAnswers.includes(userAnswer);
    }

    checkFillBlankAnswer(userAnswer) {
        const correctAnswer = this.currentQuestion.correctAnswer.toLowerCase();
        const correctAnswerLatin = this.currentQuestion.correctAnswerLatin?.toLowerCase();

        return userAnswer === correctAnswer || userAnswer === correctAnswerLatin;
    }

    checkMatchingAnswer() {
        return this.matchingPairs.every(pair => pair.isCorrect);
    }

    showMultipleChoiceFeedback(isCorrect) {
        const options = document.querySelectorAll('.option-btn');
        options.forEach((option, index) => {
            if (index === this.currentQuestion.correctAnswer) {
                option.classList.add('correct');
            } else if (index === this.userAnswers[this.currentQuestionIndex] && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });
    }

    showTranslationFeedback(isCorrect, input) {
        input.classList.add(isCorrect ? 'correct' : 'incorrect');
        input.disabled = true;
    }

    showFillBlankFeedback(isCorrect, input) {
        input.classList.add(isCorrect ? 'correct' : 'incorrect');
        input.disabled = true;
    }

    showMatchingFeedback(isCorrect) {
        // Feedback is already shown through the matching process
        // Additional visual feedback could be added here
    }

    showFeedback(isCorrect) {
        const feedbackArea = document.getElementById('feedbackArea');
        const feedbackIcon = document.getElementById('feedbackIcon');
        const feedbackTitle = document.getElementById('feedbackTitle');
        const feedbackExplanation = document.getElementById('feedbackExplanation');
        const feedbackExplanationArabic = document.getElementById('feedbackExplanationArabic');

        feedbackArea.className = `feedback-area ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackIcon.textContent = isCorrect ? '✅' : '❌';
        feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
        feedbackExplanation.textContent = this.currentQuestion.explanation || '';
        feedbackExplanationArabic.textContent = this.currentQuestion.explanationArabic || '';

        feedbackArea.style.display = 'block';
        feedbackArea.classList.add('slide-up');
    }

    showNextButton() {
        const checkBtn = document.getElementById('checkAnswerBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const finishBtn = document.getElementById('finishLessonBtn');

        checkBtn.style.display = 'none';

        if (this.currentQuestionIndex < this.questions.length - 1) {
            nextBtn.style.display = 'inline-block';
        } else {
            finishBtn.style.display = 'inline-block';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    completLesson() {
        // Calculate final score and accuracy
        const accuracy = Math.round((this.correctAnswers / this.questions.length) * 100);
        
        // Update scores
        this.updateScores();

        // Show completion screen
        this.showCompletionScreen(accuracy);
    }

    updateScores() {
        // Update lesson scores
        this.scores.lessonScores[this.lessonId] = this.lessonScore;
        
        // Add to completed lessons if not already there
        if (!this.scores.lessonsCompleted.includes(this.lessonId)) {
            this.scores.lessonsCompleted.push(this.lessonId);
        }

        // Update total score
        this.scores.totalScore += this.lessonScore;

        // Update category progress
        if (this.categoryId && this.scores.categoryProgress[this.categoryId]) {
            const categoryProgress = this.scores.categoryProgress[this.categoryId];
            categoryProgress.completed = this.scores.lessonsCompleted.filter(id => {
                // Count lessons in this category
                return this.lesson.categoryId === this.categoryId;
            }).length;
            categoryProgress.score += this.lessonScore;
        }

        // Update streak (simplified - just increment for now)
        this.scores.streakDays += 1;
        this.scores.lastPlayedDate = new Date().toISOString();

        // Save to localStorage
        this.saveScores();
    }

    showCompletionScreen(accuracy) {
        const questionContainer = document.getElementById('questionContainer');
        const lessonComplete = document.getElementById('lessonComplete');
        const lessonScore = document.getElementById('lessonScore');
        const lessonAccuracy = document.getElementById('lessonAccuracy');

        questionContainer.style.display = 'none';
        lessonComplete.style.display = 'block';

        if (lessonScore) lessonScore.textContent = this.lessonScore;
        if (lessonAccuracy) lessonAccuracy.textContent = `${accuracy}%`;
    }

    setupEventListeners() {
        // Check Answer button
        const checkBtn = document.getElementById('checkAnswerBtn');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkAnswer());
        }

        // Next Question button
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // Finish Lesson button
        const finishBtn = document.getElementById('finishLessonBtn');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.completLesson());
        }

        // Modal functionality
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('customModal');
        const closeModal = document.querySelector('.close-modal');
        const modalOkBtn = document.getElementById('modalOkBtn');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (modalOkBtn) {
            modalOkBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showModal(title, message) {
        const modal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        if (modal && modalTitle && modalMessage) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modal.style.display = 'block';
        }
    }

    loadLocalScores() {
        try {
            const localScores = localStorage.getItem('lebLangScores');
            if (localScores) {
                this.scores = { ...this.scores, ...JSON.parse(localScores) };
            }
        } catch (error) {
            console.error('Error loading local scores:', error);
        }
    }

    saveScores() {
        try {
            localStorage.setItem('lebLangScores', JSON.stringify(this.scores));
        } catch (error) {
            console.error('Error saving scores:', error);
        }
    }
}

// Navigation functions
function goHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

function goToCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    if (categoryId) {
        window.location.href = `category.html?id=${categoryId}`;
    } else {
        goHome();
    }
}

function restartLesson() {
    window.location.reload();
}

// Initialize the lesson page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LessonPage();
}); 