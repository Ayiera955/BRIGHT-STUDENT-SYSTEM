# BrightStudent 🐾

A responsive web dashboard for students to manage their units, organize notes, upload lecture materials, and track their study progress with advanced semester management and authentication.

## Features

✨ **Secure Authentication** - Sign up with email and password, login with credentials
✨ **Session Persistence** - Stay logged in after page refresh, automatic session restoration
✨ **Semester Management** - Support for 3 semesters per year with archiving capabilities
✨ **Custom Unit Management** - Create and manage up to 6 custom study units per semester
✨ **Progress Tracking** - Visual progress bars showing mastery percentage for each unit
✨ **Focus Indicator** - Highlights unit with most unresolved topics to guide study priorities
✨ **Organized Notes System** - Create topics with custom labels and add notes/questions with status tracking
✨ **Lecture Materials** - Upload and manage lecture notes (PDF, Word, PowerPoint, etc.)
✨ **Recording Storage** - Upload and organize lecture recordings (audio/video)
✨ **Revision Checklist** - Track unresolved items across all units for exam preparation
✨ **Date Tracking** - Track when topics were created and materials were uploaded
✨ **Persistent Storage** - All data saved locally using browser localStorage
✨ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
✨ **Modern UI** - Beautiful gradient design with smooth animations and interactive elements

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BrightStudent.git
cd BrightStudent
```

2. Open `index.html` in your web browser

That's it! The application runs entirely in your browser.

## Usage

### Create Account
1. Click "Sign Up" on the login page
2. Enter your full name, email, and create a password
3. Optionally upload a profile picture
4. Click "Create Account"

### Login
1. Enter your email and password
2. Click "Login"
3. Your session will persist across page refreshes

### Configure Study Plan
1. Go to Settings (⚙️ button)
2. Select your year of study (1-4)
3. Select your current semester (1-3)
4. Click "Go to Dashboard"

### Create Units
1. Enter a unit name (e.g., "Mathematics", "Biology")
2. Click "+ Add New Unit"
3. The unit will appear in your dashboard with semester tag (Y1S1, Y2S2, etc.)

### Track Progress
- Each unit displays a progress bar showing % of mastered concepts
- Unit with most unresolved topics is highlighted with "🎯 FOCUS HERE" label
- Unresolved topic count shown on each unit card

### Manage Notes
1. Click on a unit to open it
2. Click "📝 My Notes"
3. Enter a topic label (e.g., "Chapter 1") and topic name (e.g., "Algebra Basics")
4. Click "+ Add Topic"
5. Add individual notes/questions under each topic
6. Mark topics as Unresolved, In Progress, or Mastered

### Upload Materials
1. Click "📄 Lecture Notes" to upload documents (PDF, Word, etc.)
2. Click "🎥 Recordings" to upload audio/video files
3. All uploads are timestamped for tracking
4. Mark materials with status (Unresolved, In Progress, Mastered)

### Manage Semesters
1. Go to Settings (⚙️ button)
2. View archived semesters
3. Click "Archive Current Semester" to move to next semester
4. Restore archived semesters if needed
5. Delete archived semesters with the × button

### Exam Revision
1. Click "📋 Exam Revision" on any unit
2. View all unresolved items across all units
3. Mark items as done to track completion

## File Structure

```
BrightStudent/
├── index.html          # Main HTML structure with all pages
├── styles.css          # Modern styling with gradients and animations
├── script_clean.js     # Core JavaScript functionality
├── script_auth.js      # Authentication and form handling
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and flexbox
- **JavaScript (Vanilla)** - No dependencies, pure JavaScript
- **LocalStorage API** - Client-side data persistence

## Features Breakdown

### Authentication System
- Secure signup with email and password validation
- Password confirmation during registration
- Login with email and password credentials
- Profile picture upload during signup
- Session persistence across page refreshes
- Automatic session restoration on login

### Semester Management
- Support for 3 semesters per year (Semester 1, 2, 3)
- Year selection (Year 1-4)
- Archive completed semesters with restore capability
- Delete archived semesters if needed
- Automatic year increment after Semester 3 archiving
- Units tagged with semester/year (Y1S1, Y2S2, etc.)

### Unit Management
- Create custom units with any name
- Support for up to 6 units per semester
- Units automatically assigned to current semester
- Filter units by current semester or view all active
- Visual progress tracking with percentage bars
- Highlight unit with most unresolved topics

### Progress Tracking
- Calculate mastery percentage based on (mastered concepts / total concepts)
- Visual progress bar for each unit (green gradient)
- Display unresolved topic count
- Focus indicator for unit needing most attention
- Real-time progress updates as topics are marked

### Notes Organization
- Create topics with custom labels and names
- Add multiple notes/questions per topic
- Track creation dates for all topics
- Status tracking: Unresolved, In Progress, Mastered
- Delete individual notes or entire topics
- Revision checklist showing all unresolved items

### Material Management
- Upload lecture notes (PDF, DOC, DOCX, TXT, PPT, PPTX)
- Upload recordings (audio and video formats)
- Automatic date/time stamping
- Status tracking for materials
- Separate view for personal and shared notes
- Easy file deletion

### Data Persistence
- All data stored in browser's localStorage
- Automatic saving on every action
- Data persists between sessions
- Session restoration on page refresh
- Clear all data on logout

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Recent Updates

### Version 2.0
- Added secure authentication with password protection
- Implemented semester management with 3 semesters per year
- Added progress tracking with visual progress bars
- Implemented focus indicator for units needing attention
- Added session persistence and automatic login
- Enhanced UI consistency across all pages
- Added semester filtering and archiving capabilities
- Improved data organization by semester and year

## Future Enhancements

- Cloud storage integration
- Export notes as PDF
- Study reminders and notifications
- Collaborative features with other students
- Dark mode toggle
- Search functionality across notes and materials
- Study time tracking and analytics
- Backup and restore functionality

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions, please open an issue on GitHub.

## Author

Created with ❤️ for students

---

**Note:** This application stores all data locally in your browser. Clearing browser data will delete all stored information. For important data, consider exporting or backing up regularly.
