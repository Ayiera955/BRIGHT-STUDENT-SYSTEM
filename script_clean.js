// ===== INITIALIZATION =====
let customUnits = [];
let nextUnitId = 1;
let currentStudent = null;
let selectedUnits = [];
let currentUnit = null;
let allStudents = {};

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    currentStudent = JSON.parse(currentUser);
    document.getElementById('userName').textContent = currentStudent.name;
    document.getElementById('userName2').textContent = currentStudent.name;
    showPage('myUnitsPage');
    displayMyUnits();
  } else {
    showPage('loginPage');
  }
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

// ===== STORAGE =====
function saveToStorage() {
  if (currentStudent) {
    localStorage.setItem('currentUser', JSON.stringify(currentStudent));
  }
}

function loadFromStorage() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    currentStudent = JSON.parse(user);
  }
}

// ===== PAGE MANAGEMENT =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  localStorage.setItem('lastPage', pageId);
}

// ===== LOGIN & SIGNUP =====
function toggleSignup() {
  document.getElementById('loginForm').style.display = document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
  document.getElementById('signupForm').style.display = document.getElementById('signupForm').style.display === 'none' ? 'block' : 'none';
}

function previewSignupProfilePic() {
  const fileInput = document.getElementById('profilePicInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('signupProfilePic').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!allStudents[email]) {
    alert('Account not found. Please sign up first.');
    return;
  }
  if (allStudents[email].password !== password) {
    alert('Incorrect password.');
    return;
  }
  currentStudent = allStudents[email];
  customUnits = currentStudent.units || [];
  nextUnitId = currentStudent.nextUnitId || 1;
  selectedUnits = customUnits.map(u => u.id);
  document.getElementById('userName').textContent = currentStudent.name;
  document.getElementById('userName2').textContent = currentStudent.name;
  document.getElementById('dashboardProfilePic').src = currentStudent.profilePic;
  document.getElementById('myUnitsProfilePic').src = currentStudent.profilePic;
  localStorage.setItem('lastEmail', email);
  saveToStorage();
  if (selectedUnits.length === 0) {
    showPage('dashboardPage');
    displayUnits();
  } else {
    showPage('myUnitsPage');
    displayMyUnits();
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const profilePic = document.getElementById('signupProfilePic').src;
  if (password !== passwordConfirm) {
    alert('Passwords do not match.');
    return;
  }
  if (allStudents[email]) {
    alert('Account already exists with this email.');
    return;
  }
  allStudents[email] = { name, email, password, units: [], nextUnitId: 1, profilePic, year: '1', semester: '1', archivedSemesters: [] };
  currentStudent = allStudents[email];
  customUnits = [];
  nextUnitId = 1;
  selectedUnits = [];
  document.getElementById('userName').textContent = name;
  document.getElementById('userName2').textContent = name;
  document.getElementById('dashboardProfilePic').src = profilePic;
  document.getElementById('myUnitsProfilePic').src = profilePic;
  localStorage.setItem('lastEmail', email);
  saveToStorage();
  document.getElementById('signupForm').reset();
  showPage('dashboardPage');
  displayUnits();
}

// ===== UNIT MANAGEMENT =====
function displayUnits() {
  const grid = document.getElementById('unitsGrid');
  grid.innerHTML = customUnits.map(unit => `
    <div class="unit-card ${selectedUnits.includes(unit.id) ? 'selected' : ''}" onclick="toggleUnit(${unit.id})">
      <h3>${unit.name}</h3>
    </div>
  `).join('');
}

async function addCustomUnit() {
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
  
  try {
    const response = await fetch('api/add_unit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentStudent.id,
        name: name,
        year: currentStudent.year || 1,
        semester: currentStudent.semester || 1
      })
    });
    
    const result = await response.json();
    if (result.success) {
      inputField.value = '';
      displayMyUnits();
      alert('Unit added successfully!');
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to add unit: ' + error.message);
  }
}

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

function confirmUnits() {
  if (selectedUnits.length === 0) {
    alert('Please select at least one unit!');
    return;
  }
  saveToStorage();
  showPage('myUnitsPage');
  displayMyUnits();
}

async function displayMyUnits() {
  const grid = document.getElementById('myUnitsGrid');
  if (!currentStudent) return;
  
  try {
    const response = await fetch(`api/get_units.php?user_id=${currentStudent.id}&year=${currentStudent.year || 1}&semester=${currentStudent.semester || 1}`);
    const result = await response.json();
    
    if (result.success) {
      const units = result.units;
      document.getElementById('currentSemesterDisplay').textContent = `Y${currentStudent.year}S${currentStudent.semester}`;
      
      if (units.length === 0) {
        grid.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">No units yet. Create your first unit above!</p>';
        return;
      }
      
      grid.innerHTML = units.map(unit => `
        <div class="unit-card" onclick="openUnit(${unit.id})">
          <h3>${unit.name}</h3>
          <p style="font-size: 0.85rem; color: #999;">Y${unit.year}S${unit.semester}</p>
          <div style="margin: 12px 0; background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #6bcf7f, #4caf50); height: 100%; width: ${unit.progress_percentage}%; transition: width 0.3s ease;"></div>
          </div>
          <p style="font-size: 0.8rem; color: #666; margin: 6px 0; font-weight: 600;">${unit.progress_percentage}% Mastered</p>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading units:', error);
  }
}



function openUnit(unitId) {
  currentUnit = { id: unitId };
  localStorage.setItem('lastUnitId', unitId);
  showPage('unitPage');
  displayTopics(unitId);
}

// ===== NOTES MANAGEMENT =====
function openNotesView() {
  document.getElementById('notesViewTitle').textContent = `📝 My Notes - ${currentUnit.name}`;
  displayTopics(currentUnit.id);
  showPage('notesViewPage');
}

async function addTopic() {
  const label = document.getElementById('topicLabel').value.trim();
  const name = document.getElementById('topicName').value.trim();
  if (!label || !name) {
    alert('Please enter both label and topic name!');
    return;
  }
  
  try {
    const response = await fetch('api/add_topic.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unit_id: currentUnit.id,
        label: label,
        name: name
      })
    });
    
    const result = await response.json();
    if (result.success) {
      document.getElementById('topicLabel').value = '';
      document.getElementById('topicName').value = '';
      displayTopics(currentUnit.id);
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to add topic: ' + error.message);
  }
}

async function displayTopics(unitId) {
  const container = document.getElementById('topicsContainer');
  
  try {
    const response = await fetch(`api/get_topics.php?unit_id=${unitId}`);
    const result = await response.json();
    
    if (result.success) {
      const topics = result.topics;
      if (topics.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No topics added yet. Create your first topic above!</p>';
        return;
      }
      
      const statusColors = { Unresolved: '#ff6b6b', 'In Progress': '#ffd93d', Mastered: '#6bcf7f' };
      container.innerHTML = topics.map(topic => `
        <div class="topic-card">
          <div class="topic-header">
            <div>
              <span class="topic-label">${topic.label}</span>
              <h4 class="topic-name">${topic.name}</h4>
              <p class="topic-date">📅 Created: ${new Date(topic.created_at).toLocaleString()}</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <select onchange="updateTopicStatus(${topic.id}, this.value)" style="padding: 8px 12px; border: 2px solid ${statusColors[topic.status]}; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; color: ${statusColors[topic.status]};">
                <option value="Unresolved" ${topic.status === 'Unresolved' ? 'selected' : ''}>🔴 Unresolved</option>
                <option value="In Progress" ${topic.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
                <option value="Mastered" ${topic.status === 'Mastered' ? 'selected' : ''}>🟢 Mastered</option>
              </select>
              <button class="delete-btn" onclick="deleteTopic(${topic.id})">×</button>
            </div>
          </div>
          <div class="notes-list" id="notes_${topic.id}"></div>
          <div class="add-note-form">
            <input type="text" id="note_${topic.id}" placeholder="Add a note or question...">
            <button onclick="addNote(${topic.id})">Add</button>
          </div>
        </div>
      `).join('');
      
      topics.forEach(topic => displayNotes(topic.id));
    }
  } catch (error) {
    console.error('Error loading topics:', error);
  }
}

async function displayNotes(topicId) {
  const container = document.getElementById(`notes_${topicId}`);
  
  try {
    const response = await fetch(`api/get_notes.php?topic_id=${topicId}`);
    const result = await response.json();
    
    if (result.success) {
      const notes = result.notes;
      container.innerHTML = notes.map((note, idx) => `
        <div class="note-item">
          <span>${note.content}</span>
          <button onclick="deleteNote(${note.id})">×</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading notes:', error);
  }
}

async function updateTopicStatus(topicId, newStatus) {
  // Topic status update would be implemented here
  console.log('Update topic status:', topicId, newStatus);
}

async function addNote(topicId) {
  const input = document.getElementById(`note_${topicId}`);
  const noteText = input.value.trim();
  if (!noteText) {
    alert('Please enter a note!');
    return;
  }
  
  try {
    const response = await fetch('api/add_note.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic_id: topicId,
        content: noteText,
        status: 'Unresolved'
      })
    });
    
    const result = await response.json();
    if (result.success) {
      input.value = '';
      displayNotes(topicId);
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to add note: ' + error.message);
  }
}

async function deleteNote(noteId) {
  if (!confirm('Delete this note?')) return;
  
  try {
    const response = await fetch('api/delete_note.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note_id: noteId })
    });
    
    const result = await response.json();
    if (result.success) {
      displayTopics(currentUnit.id);
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to delete note: ' + error.message);
  }
}

async function deleteTopic(topicId) {
  if (!confirm('Delete this topic and all its notes?')) return;
  
  try {
    const response = await fetch('api/delete_topic.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId })
    });
    
    const result = await response.json();
    if (result.success) {
      displayTopics(currentUnit.id);
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to delete topic: ' + error.message);
  }
}

// ===== LECTURE NOTES =====
function openLectureNotesView() {
  document.getElementById('lectureNotesViewTitle').textContent = `📄 Lecture Notes - ${currentUnit.name}`;
  displayLectureNotes(currentUnit.id);
  showPage('lectureNotesViewPage');
}

function uploadLectureNotes() {
  const fileInput = document.getElementById('lectureNotesUpload');
  const files = fileInput.files;
  if (files.length === 0) {
    alert('Please select files to upload!');
    return;
  }
  const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${currentUnit.id}`) || '[]');
  let uploadCount = 0;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      savedNotes.push({ name: file.name, date: new Date().toLocaleString(), uploadedBy: currentStudent.name, data: e.target.result, type: file.type, status: 'unresolved' });
      uploadCount++;
      if (uploadCount === files.length) {
        localStorage.setItem(`lectureNotes_${currentUnit.id}`, JSON.stringify(savedNotes));
        displayLectureNotes(currentUnit.id);
        fileInput.value = '';
        alert('Lecture notes uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  }
}

function displayLectureNotes(unitId) {
  const notesList = document.getElementById('lectureNotesList');
  const sharedList = document.getElementById('sharedLectureNotesList');
  const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
  if (savedNotes.length === 0) {
    notesList.innerHTML = '<p style="color: #666;">No lecture notes uploaded yet.</p>';
    sharedList.innerHTML = '<p style="color: #666;">No shared notes available.</p>';
    return;
  }
  const statusColors = { unresolved: '#ff6b6b', 'in-progress': '#ffd93d', mastered: '#6bcf7f' };
  const myNotes = savedNotes.filter(f => f.uploadedBy === currentStudent.name);
  const sharedNotes = savedNotes.filter(f => f.uploadedBy !== currentStudent.name);
  notesList.innerHTML = myNotes.length === 0 ? '<p style="color: #666;">You haven\'t uploaded any notes yet.</p>' : myNotes.map((file, index) => {
    const fileIndex = savedNotes.indexOf(file);
    const status = file.status || 'unresolved';
    return `
      <div class="file-item">
        <div><span>📄 ${file.name}</span><p class="file-date">📅 ${file.date}</p></div>
        <div class="file-actions">
          <select onchange="updateLectureNoteStatus(${unitId}, ${fileIndex}, this.value)" style="padding: 6px 10px; border: 2px solid ${statusColors[status]}; border-radius: 6px; background: white; cursor: pointer; font-weight: 600; color: ${statusColors[status]}; font-size: 0.85rem;">
            <option value="unresolved" ${status === 'unresolved' ? 'selected' : ''}>🔴 Unresolved</option>
            <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>🟡 In Progress</option>
            <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>🟢 Mastered</option>
          </select>
          <button class="file-preview-btn" onclick="previewFile('${unitId}', ${fileIndex})">Preview</button>
          <button onclick="deleteLectureNote(${unitId}, ${fileIndex})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  sharedList.innerHTML = sharedNotes.length === 0 ? '<p style="color: #666;">No shared notes from other students.</p>' : sharedNotes.map((file) => {
    const fileIndex = savedNotes.indexOf(file);
    const status = file.status || 'unresolved';
    return `
      <div class="file-item">
        <div><span>📄 ${file.name}</span><p class="file-date">📅 ${file.date} • Shared by: ${file.uploadedBy}</p></div>
        <div class="file-actions">
          <select onchange="updateLectureNoteStatus(${unitId}, ${fileIndex}, this.value)" style="padding: 6px 10px; border: 2px solid ${statusColors[status]}; border-radius: 6px; background: white; cursor: pointer; font-weight: 600; color: ${statusColors[status]}; font-size: 0.85rem;">
            <option value="unresolved" ${status === 'unresolved' ? 'selected' : ''}>🔴 Unresolved</option>
            <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>🟡 In Progress</option>
            <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>🟢 Mastered</option>
          </select>
          <button class="file-preview-btn" onclick="previewFile('${unitId}', ${fileIndex})">Preview</button>
        </div>
      </div>
    `;
  }).join('');
}

function updateLectureNoteStatus(unitId, fileIndex, newStatus) {
  const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
  if (savedNotes[fileIndex]) {
    savedNotes[fileIndex].status = newStatus;
    localStorage.setItem(`lectureNotes_${unitId}`, JSON.stringify(savedNotes));
    displayLectureNotes(unitId);
  }
}

function deleteLectureNote(unitId, index) {
  const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
  const myNotes = savedNotes.filter(f => f.uploadedBy === currentStudent.name);
  const myNoteIndex = savedNotes.indexOf(myNotes[index]);
  savedNotes.splice(myNoteIndex, 1);
  localStorage.setItem(`lectureNotes_${unitId}`, JSON.stringify(savedNotes));
  displayLectureNotes(unitId);
}

// ===== RECORDINGS =====
function openRecordingsView() {
  document.getElementById('recordingsViewTitle').textContent = `🎥 Recordings - ${currentUnit.name}`;
  displayFiles(currentUnit.id);
  showPage('recordingsViewPage');
}

function uploadFiles() {
  const fileInput = document.getElementById('fileUpload');
  const files = fileInput.files;
  if (files.length === 0) {
    alert('Please select files to upload!');
    return;
  }
  const savedFiles = JSON.parse(localStorage.getItem(`files_${currentStudent.email}_${currentUnit.id}`) || '[]');
  let uploadCount = 0;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      savedFiles.push({ name: file.name, date: new Date().toLocaleString(), data: e.target.result, type: file.type });
      uploadCount++;
      if (uploadCount === files.length) {
        localStorage.setItem(`files_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(savedFiles));
        displayFiles(currentUnit.id);
        fileInput.value = '';
        alert('Files uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  }
}

function displayFiles(unitId) {
  const filesList = document.getElementById('filesList');
  const savedFiles = JSON.parse(localStorage.getItem(`files_${currentStudent.email}_${unitId}`) || '[]');
  if (savedFiles.length === 0) {
    filesList.innerHTML = '<p style="color: #666;">No files uploaded yet.</p>';
    return;
  }
  filesList.innerHTML = savedFiles.map((file, index) => `
    <div class="file-item">
      <div><span>📁 ${file.name}</span><p class="file-date">📅 ${file.date}</p></div>
      <div class="file-actions">
        <button class="file-preview-btn" onclick="previewRecording('${unitId}', ${index})">Play/View</button>
        <button onclick="deleteFile(${unitId}, ${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function deleteFile(unitId, index) {
  const savedFiles = JSON.parse(localStorage.getItem(`files_${currentStudent.email}_${unitId}`) || '[]');
  savedFiles.splice(index, 1);
  localStorage.setItem(`files_${currentStudent.email}_${unitId}`, JSON.stringify(savedFiles));
  displayFiles(unitId);
}

// ===== PREVIEW =====
function previewFile(unitId, fileIndex) {
  const savedNotes = JSON.parse(localStorage.getItem(`lectureNotes_${unitId}`) || '[]');
  const file = savedNotes[fileIndex];
  if (!file) {
    alert('File not found');
    return;
  }
  const container = document.getElementById('previewContainer');
  const modal = document.getElementById('previewModal');
  if (file.type.startsWith('audio/')) {
    container.innerHTML = `<audio controls style="width: 100%; max-width: 600px; margin: 20px auto; display: block;"><source src="${file.data}" type="${file.type}">Your browser does not support audio playback.</audio>`;
  } else if (file.type.startsWith('video/')) {
    container.innerHTML = `<video controls style="width: 100%; max-width: 800px; margin: 20px auto; display: block;"><source src="${file.data}" type="${file.type}">Your browser does not support video playback.</video>`;
  } else if (file.type === 'application/pdf') {
    container.innerHTML = `<iframe src="${file.data}" style="width: 100%; height: 600px; border: none; border-radius: 10px;"></iframe>`;
  } else if (file.type.startsWith('image/')) {
    container.innerHTML = `<img src="${file.data}" style="max-width: 100%; max-height: 600px; border-radius: 10px; margin: 20px auto; display: block;">`;
  } else {
    container.innerHTML = `<p style="color: #666; text-align: center; padding: 40px;">Preview not available.</p>`;
  }
  modal.classList.add('active');
}

function previewRecording(unitId, fileIndex) {
  const savedFiles = JSON.parse(localStorage.getItem(`files_${currentStudent.email}_${unitId}`) || '[]');
  const file = savedFiles[fileIndex];
  if (!file) {
    alert('File not found');
    return;
  }
  const container = document.getElementById('previewContainer');
  const modal = document.getElementById('previewModal');
  if (file.type.startsWith('audio/')) {
    container.innerHTML = `<audio controls style="width: 100%; max-width: 600px; margin: 20px auto; display: block;"><source src="${file.data}" type="${file.type}">Your browser does not support audio playback.</audio>`;
  } else if (file.type.startsWith('video/')) {
    container.innerHTML = `<video controls style="width: 100%; max-width: 800px; margin: 20px auto; display: block;"><source src="${file.data}" type="${file.type}">Your browser does not support video playback.</video>`;
  } else if (file.type.startsWith('image/')) {
    container.innerHTML = `<img src="${file.data}" style="max-width: 100%; max-height: 600px; border-radius: 10px; margin: 20px auto; display: block;">`;
  } else {
    container.innerHTML = `<p style="color: #666; text-align: center; padding: 40px;">Preview not available.</p>`;
  }
  modal.classList.add('active');
}

function closePreview() {
  const modal = document.getElementById('previewModal');
  modal.classList.remove('active');
}

window.onclick = function(event) {
  const modal = document.getElementById('previewModal');
  if (event.target === modal) {
    modal.classList.remove('active');
  }
};

// ===== NAVIGATION =====
function backToUnitPage() {
  updateCurrentPageUnits();
  showPage('unitPage');
}

function backToUnits() {
  showPage('myUnitsPage');
  displayMyUnits();
}

function updateCurrentPageUnits() {
  const currentPage = document.querySelector('.page.active');
  if (currentPage && currentPage.id === 'dashboardPage') {
    displayUnits();
  } else if (currentPage && currentPage.id === 'myUnitsPage') {
    displayMyUnits();
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    currentStudent = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastPage');
    localStorage.removeItem('lastUnitId');
    document.getElementById('loginForm').reset();
    showPage('loginPage');
  }
}

// ===== REVISION CHECKLIST =====
function openRevisionChecklist() {
  displayRevisionChecklist();
  showPage('revisionChecklistPage');
}

function displayRevisionChecklist() {
  const container = document.getElementById('revisionChecklistContainer');
  let allUnresolved = [];
  customUnits.forEach(unit => {
    const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${unit.id}`) || '[]');
    const unresolvedTopics = topics.filter(t => (t.status || 'unresolved') === 'unresolved');
    unresolvedTopics.forEach(topic => {
      allUnresolved.push({ type: 'topic', unit: unit.name, name: topic.name, label: topic.label, id: topic.id, unitId: unit.id });
    });
  });
  if (allUnresolved.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6bcf7f; font-size: 1.2rem; padding: 40px;">Great job! All items are resolved!</p>';
    return;
  }
  container.innerHTML = allUnresolved.map((item, idx) => `
    <div class="revision-item">
      <div class="revision-item-content">
        <span class="revision-item-type">${item.type === 'topic' ? '📝' : '📄'}</span>
        <div>
          <p class="revision-item-name">${item.name}</p>
          <p class="revision-item-unit">${item.unit}${item.label ? ' • ' + item.label : ''}</p>
        </div>
        <button class="revision-mark-btn" onclick="markAsResolved('${item.type}', ${item.unitId}, '${item.id}')">Mark Done</button>
      </div>
    </div>
  `).join('');
}

function markAsResolved(type, unitId, itemId) {
  if (type === 'topic') {
    const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${unitId}`) || '[]');
    const topic = topics.find(t => t.id == itemId);
    if (topic) {
      topic.status = 'mastered';
      localStorage.setItem(`topics_${currentStudent.email}_${unitId}`, JSON.stringify(topics));
    }
  }
  displayRevisionChecklist();
}

// ===== PROFILE PICTURE =====
function previewProfilePic() {
  const fileInput = document.getElementById('profilePicInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('loginProfilePic').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function changeDashboardProfilePic() {
  const fileInput = document.getElementById('dashboardProfilePicInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPic = e.target.result;
      document.getElementById('dashboardProfilePic').src = newPic;
      currentStudent.profilePic = newPic;
      saveToStorage();
      alert('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  }
}

function changeMyUnitsProfilePic() {
  const fileInput = document.getElementById('myUnitsProfilePicInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPic = e.target.result;
      document.getElementById('myUnitsProfilePic').src = newPic;
      document.getElementById('dashboardProfilePic').src = newPic;
      currentStudent.profilePic = newPic;
      saveToStorage();
      alert('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  }
}


// ===== PROFILE MANAGEMENT =====
function openProfileSettings() {
  document.getElementById('yearSelect').value = currentStudent.year || '1';
  document.getElementById('semesterSelect').value = currentStudent.semester || '1';
  displayArchivedSemesters();
  showPage('profileSettingsPage');
}

function updateProfile() {
  currentStudent.year = document.getElementById('yearSelect').value;
  currentStudent.semester = document.getElementById('semesterSelect').value;
  saveToStorage();
}

function goToDashboard() {
  showPage('myUnitsPage');
  displayMyUnits();
}

function backToMyUnits() {
  showPage('myUnitsPage');
  displayMyUnits();
}

function displayArchivedSemesters() {
  const container = document.getElementById('archivedSemesters');
  const archived = currentStudent.archivedSemesters || [];
  if (archived.length === 0) {
    container.innerHTML = '<p style="color: #999;">No archived semesters yet.</p>';
    return;
  }
  container.innerHTML = archived.map(sem => `
    <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; margin: 10px 0; display: flex; justify-content: space-between; align-items: center;">
      <p style="margin: 0; font-weight: 600;">Year ${sem.year}, Semester ${sem.semester}</p>
      <div style="display: flex; gap: 10px;">
        <button onclick="restoreSemester(${sem.year}, ${sem.semester})" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Restore</button>
        <button onclick="deleteArchivedSemester(${sem.year}, ${sem.semester})" style="padding: 8px 12px; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">×</button>
      </div>
    </div>
  `).join('');
}

function archiveSemester() {
  if (!confirm('Archive Year ' + currentStudent.year + ', Semester ' + currentStudent.semester + '? You can restore it later.')) return;
  if (!currentStudent.archivedSemesters) currentStudent.archivedSemesters = [];
  currentStudent.archivedSemesters.push({ year: currentStudent.year, semester: currentStudent.semester });
  currentStudent.semester = currentStudent.semester === '3' ? '1' : (parseInt(currentStudent.semester) + 1).toString();
  if (currentStudent.semester === '1') currentStudent.year = (parseInt(currentStudent.year) + 1).toString();
  saveToStorage();
  displayArchivedSemesters();
  alert('Semester archived! You can now work on the next semester.');
}

function deleteArchivedSemester(year, semester) {
  if (!confirm('Delete archived Year ' + year + ', Semester ' + semester + '?')) return;
  currentStudent.archivedSemesters = currentStudent.archivedSemesters.filter(s => !(s.year == year && s.semester == semester));
  saveToStorage();
  displayArchivedSemesters();
}
