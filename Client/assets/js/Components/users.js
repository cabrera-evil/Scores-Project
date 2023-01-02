let user_url = "https://morty-api.panificador.link/api/users"
let faculty_url = "https://morty-api.panificador.link/api/faculties"

// Get user id
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

if (window.location.pathname == '/admin_users.html') {
    const table = document.getElementById('users-table');
    // Get users
    getUsers();

    // Event listener for button click inside table actions
    table.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        // Get user id
        const id = btn.closest('tr').querySelector('td').textContent;

        // Edit user role
        if (btn.classList.contains('btn-warning')) {
            Swal.fire({
                title: 'Change user role',
                input: 'select',
                inputOptions: {
                    'ADMIN_ROLE': 'Admin',
                    'USER_ROLE': 'User'
                },
                inputPlaceholder: 'Select a role',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value !== '') {
                            resolve();
                        } else {
                            resolve('You need to select a role!');
                        }
                    });
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.patch(`${user_url}/${id}`, {
                        role: result.value
                    },
                        {
                            headers: {
                                'x-token': localStorage.getItem('token')
                            }
                        })
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'User role changed!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            getUsers();
                        }).catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                            })
                        });
                }
            }
            )
        }
    });

    // Reload button
    const reload = document.getElementById('btn-reload');
    reload.addEventListener('click', () => {
        document.getElementById('loader').style.display = 'block';
        getUsers();
    });

    // Requests

    // Get users
    async function getUsers() {
        // If there's any child on table, delete it
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        axios.get(user_url)
            .then(response => {
                // Hide loader when data is loaded
                document.getElementById('loader').style.display = 'none';

                let users = response.data.users;

                for (let i = 0; i < users.length; i++) {
                    // Set data table
                    const tr = document.createElement('tr');
                    const tdId = document.createElement('td');
                    const tdName = document.createElement('td');
                    const tdEmail = document.createElement('td');
                    const tdRole = document.createElement('td');
                    const tdCareer = document.createElement('td');
                    const tdCUM = document.createElement('td');

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
                    tdId.innerHTML = users[i]._id;
                    tdName.innerHTML = users[i].name;
                    tdEmail.innerHTML = users[i].email;
                    tdRole.innerHTML = users[i].role;
                    tdCareer.innerHTML = users[i].career;
                    tdCUM.innerHTML = users[i].cum;

                    // Append data to table
                    tr.appendChild(tdId);
                    tr.appendChild(tdName);
                    tr.appendChild(tdEmail);
                    tr.appendChild(tdRole);
                    tr.appendChild(tdCareer);
                    tr.appendChild(tdCUM);
                    tr.appendChild(tdActions);

                    // Append buttons to table
                    tdActions.appendChild(btnSuccess);
                    tdActions.appendChild(btnEdit);
                    tdActions.appendChild(btnDelete);

                    table.appendChild(tr);
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            });
    }
}