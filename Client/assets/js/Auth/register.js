let url = 'https://scores-project-production.up.railway.app/api/users';
let faculty_url = 'https://scores-project-production.up.railway.app/api/faculties';

// On dom load
document.addEventListener('DOMContentLoaded', () => {
    axios.get(faculty_url)
        .then(response => {
            setFaculties(response.data.faculties);
        }
        );
});

// Register user data form
const frmRegister = document.getElementById('frm-register');
frmRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (frmRegister.checkValidity() === false) {
        return;
    }
    frmRegister.classList.add('was-validated');
    const formData = new FormData(frmRegister);
    const data = Object.fromEntries(formData);

    await registerUser(data);
});

// Register user request
function registerUser(data) {
    axios.post(url, {
        name: data.name,
        email: data.email,
        password: data.password,
        career: data.career
    })
        .then(response => {
            console.log(response);
            window.location.href = '/index.html';
        })
        .catch(error => {
            console.log(error);
        });
}

// Set careers by selected faculty
const faculties = document.getElementById('faculty');
faculties.addEventListener('change', () => {
    const faculty_id = faculties.value;
    axios.get(faculty_url)
        .then(response => {
            const faculty = response.data.faculties.find(faculty => faculty._id === faculty_id);
            setCareers(faculty.careers);
        }
        );
});

// Set faculties
function setFaculties(faculties) {
    const select = document.getElementById('faculty');
    faculties.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty._id;
        option.innerHTML = faculty.name;
        select.appendChild(option);
    });
}

// Set careers
function setCareers(careers) {
    const select = document.getElementById('career');
    if (careers.length > 0) {
        careers.forEach(career => {
            const option = document.createElement('option');
            option.value = career.name;
            option.innerHTML = career.name;
            select.appendChild(option);
        });
    }
    else {
        // Delete existent career options
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }
}