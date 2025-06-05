// Main App JavaScript for Homepage
class LebLangApp {
    constructor() {
        this.categories = [];
        this.scores = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderCategories();
        this.renderProgressStats();
        this.setupEventListeners();
        this.updateUserStats();
    }

    async loadData() {
        try {
            // Load categories
            const categoriesResponse = await fetch('./backend/categories.json');
            this.categories = await categoriesResponse.json();

            // Load scores
            const scoresResponse = await fetch('./backend/scores.json');
            this.scores = await scoresResponse.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showModal('Error', 'Failed to load app data. Please refresh the page.');
        }
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = '';

        this.categories.forEach(category => {
            const categoryCard = this.createCategoryCard(category);
            categoriesGrid.appendChild(categoryCard);
        });
    }

    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card fade-in';
        card.style.setProperty('--category-color', category.color);
        
        const progress = this.scores.categoryProgress[category.id] || { completed: 0, total: category.lessons.length, score: 0 };
        const progressPercentage = (progress.completed / progress.total) * 100;

        card.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <h4>${category.name}</h4>
            <p class="arabic-title arabic-text">${category.nameArabic}</p>
            <p>${category.description}</p>
            <p class="arabic-text">${category.descriptionArabic}</p>
            <div class="lesson-progress-indicator">
                <span class="progress-text">${progress.completed}/${progress.total} lessons</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.navigateToCategory(category.id);
        });

        return card;
    }

    renderProgressStats() {
        const progressStats = document.getElementById('progressStats');
        if (!progressStats) return;

        const totalLessons = this.categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
        const completedLessons = this.scores.lessonsCompleted.length;
        const totalScore = this.scores.totalScore;
        const streakDays = this.scores.streakDays;

        progressStats.innerHTML = `
            <div class="progress-stat">
                <h4>Lessons Completed</h4>
                <span class="stat-number">${completedLessons}</span>
                <span>of ${totalLessons}</span>
            </div>
            <div class="progress-stat">
                <h4>Total Score</h4>
                <span class="stat-number">${totalScore}</span>
                <span>points</span>
            </div>
            <div class="progress-stat">
                <h4>Streak</h4>
                <span class="stat-number">${streakDays}</span>
                <span>days</span>
            </div>
            <div class="progress-stat">
                <h4>Categories</h4>
                <span class="stat-number">${this.categories.length}</span>
                <span>available</span>
            </div>
        `;
    }

    updateUserStats() {
        const totalScoreElement = document.getElementById('totalScore');
        const streakDaysElement = document.getElementById('streakDays');

        if (totalScoreElement) totalScoreElement.textContent = this.scores.totalScore;
        if (streakDaysElement) streakDaysElement.textContent = this.scores.streakDays;
    }

    navigateToCategory(categoryId) {
        window.location.href = `category.html?id=${categoryId}`;
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

    // Utility function to save scores (for future use)
    async saveScores() {
        try {
            // In a real app, this would send data to a server
            // For now, we'll just store in localStorage as backup
            localStorage.setItem('lebLangScores', JSON.stringify(this.scores));
        } catch (error) {
            console.error('Error saving scores:', error);
        }
    }

    // Load scores from localStorage if available
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

// Utility functions for navigation
function goHome() {
    window.location.href = 'index.html';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LebLangApp();
});

// Export for use in other files
window.LebLangApp = LebLangApp; 