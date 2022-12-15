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
    // Document elements
    const uv = document.getElementById('uv');
    const year = document.getElementById('year');
    const table = document.getElementById('subject-table');

    // Get user's subjects
    getSubjects();

    // To add new subjects
    year.addEventListener('change', async () => {
        // Delete options
        const options = document.querySelectorAll('#subjects option');
        options.forEach(option => {
            if (option.value) {
                option.remove();
            }
        });

        // Axios get subjects by career_id
        axios.get(faculty_url)
            .then(response => {
                const subjects = response.data.faculties[0].careers;
                const select = document.getElementById('subjects');

                subjects.forEach(career => {
                    if (career.id === career_id) {
                        career.subjects.forEach(subject => {
                            if (subject.year == year.value) {
                                const option = document.createElement('option');
                                option.value = subject.id;
                                option.innerText = subject.name;
                                select.appendChild(option);

                                select.addEventListener('change', () => {
                                    // Get the selected subject value
                                    const selected = select.options[select.selectedIndex].value;

                                    // Get the selected subject uv
                                    career.subjects.forEach(subject => {
                                        if (subject.id == selected) {
                                            uv.value = subject.uv;
                                        }
                                    }
                                    );
                                });
                            }
                        });
                    }
                });
            });
    });

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
    async function registerSubjects(data) {
        axios.patch(`${user_url}/${user}`, {
            subjects: [
                {
                    id: data.subjects,
                    times: data.time
                }
            ]
        },
            {
                headers: {
                    'x-token': localStorage.getItem('token')
                }
            })
            .then(response => {
                console.log(response);
                window.location.href = '/subjects.html';
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Get subjects data
    async function getSubjects() {
        // Get user's subjects
        axios.get(`${user_url}?id=${user}`)
            .then(response => {
                let userSubjects = response.data.users[0].subjects;
                for (let i = 0; i < userSubjects.length; i++) {
                    if (userSubjects[i].current) {
                        // Set table data
                        const tr = document.createElement('tr');
                        const tdName = document.createElement('td');
                        const tdTime = document.createElement('td');
                        const tdUv = document.createElement('td');
                        const tdAverage = document.createElement('td');
                        const tdApproved = document.createElement('td');

                        // Action buttons
                        const tdActions = document.createElement('td');
                        const btnSuccess = document.createElement('button');
                        const btnDelete = document.createElement('button');

                        // Action buttons
                        btnSuccess.classList.add('btn', 'btn-success', 'btn-circle', 'btn-sm');
                        btnDelete.classList.add('btn', 'btn-danger',
                            'btn-circle', 'btn-sm');

                        // Add favicon button
                        const check = document.createElement('i');
                        check.classList.add('fas', 'fa-check');

                        const trash = document.createElement('i');
                        trash.classList.add('fas', 'fa-trash');

                        btnSuccess.appendChild(check);
                        btnDelete.appendChild(trash);

                        // Styling buttons
                        btnSuccess.style.marginLeft = '1rem';
                        btnDelete.style.marginLeft = '1rem';

                        // Set data
                        tdName.innerText = userSubjects[i].name;
                        tdUv.innerText = userSubjects[i].uv;
                        tdTime.innerText = userSubjects[i].times;
                        tdAverage.innerText = userSubjects[i].average;
                        tdApproved.innerText = userSubjects[i].approved;
                        tdActions.appendChild(btnSuccess);
                        tdActions.appendChild(btnDelete);
                        tr.appendChild(tdName);
                        tr.appendChild(tdUv);
                        tr.appendChild(tdTime);
                        tr.appendChild(tdAverage);
                        tr.appendChild(tdApproved);
                        tr.appendChild(tdActions);
                        table.appendChild(tr);
                    }
                }
            }
            );
    }
}