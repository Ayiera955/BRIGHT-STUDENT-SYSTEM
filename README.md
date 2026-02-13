# BrightStudent 🐾

A responsive web dashboard for students to manage their units, organize notes, upload lecture materials, and track their study progress.

## Features

✨ **Student Authentication** - Simple login with name and email
✨ **Custom Unit Management** - Create and manage up to 6 custom study units
✨ **Organized Notes System** - Create topics with custom labels and add notes/questions under each topic
✨ **Lecture Materials** - Upload and manage lecture notes (PDF, Word, PowerPoint, etc.)
✨ **Recording Storage** - Upload and organize lecture recordings (audio/video)
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

### Login
1. Enter your student name and email
2. Click "Login"

### Create Units
1. Enter a unit name (e.g., "Mathematics", "Biology")
2. Click "+ Add New Unit"
3. The unit will appear in the grid and you'll be taken to the unit page

### Manage Notes
1. Click "📝 My Notes" on the unit page
2. Enter a topic label (e.g., "Chapter 1") and topic name (e.g., "Algebra Basics")
3. Click "+ Add Topic"
4. Add individual notes/questions under each topic
5. Delete topics or notes as needed

### Upload Materials
1. Click "📄 Lecture Notes" to upload documents (PDF, Word, etc.)
2. Click "🎥 Recordings" to upload audio/video files
3. All uploads are timestamped for tracking

### Track Progress
- View creation dates for all topics
- See upload dates for all materials
- Monitor your study timeline

## File Structure

```
BrightStudent/
├── index.html          # Main HTML structure
├── styles.css          # Modern styling with gradients and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and flexbox
- **JavaScript (Vanilla)** - No dependencies, pure JavaScript
- **LocalStorage API** - Client-side data persistence

## Features Breakdown

### Authentication
- Simple login system with name and email
- Session persistence using localStorage

### Unit Management
- Create custom units with any name
- Support for up to 6 units per student
- Delete units and all associated data
- Quick navigation between units

### Notes Organization
- Create topics with custom labels and names
- Add multiple notes/questions per topic
- Track creation dates
- Delete individual notes or entire topics

### Material Management
- Upload lecture notes (PDF, DOC, DOCX, TXT, PPT, PPTX)
- Upload recordings (audio and video formats)
- Automatic date/time stamping
- Easy file deletion

### Data Persistence
- All data stored in browser's localStorage
- Automatic saving on every action
- Data persists between sessions
- Clear all data on logout

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Cloud storage integration
- Export notes as PDF
- Study reminders and notifications
- Collaborative features
- Dark mode toggle
- Search functionality

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
