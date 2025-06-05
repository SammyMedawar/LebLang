# LebLang - Lebanese Arabic Learning App 🇱🇧

A comprehensive Duolingo-style web application for learning Lebanese Arabic, featuring both Arabic script and Latin transliteration.

## Features

### 🎯 Core Learning Features
- **Multiple Question Types**: Multiple choice, translation, fill-in-the-blank, and matching exercises
- **Dual Script Support**: Learn with both Arabic script (العربية) and Latin transliteration
- **Progressive Learning**: Unlock lessons sequentially as you complete previous ones
- **Real-time Feedback**: Immediate feedback with explanations for each answer
- **Score Tracking**: Comprehensive scoring system with progress tracking

### 📚 Content Structure
- **4 Categories**: Basic Greetings, Family & People, Food & Drinks, Numbers
- **12 Lessons**: 3 lessons per category with 5 questions each
- **60+ Questions**: Diverse question types covering essential Lebanese Arabic vocabulary

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with smooth animations
- **Custom Modals**: No browser alerts - all notifications use custom modals
- **Progress Visualization**: Progress bars and completion indicators
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### 🏆 Gamification
- **Scoring System**: Earn points for correct answers
- **Streak Tracking**: Daily learning streak counter
- **Achievement System**: Track completed lessons and categories
- **Progress Stats**: Detailed statistics on learning progress

## File Structure

```
LebLang/
├── index.html              # Homepage with categories
├── category.html           # Category page showing lessons
├── lesson.html            # Lesson page with questions
├── styles.css             # Comprehensive styling
├── app.js                 # Homepage JavaScript
├── category.js            # Category page JavaScript
├── lesson.js              # Lesson page JavaScript
├── backend/               # JSON data files
│   ├── categories.json    # Category definitions
│   ├── lessons.json       # Lesson information
│   ├── questions.json     # Question database
│   └── scores.json        # Score tracking
└── README.md              # This file
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. For best experience, serve files through a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

### Usage
1. **Homepage**: Browse available categories and view your progress
2. **Category Page**: Select a category to see available lessons
3. **Lesson Page**: Complete questions one by one to progress through lessons
4. **Progress Tracking**: Your scores and progress are automatically saved

## Question Types

### 1. Multiple Choice
Choose the correct answer from 4 options, with both English and Arabic/Latin options displayed.

### 2. Translation
Type the translation of a word or phrase in either Arabic script or Latin transliteration.

### 3. Fill in the Blank
Complete sentences by filling in missing words.

### 4. Matching
Match Arabic words with their English translations by clicking pairs.

## Data Structure

### Categories
Each category contains:
- Name in English and Arabic
- Description in both languages
- Icon and color theme
- List of associated lessons

### Lessons
Each lesson includes:
- Title and description
- Category association
- List of question IDs

### Questions
Each question features:
- Question text in English and Arabic
- Question type (multiple_choice, translation, fill_blank, matching)
- Correct answers and accepted alternatives
- Explanations in both languages
- Support for both Arabic script and Latin transliteration

### Scoring
The app tracks:
- Individual lesson scores
- Total accumulated score
- Completed lessons
- Category progress
- Learning streaks

## Customization

### Adding New Content
1. **New Categories**: Add entries to `backend/categories.json`
2. **New Lessons**: Add entries to `backend/lessons.json`
3. **New Questions**: Add entries to `backend/questions.json`
4. **Question Types**: Extend the question rendering system in `lesson.js`

### Styling
- Modify `styles.css` for visual customization
- CSS custom properties are used for easy theme changes
- Responsive design breakpoints can be adjusted

### Functionality
- Add new question types by extending the `LessonPage` class
- Implement additional scoring mechanisms
- Add user authentication system
- Integrate with backend APIs

## Technical Features

### Modern JavaScript
- ES6+ classes and modules
- Async/await for data loading
- Local storage for progress persistence
- Event-driven architecture

### Responsive Design
- CSS Grid and Flexbox layouts
- Mobile-first approach
- Touch-friendly interface
- Optimized for various screen sizes

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

### Performance
- Efficient DOM manipulation
- Lazy loading of content
- Optimized animations
- Minimal external dependencies

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

### Planned Features
- **Audio Support**: Voice questions and pronunciation guides
- **Image Support**: Visual learning with pictures
- **User Accounts**: Personal profiles and cloud sync
- **Advanced Analytics**: Detailed learning analytics
- **Social Features**: Leaderboards and sharing
- **Offline Mode**: Progressive Web App capabilities

### Scalability
The architecture is designed to easily accommodate:
- Additional languages and dialects
- More question types
- Advanced scoring algorithms
- Multiplayer features
- AI-powered personalization

## Contributing
This is an educational project. Feel free to:
- Add more Lebanese Arabic content
- Improve the user interface
- Optimize performance
- Add new features
- Fix bugs

## License
This project is open source and available under the MIT License.

## Acknowledgments
- Lebanese Arabic content curated for authentic learning
- Modern web technologies for optimal user experience
- Inspired by successful language learning platforms

---

**أهلا وسهلا! Welcome to learning Lebanese Arabic!** 🇱🇧

Start your journey by selecting a category on the homepage and begin with your first lesson. Each correct answer brings you closer to mastering this beautiful dialect! 