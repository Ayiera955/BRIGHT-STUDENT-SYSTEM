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
  container.innerHTML = '<h3>Archived Semesters:</h3>' + archived.map(sem => `
    <div style="padding: 10px; background: #f5f5f5; border-radius: 8px; margin: 10px 0;">
      <p>Year ${sem.year}, Semester ${sem.semester}</p>
      <button onclick="restoreSemester(${sem.year}, ${sem.semester})" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Restore</button>
    </div>
  `).join('');
}

function archiveSemester() {
  if (!confirm('Archive this semester? You can restore it later.')) return;
  if (!currentStudent.archivedSemesters) currentStudent.archivedSemesters = [];
  currentStudent.archivedSemesters.push({ year: currentStudent.year, semester: currentStudent.semester });
  currentStudent.semester = currentStudent.semester === '1' ? '2' : '1';
  saveToStorage();
  displayMyUnits();
  alert('Semester archived! Moving to next semester.');
}

function restoreSemester(year, semester) {
  currentStudent.year = year.toString();
  currentStudent.semester = semester.toString();
  currentStudent.archivedSemesters = currentStudent.archivedSemesters.filter(s => !(s.year == year && s.semester == semester));
  saveToStorage();
  displayArchivedSemesters();
  displayMyUnits();
}

// ===== UNIT MANAGEMENT WITH SEMESTER =====
function addCustomUnit() {
  const currentPage = document.querySelector('.page.active');
  let inputField, semesterField;
  if (currentPage.id === 'dashboardPage') {
    inputField = document.getElementById('customUnitName');
    semesterField = document.getElementById('unitSemesterSelect');
  } else if (currentPage.id === 'myUnitsPage') {
    inputField = document.getElementById('customUnitName2');
    semesterField = null;
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
  const semester = semesterField ? semesterField.value : currentStudent.semester;
  const newUnit = { id: nextUnitId++, name, semester, year: currentStudent.year };
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

function displayMyUnits() {
  const grid = document.getElementById('myUnitsGrid');
  const filterValue = document.getElementById('semesterFilter')?.value || 'current';
  let myUnits = customUnits.filter(u => selectedUnits.includes(u.id));
  if (filterValue === 'current') {
    myUnits = myUnits.filter(u => u.semester === currentStudent.semester && u.year === currentStudent.year);
  }
  grid.innerHTML = myUnits.map(unit => `
    <div class="unit-card" onclick="openUnit(${unit.id})">
      <h3>${unit.name}</h3>
      <p style="font-size: 0.85rem; color: #999;">Y${unit.year}S${unit.semester}</p>
      <button class="delete-unit-btn" onclick="deleteUnit(event, ${unit.id})">×</button>
    </div>
  `).join('');
}
