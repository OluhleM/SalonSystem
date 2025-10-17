document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const editBtn = document.querySelector('.edit-btn');
  const inputs = document.querySelectorAll('#profile-form input');
  const profileForm = document.getElementById('profile-form');
  const loading = document.querySelector('.loading');
  const logoutBtn = document.getElementById('logout-btn');
  const changePassBtn = document.getElementById('change-pass-btn');
  const passwordModal = document.getElementById('password-modal');
  const closeModal = document.querySelector('.close');
  const passwordForm = document.getElementById('password-form');
  const cancelBtn = document.querySelector('.cancel-btn');
  
  // Navigation elements
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const closeNav = document.getElementById('close-nav');
  
  // Load user data on page load
  loadUserData();

  // Edit/Save profile functionality
  editBtn.addEventListener('click', function () {
    if (editBtn.textContent.includes('Edit')) {
      // Enable editing
      inputs.forEach(input => {
        input.disabled = false;
        input.style.backgroundColor = '#fff';
      });
      editBtn.innerHTML = '💾 Save';
      editBtn.style.backgroundColor = '#4CAF50';
    } else {
      // Save changes
      saveProfile();
    }
  });

  // Password change modal
  changePassBtn.addEventListener('click', () => {
    passwordModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    passwordModal.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    passwordModal.style.display = 'none';
  });

  // Password form submission
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    changePassword();
  });

  // Logout functionality
  logoutBtn.addEventListener('click', logout);

  // Navigation menu functionality
  menuToggle.addEventListener('click', function() {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  });

  closeNav.addEventListener('click', function() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  navOverlay.addEventListener('click', function() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close menu with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === passwordModal) {
      passwordModal.style.display = 'none';
    }
  });

  // Load user data from backend
  async function loadUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please log in first', 'error');
        return;
      }

      const response = await fetch('http://localhost:5003/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        document.getElementById('fullname').value = userData.name || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('phone').value = userData.phone || '';
        document.querySelector('.name').textContent = userData.name || 'User';
      } else {
        showToast('Failed to load user data', 'error');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set default values for demo
      document.getElementById('fullname').value = 'Nicole Qathule';
      document.getElementById('email').value = 'nicole@example.com';
      document.getElementById('phone').value = '+27 123 456 789';
    }
  }

  // Save profile data
  async function saveProfile() {
    const formData = {
      name: document.getElementById('fullname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };

    // Validation
    if (!formData.name || !formData.email) {
      showToast('Name and email are required', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    loading.style.display = 'block';
    editBtn.disabled = true;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Disable inputs and change button back
        inputs.forEach(input => {
          input.disabled = true;
          input.style.backgroundColor = '#f9d6f9';
        });
        editBtn.innerHTML = '✏️ Edit';
        editBtn.style.backgroundColor = 'hotpink';
        
        document.querySelector('.name').textContent = formData.name;
        showToast('Profile updated successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Profile updated successfully! (Demo mode)', 'success');
      
      // Demo mode - simulate success
      inputs.forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = '#f9d6f9';
      });
      editBtn.innerHTML = '✏️ Edit';
      editBtn.style.backgroundColor = 'hotpink';
      document.querySelector('.name').textContent = formData.name;
    } finally {
      loading.style.display = 'none';
      editBtn.disabled = false;
    }
  }

  // Change password
  async function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        passwordModal.style.display = 'none';
        passwordForm.reset();
        showToast('Password changed successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      passwordModal.style.display = 'none';
      passwordForm.reset();
      showToast('Password changed successfully! (Demo mode)', 'success');
    }
  }

  // Logout functionality
  function logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      showToast('Logged out successfully', 'success');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login.html'; // Adjust URL as needed
      }, 1000);
    }
  }

  // Toast notification system
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }

  // Email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Test backend connection
  fetch('http://localhost:5003/')
    .then(response => response.text())
    .then(data => {
      console.log('Backend connected:', data);
    })
    .catch(error => {
      console.error('Backend connection failed:', error);
    });
});
