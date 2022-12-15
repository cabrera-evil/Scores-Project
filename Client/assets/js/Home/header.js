// On logout click, clear the session storage and redirect to login page
const logoutBtn = document.getElementById('btn-logout');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.location.href = '/../../index.html';
});