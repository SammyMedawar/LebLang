// Category Page JavaScript
class CategoryPage {
    constructor() {
        this.categoryId = null;
        this.category = null;
        this.lessons = [];
        this.scores = {};
        this.init();
    }

    async init() {
        this.categoryId = this.getCategoryIdFromURL();
        if (!this.categoryId) {
            this.showModal('Error', 'Invalid category. Redirecting to homepage.');
            setTimeout(() => goHome(), 2000);
            return;
        }

        await this.loadData();
        this.renderCategoryHeader();
        this.renderLessons();
        this.renderCategoryProgress();
        this.setupEventListeners();
        this.updateUserStats();
    }

    getCategoryIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id'));
    }

    async loadData() {
        try {
            // Load categories
            const categoriesResponse = await fetch('./backend/categories.json');
            const categories = await categoriesResponse.json();
            this.category = categories.find(cat => cat.id === this.categoryId);

            if (!this.category) {
                throw new Error('Category not found');
            }

            // Load lessons
            const lessonsResponse = await fetch('./backend/lessons.json');
            const allLessons = await lessonsResponse.json();
            this.lessons = allLessons.filter(lesson => lesson.categoryId === this.categoryId);

            // Load scores
            const scoresResponse = await fetch('./backend/scores.json');
            this.scores = await scoresResponse.json();

            // Load from localStorage if available
            this.loadLocalScores();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showModal('Error', 'Failed to load category data. Please try again.');
        }
    }

    renderCategoryHeader() {
        if (!this.category) return;

        // Update page title
        document.title = `${this.category.name} - LebLang`;

        // Update header elements
        const categoryTitle = document.getElementById('categoryTitle');
        const categoryDescription = document.getElementById('categoryDescription');
        const categoryIcon = document.getElementById('categoryIcon');
        const categoryName = document.getElementById('categoryName');
        const categoryDescriptionFull = document.getElementById('categoryDescriptionFull');

        if (categoryTitle) categoryTitle.textContent = this.category.name;
        if (categoryDescription) categoryDescription.textContent = this.category.description;
        if (categoryIcon) categoryIcon.textContent = this.category.icon;
        if (categoryName) {
            categoryName.innerHTML = `
                ${this.category.name}
                <p class="arabic-text">${this.category.nameArabic}</p>
            `;
        }
        if (categoryDescriptionFull) {
            categoryDescriptionFull.innerHTML = `
                ${this.category.description}
                <p class="arabic-text">${this.category.descriptionArabic}</p>
            `;
        }
    }

    renderLessons() {
        const lessonsGrid = document.getElementById('lessonsGrid');
        if (!lessonsGrid) return;

        lessonsGrid.innerHTML = '';

        this.lessons.forEach((lesson, index) => {
            const lessonCard = this.createLessonCard(lesson, index);
            lessonsGrid.appendChild(lessonCard);
        });
    }

    createLessonCard(lesson, index) {
        const card = document.createElement('div');
        card.className = 'lesson-card fade-in';
        
        const isCompleted = this.scores.lessonsCompleted.includes(lesson.id);
        const isAvailable = index === 0 || this.scores.lessonsCompleted.includes(this.lessons[index - 1].id);
        const lessonScore = this.scores.lessonScores[lesson.id] || 0;

        let statusClass = 'locked';
        let statusText = 'Locked';
        let statusIcon = '🔒';

        if (isCompleted) {
            statusClass = 'completed';
            statusText = 'Completed';
            statusIcon = '✅';
        } else if (isAvailable) {
            statusClass = 'available';
            statusText = 'Available';
            statusIcon = '▶️';
        }

        card.innerHTML = `
            <span class="lesson-icon">${statusIcon}</span>
            <h4>${lesson.title}</h4>
            <p class="arabic-title arabic-text">${lesson.titleArabic}</p>
            <p>${lesson.description}</p>
            <div class="lesson-progress-indicator">
                <span class="lesson-status ${statusClass}">${statusText}</span>
                ${isCompleted ? `<span class="lesson-score">Score: ${lessonScore}</span>` : ''}
            </div>
        `;

        if (isAvailable) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                this.navigateToLesson(lesson.id);
            });
        } else {
            card.style.opacity = '0.6';
            card.style.cursor = 'not-allowed';
            card.addEventListener('click', () => {
                this.showModal('Lesson Locked', 'Complete the previous lesson to unlock this one.');
            });
        }

        return card;
    }

    renderCategoryProgress() {
        const categoryProgressFill = document.getElementById('categoryProgressFill');
        const categoryProgressText = document.getElementById('categoryProgressText');

        if (!categoryProgressFill || !categoryProgressText) return;

        const progress = this.scores.categoryProgress[this.categoryId] || { completed: 0, total: this.lessons.length, score: 0 };
        const progressPercentage = (progress.completed / progress.total) * 100;

        categoryProgressFill.style.width = `${progressPercentage}%`;
        categoryProgressText.textContent = `${progress.completed} of ${progress.total} lessons completed`;
    }

    updateUserStats() {
        const totalScoreElement = document.getElementById('totalScore');
        const streakDaysElement = document.getElementById('streakDays');

        if (totalScoreElement) totalScoreElement.textContent = this.scores.totalScore;
        if (streakDaysElement) streakDaysElement.textContent = this.scores.streakDays;
    }

    navigateToLesson(lessonId) {
        window.location.href = `lesson.html?id=${lessonId}&category=${this.categoryId}`;
    }

    setupEventListeners() {
        // Modal close functionality
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

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
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
}

// Navigation functions
function goHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

// Initialize the category page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CategoryPage();
}); 