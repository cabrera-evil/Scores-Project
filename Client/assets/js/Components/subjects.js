let deploy_url = "https://morty-api.panificador.link/"
let local_url = "http://localhost:3000/"
let user_url = `${deploy_url}api/users`
let faculty_url = `${deploy_url}api/faculties`

// Decode uid from token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// SUBJECTS COMPONENT
if (window.location.pathname === '/subjects.html') {
    const user = parseJwt(localStorage.getItem('token')).uid;
    const career_id = JSON.parse(localStorage.getItem('user')).career_id;
    // Document elements
    const uv = document.getElementById('uv');
    const year = document.getElementById('year');
    const table = document.getElementById('subject-table');

    // Get user's subjects
    userSubjects();

    // To add new subjects
    year.addEventListener('change', async () => {
        // Delete options
        const options = document.querySelectorAll('#subjects option');
        options.forEach(option => {
            if (option.value) {
                option.remove();
            }
        });
        subjectPerYear();
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
    });

    // Event listener for button click inside table actions
    table.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const td = btn.parentElement;
        const tr = td.parentElement;
        const subject = tr.children[0].value;
        const evaluation = tr.children[1].value;
        const grade = tr.children[3].innerText;

        if (btn.classList.contains('btn-success')) {
            Swal.fire({
                title: 'Do you want to update this subject status?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    updateStatus(subject);
                    userSubjects();
                } else if (result.isDenied) {
                    Swal.fire('Subject not updated', '', 'info')
                }
            })
        }

        if (btn.classList.contains('btn-danger')) {
            Swal.fire({
                title: 'Do you want to delete this subject?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                denyButtonText: `Don't delete`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    deleteSubject(subject);
                } else if (result.isDenied) {
                    Swal.fire('Subject not deleted', '', 'info')
                }
            })
        }
    });

    // Reload button
    const reload = document.getElementById('btn-reload');
    reload.addEventListener('click', () => {
        document.getElementById('loader').style.display = 'block';
        userSubjects();
    });

    // Requests

    // Get user subjects
    async function userSubjects() {
        // If there's any child on table, delete it
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        // Get user's subjects
        axios.get(`${user_url}?_id=${user}`)
            .then(response => {
                // Hide loader when data is loaded
                document.getElementById('loader').style.display = 'none';

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
                        tdName.value = userSubjects[i].id;
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

    // Get subjects per year
    async function subjectPerYear() {
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
    }

    // Register subjects
    async function registerSubjects(data) {
        axios.patch(`${user_url}/${user}`, {
            subjects: [
                {
                    id: data.subjects,
                    current: true
                }
            ]
        },
            {
                headers: {
                    'x-token': localStorage.getItem('token')
                }
            })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Subject successfully registered',
                    showConfirmButton: false,
                    timer: 1500
                })
                userSubjects();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            });
    }

    // Update subject status
    async function updateStatus(subject) {
        // Update current status
        axios.patch(`${user_url}/${user}`, {
            subjects: [
                {
                    id: subject,
                    current: false
                }
            ]
        }, {
            headers: {
                'x-token': localStorage.getItem('token')
            }
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Subject status successfully updated',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.href = '/subjects.html';
            }
            )
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            }
            );
    }

    // Delete subject
    async function deleteSubject(subject) {
        // Delete subject
        axios.patch(`${user_url}/${user}`, {
            subjects: [
                {
                    id: subject,
                    delete: true
                }
            ]
        }, {
            headers: {
                'x-token': localStorage.getItem('token')
            }
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Subject successfully deleted',
                    showConfirmButton: false,
                    timer: 1500
                })
                userSubjects();
            }
            )
            .catch(error => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            }
            );
    }
}