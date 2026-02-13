// Available units
let customUnits = [];
let nextUnitId = 1;

let currentStudent = null;
let selectedUnits = [];
let currentUnit = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    if (currentStudent) {
        showPage('myUnitsPage');
        displayMyUnits();
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    
    currentStudent = { name, email };
    document.getElementById('userName').textContent = name;
    document.getElementById('userName2').textContent = name;
    
    saveToStorage();
    
    if (selectedUnits.length === 0) {
        showPage('dashboardPage');
        displayUnits();
    } else {
        showPage('myUnitsPage');
        displayMyUnits();
    }
});

// Display units for selection
function displayUnits() {
    const grid = document.getElementById('unitsGrid');
    grid.innerHTML = customUnits.map(unit => `
        <div class="unit-card ${selectedUnits.includes(unit.id) ? 'selected' : ''}" onclick="toggleUnit(${unit.id})">
            <h3>${unit.name}</h3>
        </div>
    `).join('');
}

// Add custom unit
function addCustomUnit() {
    const currentPage = document.querySelector('.page.active');
    let inputField;
    
    if (currentPage.id === 'dashboardPage') {
        inputField = document.getElementById('customUnitName');
    } else if (currentPage.id === 'myUnitsPage') {
        inputField = document.getElementById('customUnitName2');
    }
    
    const name = inputField.value.trim();
    
    if (!name) {
        alert('Please enter a unit name!');
        return;
    }
    
    if (selectedUnits.length >= 6) {
        alert('You can only have up to 6 units!');
        return;
    }
    
    const newUnit = { id: nextUnitId++, name };
    customUnits.push(newUnit);
    selectedUnits.push(newUnit.id);
    
    inputField.value = '';
    
    saveToStorage();
    
    // Update the display to show the new unit
    if (currentPage.id === 'dashboardPage') {
        displayUnits();
    } else if (currentPage.id === 'myUnitsPage') {
        displayMyUnits();
    }
    
    // Directly open the unit page
    currentUnit = newUnit;
    document.getElementById('unitTitle').textContent = currentUnit.name;
    showPage('unitPage');
}

// Toggle unit selection
function toggleUnit(unitId) {
    const index = selectedUnits.indexOf(unitId);
    
    if (index > -1) {
        selectedUnits.splice(index, 1);
    } else {
        if (selectedUnits.length < 6) {
            selectedUnits.push(unitId);
        } else {
            alert('You can only select up to 6 units!');
            return;
        }
    }
    
    displayUnits();
}

// Confirm unit selection
function confirmUnits() {
    if (selectedUnits.length === 0) {
        alert('Please select at least one unit!');
        return;
    }
    saveToStorage();
    showPage('myUnitsPage');
    displayMyUnits();
}

// Display selected units
function displayMyUnits() {
    const grid = document.getElementById('myUnitsGrid');
    const myUnits = customUnits.filter(u => selectedUnits.includes(u.id));
    
    grid.innerHTML = myUnits.map(unit => `
        <div class="unit-card" onclick="openUnit(${unit.id})">
            <h3>${unit.name}</h3>
            <button class="delete-unit-btn" onclick="deleteUnit(event, ${unit.id})">×</button>
        </div>
    `).join('');
}

// Delete unit
function deleteUnit(event, unitId) {
    event.stopPropagation();
    if (!confirm('Delete this unit and all its data?')) return;
    
    customUnits = customUnits.filter(u => u.id !== unitId);
    selectedUnits = selectedUnits.filter(id => id !== unitId);
    
    // Clear unit data
    localStorage.removeItem(`topics_${unitId}`);
    localStorage.removeItem(`lectureNotes_${unitId}`);
    localStorage.removeItem(`files_${unitId}`);
    
    saveToStorage();
    displayMyUnits();
}

// Open unit detail page
function openUnit(unitId) {
    currentUnit = customUnits.find(u => u.id === unitId);
    document.getElementById('unitTitle').textContent = currentUnit.name;
    showPage('unitPage');
}

// Open Notes View
function openNotesView() {
    document.getElementById('notesViewTitle').textContent = `📝 My Notes - ${currentUnit.name}`;
    displayTopics(currentUnit.id);
    showPage('notesViewPage');
}

// Open Lecture Notes View
function openLectureNotesView() {
    document.getElementById('lectureNotesViewTitle').textContent = `📄 Lecture Notes - ${currentUnit.name}`;
    displayLectureNotes(currentUnit.id);
    showPage('lectureNotesViewPage');
}

// Open Recordings View
function openRecordingsView() {
    document.getElementById('recordingsViewTitle').textContent = `🎥 Recordings - ${currentUnit.name}`;
    displayFiles(currentUnit.id);
    showPage('recordingsViewPage');
}

// Back to unit page
function backToUnitPage() {
    updateCurrentPageUnits();
    showPage('unitPage');
}

// Add topic
function addTopic() {
    const label = document.getElementById('topicLabel').value.trim();
    const name = document.getElementById('topicName').value.trim();
    
    if (!label || !name) {
        alert('Please enter both label and topic name!');
        return;
    }
    
    const topics = JSON.parse(localStorage.getItem(`topics_${currentUnit.id}`) || '[]');
    topics.push({ id: Date.now(), label, name, notes: [], createdDate: new Date().toLocaleString() });
    localStorage.setItem(`topics_${currentUnit.id}`, JSON.stringify(topics));
    
    document.getElementById('topicLabel').value = '';
    document.getElementById('topicName').value = '';
    displayTopics(currentUnit.id);
}

// Display topics
function displayTopics(unitId) {
    const container = document.getElementById('topicsContainer');
    const topics = JSON.parse(localStorage.getItem(`topics_${unitId}`) || '[]');
    
    if (topics.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No topics added yet. Create your first topic above!</p>';
        return;
    }
    
    container.innerHTML = topics.map(topic => `
        <div class="topic-card">
            <div class="topic-header">
                <div>
                    <span class="topic-label">${topic.label}</span>
                    <h4 class="topic-name">${topic.name}</h4>
                    <p class="topic-date">📅 Created: ${topic.createdDate || 'N/A'}</p>
                </div>
                <button class="delete-btn" onclick="deleteTopic(${topic.id})">×</button>
            </div>
            <div class="notes-list">
                ${topic.notes.map((note, idx) => `
                    <div class="note-item">
                        <span>${note}</span>
                        <button onclick="deleteNote(${topic.id}, ${idx})">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="add-note-form">
                <input type="text" id="note_${topic.id}" placeholder="Add a note or question...">
                <button onclick="addNote(${topic.id})">Add</button>
            </div>
        </div>
    `).join('');
}

// Add note to topic
function addNote(topicId) {
    const input = document.getElementById(`note_${topicId}`);
    const noteText = input.value.trim();
    
    if (!noteText) {
        alert('Please enter a note!');
        return;
    }
    
    const topics = JSON.parse(localStorage.getItem(`topics_${currentUnit.id}`) || '[]');
    const topic = topics.find(t => t.id === topicId);
    
    if (topic) {
        topic.notes.push(noteText);
        localStorage.setItem(`topics_${currentUnit.id}`, JSON.stringify(topics));
        displayTopics(currentUnit.id);
    }
}

// Delete note
function deleteNote(topicId, noteIndex) {
    const topics = JSON.parse(localStorage.getItem(`topics_${currentUnit.id}`) || '[]');
    const topic = topics.find(t => t.id === topicId);
    
    if (topic) {
        topic.notes.splice(noteIndex, 1);
        localStorage.setItem(`topics_${currentUnit.id}`, JSON.stringify(topics));
        displayTopics(currentUnit.id);
    }
}

// Delete topic
function deleteTopic(topicId) {
    if (!confirm('Delete this topic and all its notes?')) return;
    
    const topics = JSON.parse(localStorage.getItem(`topics_${currentUnit.id}`) || '[]');
    const filtered = topics.filter(t => t.id !== topicId);
    localStorage.setItem(`topics_${currentUnit.id}`, JSON.stringify(filtered));
    displayTopics(currentUnit.id);
}

// Upload lecture notes
function uploadLectureNotes() {
    const fileInput = document.getElementById('lectureNotesUpload');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Please select files to upload!');
        return;
    }
    
    const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${currentUnit.id}`) || '[]');
    
    for (let file of files) {
        savedNotes.push({ name: file.name, date: new Date().toLocaleString() });
    }
    
    localStorage.setItem(`lectureNotes_${currentUnit.id}`, JSON.stringify(savedNotes));
    displayLectureNotes(currentUnit.id);
    fileInput.value = '';
    alert('Lecture notes uploaded successfully!');
}

// Display lecture notes
function displayLectureNotes(unitId) {
    const notesList = document.getElementById('lectureNotesList');
    const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
    
    if (savedNotes.length === 0) {
        notesList.innerHTML = '<p style="color: #666;">No lecture notes uploaded yet.</p>';
        return;
    }
    
    notesList.innerHTML = savedNotes.map((file, index) => `
        <div class="file-item">
            <div>
                <span>📄 ${file.name}</span>
                <p class="file-date">📅 ${file.date}</p>
            </div>
            <button onclick="deleteLectureNote(${unitId}, ${index})">Delete</button>
        </div>
    `).join('');
}

// Delete lecture note
function deleteLectureNote(unitId, index) {
    const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
    savedNotes.splice(index, 1);
    localStorage.setItem(`lectureNotes_${unitId}`, JSON.stringify(savedNotes));
    displayLectureNotes(unitId);
}

// Upload files
function uploadFiles() {
    const fileInput = document.getElementById('fileUpload');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Please select files to upload!');
        return;
    }
    
    const savedFiles = JSON.parse(localStorage.getItem(`files_${currentUnit.id}`) || '[]');
    
    for (let file of files) {
        savedFiles.push({ name: file.name, date: new Date().toLocaleString() });
    }
    
    localStorage.setItem(`files_${currentUnit.id}`, JSON.stringify(savedFiles));
    displayFiles(currentUnit.id);
    fileInput.value = '';
    alert('Files uploaded successfully!');
}

// Display uploaded files
function displayFiles(unitId) {
    const filesList = document.getElementById('filesList');
    const savedFiles = JSON.parse(localStorage.getItem(`files_${unitId}`) || '[]');
    
    if (savedFiles.length === 0) {
        filesList.innerHTML = '<p style="color: #666;">No files uploaded yet.</p>';
        return;
    }
    
    filesList.innerHTML = savedFiles.map((file, index) => `
        <div class="file-item">
            <div>
                <span>📁 ${file.name}</span>
                <p class="file-date">📅 ${file.date}</p>
            </div>
            <button onclick="deleteFile(${unitId}, ${index})">Delete</button>
        </div>
    `).join('');
}

// Delete file
function deleteFile(unitId, index) {
    const savedFiles = JSON.parse(localStorage.getItem(`files_${unitId}`) || '[]');
    savedFiles.splice(index, 1);
    localStorage.setItem(`files_${unitId}`, JSON.stringify(savedFiles));
    displayFiles(unitId);
}

// Back to units
function backToUnits() {
    showPage('myUnitsPage');
    displayMyUnits();
}

// Update units display on current page
function updateCurrentPageUnits() {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'dashboardPage') {
        displayUnits();
    } else if (currentPage && currentPage.id === 'myUnitsPage') {
        displayMyUnits();
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentStudent = null;
        selectedUnits = [];
        currentUnit = null;
        localStorage.clear();
        document.getElementById('loginForm').reset();
        showPage('loginPage');
    }
}

// Show page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Storage functions
function saveToStorage() {
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
    localStorage.setItem('customUnits', JSON.stringify(customUnits));
    localStorage.setItem('nextUnitId', nextUnitId);
}

function loadFromStorage() {
    const student = localStorage.getItem('currentStudent');
    const units = localStorage.getItem('selectedUnits');
    const custom = localStorage.getItem('customUnits');
    const unitId = localStorage.getItem('nextUnitId');
    
    if (student) {
        currentStudent = JSON.parse(student);
        document.getElementById('userName').textContent = currentStudent.name;
        document.getElementById('userName2').textContent = currentStudent.name;
    }
    
    if (units) {
        selectedUnits = JSON.parse(units);
    }
    
    if (custom) {
        customUnits = JSON.parse(custom);
    }
    
    if (unitId) {
        nextUnitId = parseInt(unitId);
    }
}
