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

if (window.location.pathname === '/evaluations.html') {
    const user = parseJwt(localStorage.getItem('token')).uid;
    const search = document.getElementById('find-subject');
    const table = document.getElementById('evaluation-table');

    search.addEventListener('change', () => {
        // Get user's evaluations
        getEvaluations(search.value);
    })

    // Axios get user's subjects
    axios.get(user_url + "?_id=" + user)
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
        console.log(data);
        await registerEvaluations(data);
    });

    // Register evaluations request
    async function registerEvaluations(data) {
        axios.patch(`${user_url}/${user}`, {
            evaluations: [
                {
                    subject_id: data.subject,
                    name: `${data.name} ${data.number}`,
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
                console.log(response);
                // window.location.href = '/evaluations.html';
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Get evaluations data
    async function getEvaluations(subject) {
        // Delete table data
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        // Get user's evaluations by user subject
        axios.get(`${user_url}?id=${user}`)
            .then(response => {
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
                            const btnSuccess = document.createElement('button');
                            const btnEdit = document.createElement('button');
                            const btnDelete = document.createElement('button');

                            // Action buttons
                            btnSuccess.classList.add('btn', 'btn-success', 'btn-circle', 'btn-sm');
                            btnEdit.classList.add('btn', 'btn-warning', 'btn-circle', 'btn-sm');
                            btnDelete.classList.add('btn', 'btn-danger', 'btn-circle', 'btn-sm');

                            // Add favicon button
                            const check = document.createElement('i');
                            check.classList.add('fas', 'fa-check');

                            const edit = document.createElement('i');
                            edit.classList.add('fas', 'fa-edit');

                            const trash = document.createElement('i');
                            trash.classList.add('fas', 'fa-trash');

                            btnSuccess.appendChild(check);
                            btnEdit.appendChild(edit);
                            btnDelete.appendChild(trash);

                            // Styling buttons
                            btnSuccess.style.marginLeft = '1rem';
                            btnEdit.style.marginLeft = '1rem';
                            btnDelete.style.marginLeft = '1rem';

                            // Set data
                            tdSubject.innerText = userEvaluations[i].name;
                            tdName.innerText = userEvaluations[i].evaluations[j].name;
                            tdPercentage.innerText = userEvaluations[i].evaluations[j].percentage;
                            tdGrade.innerText = userEvaluations[i].evaluations[j].grade;
                            tdActions.appendChild(btnSuccess);
                            tdActions.appendChild(btnEdit);
                            tdActions.appendChild(btnDelete);
                            tr.appendChild(tdSubject);
                            tr.appendChild(tdName);
                            tr.appendChild(tdPercentage);
                            tr.appendChild(tdGrade);
                            tr.appendChild(tdActions);
                            table.appendChild(tr);
                        }
                    }
                }
            }
            );
    }
}

