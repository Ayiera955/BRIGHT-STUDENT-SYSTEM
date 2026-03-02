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
