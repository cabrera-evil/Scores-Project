let user_url = "https://scores-project-production.up.railway.app/api/users"
let faculty_url = "https://scores-project-production.up.railway.app/api/faculties"

// Get user id
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

if (window.location.pathname === '/subjects.html') {
    const user = parseJwt(localStorage.getItem('token')).uid;
    const career_id = JSON.parse(localStorage.getItem('user')).career_id;

    // Axios get subjects by career_id
    axios.get(user_url + "?_id=" + user)
        .then(response => {
            const subjects = response.data.users[0].subjects;
            const select = document.getElementById('subjects');
            subjects.forEach(subject => {

            });
        }
        );

    // Axios get subjects by career_id
    axios.get(faculty_url)

        .then(response => {
            const subjects = response.data.faculties[0].careers;
            const select = document.getElementById('subjects');

            subjects.forEach(subject => {
                if (subject.id === career_id) {
                    subject.subjects.forEach(subject => {
                        const option = document.createElement('option');
                        option.value = subject.id;
                        option.innerText = subject.name;
                        select.appendChild(option);
                    });
                }
            });
        }
        );

    // On submit
    const frmSubjects = document.getElementById('frm-subjects');
    frmSubjects.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (frmSubjects.checkValidity() === false) {
            return;
        }
        frmSubjects.classList.add('was-validated');
        const formData = new FormData(frmSubjects);
        const data = Object.fromEntries(formData);
        await registerSubjects(data);
    }
    );

    // Register subjects request
    function registerSubjects(data) {
        axios.patch(`${user_url}/${user}`, {
            subjects: {
                id: data.subjects,
                name: 'PRE CALCULUS',
                time: data.time
            }
        },
            {
                headers: {
                    'x-token': localStorage.getItem('token')
                }
            })
            .then(response => {
                console.log(response);
                // window.location.href = '/subjects.html';
            })
            .catch(error => {
                console.log(error);
            });
    }
}

