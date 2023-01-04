let deploy_url = "https://morty-api.panificador.link/"
let local_url = "http://localhost:3000/"
let user_url = `${deploy_url}api/users`
let faculty_url = `${deploy_url}api/faculties`

// Get user id
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

if (window.location.pathname === '/evaluations.html') {
    const user = parseJwt(localStorage.getItem('token')).uid;
    const search = document.getElementById('find-subject');
    const table = document.getElementById('evaluation-table');

    search.addEventListener('change', () => {
        // Get user's evaluations
        getEvaluations(search.value);
    })

    // Get user's subjects
    userSubjects();

    // On submit
    const frmEvaluations = document.getElementById('frm-evaluations');
    frmEvaluations.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (frmEvaluations.checkValidity() === false) {
            return;
        }
        frmEvaluations.classList.add('was-validated');
        const formData = new FormData(frmEvaluations);
        const data = Object.fromEntries(formData);
        await registerEvaluations(data);
    });

    // Get evaluations data
    async function getEvaluations(subject) {
        // Delete table data
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        // Show loader
        if (userEvaluations(subject))
            document.getElementById('loader').style.display = 'block';
    }

    // Event listener for button click inside table actions
    table.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const td = btn.parentElement;
        const tr = td.parentElement;
        const subject = tr.children[0].value;
        const evaluation = tr.children[1].value;
        const grade = tr.children[3].innerText;

        if (btn.classList.contains('btn-warning')) {
            Swal.fire({
                title: 'Do you want to edit this evaluation?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Edit',
                denyButtonText: `Don't edit`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // Edit grade by swal input number with two decimals
                    Swal.fire({
                        title: 'Edit grade',
                        input: 'number',
                        inputLabel: 'Grade',
                        inputValue: grade,
                        inputAttributes: {
                            step: '0.01',
                            min: 0,
                            max: 10
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Save',
                        showLoaderOnConfirm: true,
                        preConfirm: (grade) => {
                            if (grade >= 0 && grade <= 10) {
                                return grade;
                            }
                            else {
                                Swal.showValidationMessage(
                                    `Grade must be between 0 and 10`
                                )
                            }
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const newEvaluation = {
                                id: evaluation,
                                subject_id: subject,
                                grade: result.value
                            };
                            updateEvaluationGrade(newEvaluation);
                            tr.children[3].innerText = result.value;
                        }
                    })
                } else if (result.isDenied) {
                    Swal.fire('Subject not edited', '', 'info')
                }
            })
        }

        if (btn.classList.contains('btn-danger')) {
            Swal.fire({
                title: 'Do you want to delete this evaluation?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                denyButtonText: `Don't delete`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    if (deleteEvaluation(evaluation, subject))
                        tr.remove();
                } else if (result.isDenied) {
                    Swal.fire('Evaluation not deleted', '', 'info')
                }
            })
        }
    }
    );

    // Reload button
    const reload = document.getElementById('btn-reload');
    reload.addEventListener('click', () => {
        getEvaluations(search.value);
    });

    // Requests

    // Get user's subjects
    async function userSubjects() {
        axios.get(`${user_url}?_id=${user}`)
            .then(response => {
                const subjects = response.data.users[0].subjects;
                const select = document.getElementById('subject');

                subjects.forEach(subject => {
                    if (subject.current) {
                        // Register evaluation
                        const option = document.createElement('option');
                        option.value = subject.id;
                        option.innerText = subject.name;
                        select.appendChild(option);

                        // Search subject evaluation
                        const optionSearch = document.createElement('option');
                        optionSearch.value = subject.id;
                        optionSearch.innerText = subject.name;
                        search.appendChild(optionSearch);
                    }
                });
            });
    }

    // Register evaluations request
    async function registerEvaluations(data) {
        axios.patch(`${user_url}/${user}`, {
            evaluations: [
                {
                    subject_id: data.subject,
                    name: `${data.name}-${data.number}`,
                    percentage: data.percentage
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
                    title: 'Evaluation successfully registered',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            });
    }

    // Get user's evaluation by subject
    async function userEvaluations(subject) {
        const average = document.getElementById('average');
        average.value = 0;

        // If there's any child on table, delete it
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        // Get user's evaluations by user subject
        axios.get(`${user_url}?_id=${user}`)
            .then(response => {
                // Hide loader when data is loaded
                document.getElementById('loader').style.display = 'none';
                let userEvaluations = response.data.users[0].subjects;

                for (let i = 0; i < userEvaluations.length; i++) {
                    if (userEvaluations[i].id === subject) {
                        for (let j = 0; j < userEvaluations[i].evaluations.length; j++) {
                            // Set table data
                            const tr = document.createElement('tr');
                            const tdSubject = document.createElement('td');
                            const tdName = document.createElement('td');
                            const tdPercentage = document.createElement('td');
                            const tdGrade = document.createElement('td');

                            // Action buttons
                            const tdActions = document.createElement('td');
                            const btnEdit = document.createElement('button');
                            const btnDelete = document.createElement('button');

                            // Action buttons
                            btnEdit.classList.add('btn', 'btn-warning', 'btn-circle', 'btn-sm');
                            btnDelete.classList.add('btn', 'btn-danger', 'btn-circle', 'btn-sm');

                            // Add favicon button
                            const edit = document.createElement('i');
                            edit.classList.add('fas', 'fa-edit');

                            const trash = document.createElement('i');
                            trash.classList.add('fas', 'fa-trash');

                            btnEdit.appendChild(edit);
                            btnDelete.appendChild(trash);

                            // Styling buttons
                            btnEdit.style.marginLeft = '1rem';
                            btnDelete.style.marginLeft = '1rem';

                            // Set data
                            tdSubject.innerText = userEvaluations[i].name;
                            tdSubject.value = userEvaluations[i].id;
                            tdName.innerText = userEvaluations[i].evaluations[j].name;
                            tdName.value = userEvaluations[i].evaluations[j].id;
                            tdPercentage.innerText = userEvaluations[i].evaluations[j].percentage;
                            tdGrade.innerText = userEvaluations[i].evaluations[j].grade;
                            tdActions.appendChild(btnEdit);
                            tdActions.appendChild(btnDelete);
                            tr.appendChild(tdSubject);
                            tr.appendChild(tdName);
                            tr.appendChild(tdPercentage);
                            tr.appendChild(tdGrade);
                            tr.appendChild(tdActions);
                            table.appendChild(tr);

                            // Set the subject average
                            average.value = userEvaluations[i].average;
                        }
                    }
                }
            }
            );
    }

    // Update evaluation grade
    async function updateEvaluationGrade(newEvaluation) {
        // Update grade
        axios.patch(`${user_url}/${user}`, {
            evaluations: [
                newEvaluation
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
                    title: 'Grade successfully updated',
                    showConfirmButton: false,
                    timer: 1500
                })
                // Reload
                userEvaluations(newEvaluation.subject_id);
            }
            )
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            });
    }

    // Delete evaluation
    async function deleteEvaluation(evaluation, subject) {
        // Delete evaluation
        axios.patch(`${user_url}/${user}`, {
            evaluations: [
                {
                    id: evaluation,
                    subject_id: subject,
                    delete: true
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
                    title: 'Evaluation successfully deleted',
                    showConfirmButton: false,
                    timer: 1500
                })
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
}

