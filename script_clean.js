// ===== INITIALIZATION =====
let customUnits = [];
let nextUnitId = 1;
let currentStudent = null;
let selectedUnits = [];
let currentUnit = null;
let allStudents = {};

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  const lastEmail = localStorage.getItem('lastEmail');
  const lastPage = localStorage.getItem('lastPage');
  if (lastEmail && allStudents[lastEmail]) {
    currentStudent = allStudents[lastEmail];
    customUnits = currentStudent.units || [];
    nextUnitId = currentStudent.nextUnitId || 1;
    selectedUnits = customUnits.map(u => u.id);
    document.getElementById('userName').textContent = currentStudent.name;
    document.getElementById('userName2').textContent = currentStudent.name;
    document.getElementById('dashboardProfilePic').src = currentStudent.profilePic;
    document.getElementById('myUnitsProfilePic').src = currentStudent.profilePic;
    showPage(lastPage || 'myUnitsPage');
    if (lastPage === 'myUnitsPage') displayMyUnits();
    else if (lastPage === 'unitPage') {
      const lastUnitId = localStorage.getItem('lastUnitId');
      if (lastUnitId) {
        currentUnit = customUnits.find(u => u.id == lastUnitId);
        if (currentUnit) document.getElementById('unitTitle').textContent = currentUnit.name;
      }
    }
  } else {
    showPage('loginPage');
  }
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

// ===== STORAGE =====
function saveToStorage() {
  if (currentStudent) {
    currentStudent.units = customUnits;
    currentStudent.nextUnitId = nextUnitId;
    allStudents[currentStudent.email] = currentStudent;
    localStorage.setItem('lastEmail', currentStudent.email);
  }
  localStorage.setItem('allStudents', JSON.stringify(allStudents));
}

function loadFromStorage() {
  const students = localStorage.getItem('allStudents');
  if (students) {
    allStudents = JSON.parse(students);
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
  const newUnit = { id: nextUnitId++, name, semester: currentStudent.semester, year: currentStudent.year };
  customUnits.push(newUnit);
  selectedUnits.push(newUnit.id);
  inputField.value = '';
  saveToStorage();
  if (currentPage.id === 'dashboardPage') {
    displayUnits();
  } else if (currentPage.id === 'myUnitsPage') {
    displayMyUnits();
  }
  currentUnit = newUnit;
  document.getElementById('unitTitle').textContent = currentUnit.name;
  showPage('unitPage');
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

function displayMyUnits() {
  const grid = document.getElementById('myUnitsGrid');
  const filterValue = document.getElementById('semesterFilter')?.value || 'current';
  let myUnits = customUnits.filter(u => selectedUnits.includes(u.id));
  if (filterValue === 'current') {
    myUnits = myUnits.filter(u => u.semester === currentStudent.semester && u.year === currentStudent.year);
  }
  document.getElementById('currentSemesterDisplay').textContent = `Y${currentStudent.year}S${currentStudent.semester}`;
  
  let maxUnresolved = 0;
  let maxUnitId = null;
  myUnits.forEach(unit => {
    const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${unit.id}`) || '[]');
    const unresolvedCount = topics.filter(t => (t.status || 'unresolved') === 'unresolved').length;
    if (unresolvedCount > maxUnresolved) {
      maxUnresolved = unresolvedCount;
      maxUnitId = unit.id;
    }
  });
  
  grid.innerHTML = myUnits.map(unit => {
    const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${unit.id}`) || '[]');
    const unresolvedCount = topics.filter(t => (t.status || 'unresolved') === 'unresolved').length;
    const masteredCount = topics.filter(t => t.status === 'mastered').length;
    const totalCount = topics.length;
    const progressPercent = totalCount === 0 ? 0 : Math.round((masteredCount / totalCount) * 100);
    const isHighest = maxUnresolved > 0 && unit.id === maxUnitId;
    return `
      <div class="unit-card" onclick="openUnit(${unit.id})" style="${isHighest ? 'border: 3px solid #ff6b6b; background: #fff5f5; box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);' : ''}">
        <h3>${unit.name}</h3>
        <p style="font-size: 0.85rem; color: #999;">Y${unit.year}S${unit.semester}</p>
        <div style="margin: 12px 0; background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #6bcf7f, #4caf50); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
        </div>
        <p style="font-size: 0.8rem; color: #666; margin: 6px 0; font-weight: 600;">${progressPercent}% Mastered</p>
        ${unresolvedCount > 0 ? `<p style="font-size: 0.8rem; color: #ff6b6b; font-weight: 600;">⚠️ ${unresolvedCount} unresolved</p>` : ''}
        ${isHighest ? `<p style="font-size: 0.75rem; color: #ff6b6b; font-weight: 700; margin-top: 4px;">🎯 FOCUS HERE</p>` : ''}
      </div>
    `;
  }).join('');
}



function openUnit(unitId) {
  currentUnit = customUnits.find(u => u.id === unitId);
  document.getElementById('unitTitle').textContent = currentUnit.name;
  localStorage.setItem('lastUnitId', unitId);
  showPage('unitPage');
}

// ===== NOTES MANAGEMENT =====
function openNotesView() {
  document.getElementById('notesViewTitle').textContent = `📝 My Notes - ${currentUnit.name}`;
  displayTopics(currentUnit.id);
  showPage('notesViewPage');
}

function addTopic() {
  const label = document.getElementById('topicLabel').value.trim();
  const name = document.getElementById('topicName').value.trim();
  if (!label || !name) {
    alert('Please enter both label and topic name!');
    return;
  }
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${currentUnit.id}`) || '[]');
  topics.push({ id: Date.now(), label, name, notes: [], createdDate: new Date().toLocaleString(), status: 'unresolved' });
  localStorage.setItem(`topics_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(topics));
  document.getElementById('topicLabel').value = '';
  document.getElementById('topicName').value = '';
  displayTopics(currentUnit.id);
}

function displayTopics(unitId) {
  const container = document.getElementById('topicsContainer');
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${unitId}`) || '[]');
  if (topics.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No topics added yet. Create your first topic above!</p>';
    return;
  }
  const statusColors = { unresolved: '#ff6b6b', 'in-progress': '#ffd93d', mastered: '#6bcf7f' };
  container.innerHTML = topics.map(topic => `
    <div class="topic-card">
      <div class="topic-header">
        <div>
          <span class="topic-label">${topic.label}</span>
          <h4 class="topic-name">${topic.name}</h4>
          <p class="topic-date">📅 Created: ${topic.createdDate || 'N/A'}</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <select onchange="updateTopicStatus(${topic.id}, this.value)" style="padding: 8px 12px; border: 2px solid ${statusColors[topic.status || 'unresolved']}; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; color: ${statusColors[topic.status || 'unresolved']};">
            <option value="unresolved" ${(topic.status || 'unresolved') === 'unresolved' ? 'selected' : ''}>🔴 Unresolved</option>
            <option value="in-progress" ${(topic.status || 'unresolved') === 'in-progress' ? 'selected' : ''}>🟡 In Progress</option>
            <option value="mastered" ${(topic.status || 'unresolved') === 'mastered' ? 'selected' : ''}>🟢 Mastered</option>
          </select>
          <button class="delete-btn" onclick="deleteTopic(${topic.id})">×</button>
        </div>
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

function updateTopicStatus(topicId, newStatus) {
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${currentUnit.id}`) || '[]');
  const topic = topics.find(t => t.id === topicId);
  if (topic) {
    topic.status = newStatus;
    localStorage.setItem(`topics_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(topics));
    displayTopics(currentUnit.id);
  }
}

function addNote(topicId) {
  const input = document.getElementById(`note_${topicId}`);
  const noteText = input.value.trim();
  if (!noteText) {
    alert('Please enter a note!');
    return;
  }
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${currentUnit.id}`) || '[]');
  const topic = topics.find(t => t.id === topicId);
  if (topic) {
    topic.notes.push(noteText);
    localStorage.setItem(`topics_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(topics));
    displayTopics(currentUnit.id);
  }
}

function deleteNote(topicId, noteIndex) {
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${currentUnit.id}`) || '[]');
  const topic = topics.find(t => t.id === topicId);
  if (topic) {
    topic.notes.splice(noteIndex, 1);
    localStorage.setItem(`topics_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(topics));
    displayTopics(currentUnit.id);
  }
}

function deleteTopic(topicId) {
  if (!confirm('Delete this topic and all its notes?')) return;
  const topics = JSON.parse(localStorage.getItem(`topics_${currentStudent.email}_${currentUnit.id}`) || '[]');
  const filtered = topics.filter(t => t.id !== topicId);
  localStorage.setItem(`topics_${currentStudent.email}_${currentUnit.id}`, JSON.stringify(filtered));
  displayTopics(currentUnit.id);
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
    saveToStorage();
    currentStudent = null;
    customUnits = [];
    selectedUnits = [];
    currentUnit = null;
    localStorage.removeItem('lastEmail');
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
