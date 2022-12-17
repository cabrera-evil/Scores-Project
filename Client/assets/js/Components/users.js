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

if (window.location.pathname == '/admin_users.html') {
    // Get users
    getUsers();

    // Requests

    // Get users
    async function getUsers() {
        axios.get(user_url)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Users successfully loaded',
                    showConfirmButton: false,
                    timer: 1500
                })
                let users = response.data.users;
                let table = document.getElementById('users-table');

                for (let i = 0; i < users.length; i++) {
                    // Set data table
                    const tr = document.createElement('tr');
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
                    tdName.innerHTML = users[i].name;
                    tdEmail.innerHTML = users[i].email;
                    tdRole.innerHTML = users[i].role;
                    tdCareer.innerHTML = users[i].career;
                    tdCUM.innerHTML = users[i].cum;

                    // Append data to table
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