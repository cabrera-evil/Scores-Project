const url = 'https://scores-project-production.up.railway.app/api/auth/login';

// Login request
const login = async (email, password) => {
    const response = await axios.post(url, {
        email,
        password,
    })
    .then((response) => {
        if(response.status === 200) {
            window.location.href = '/../../dashboard.html';
            // Add token to local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
    })
    .catch((error) => {
        console.log(error);
    });
    ;
};

// Send input data to login request
const frmLogin = document.getElementById('frm-login');
frmLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (frmLogin.checkValidity() === false) {
        return;
    }
    frmLogin.classList.add('was-validated');
    const formData = new FormData(frmLogin);
    const data = Object.fromEntries(formData);
    login(data.email, data.password);
});