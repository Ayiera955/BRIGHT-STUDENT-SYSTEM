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

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert('Error: ' + (error.error || 'Login failed'));
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      currentStudent = result.user;
      currentStudent.year = result.user.year || 1;
      currentStudent.semester = result.user.semester || 1;
      localStorage.setItem('currentUser', JSON.stringify(currentStudent));
      document.getElementById('userName').textContent = result.user.name;
      document.getElementById('userName2').textContent = result.user.name;
      localStorage.setItem('lastEmail', email);
      showPage('myUnitsPage');
      displayMyUnits();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  
  if (password !== passwordConfirm) {
    alert('Passwords do not match.');
    return;
  }
  
  try {
    const response = await fetch('api/signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert('Error: ' + (error.error || 'Signup failed'));
      return;
    }
    
    const result = await response.json();
    
    if (result.success) {
      alert('Account created successfully! Please login.');
      document.getElementById('signupForm').reset();
      toggleSignup();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + error.message);
  }
}
