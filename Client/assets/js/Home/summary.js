let url = "https://scores-project-production.up.railway.app/api/users"

// Get user id
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const user = parseJwt(localStorage.getItem('token')).uid;

if (window.location.pathname == "/dashboard.html") {
    // Get user's data (academic profile)
    axios.get(url = url + "?_id=" + user)
        .then(response => {
            const lblCum = document.getElementById('user-cum');
            lblCum.innerText = response.data.users[0].cum;
            const lblCareer = document.getElementById('user-career');
            lblCareer.innerText = response.data.users[0].career;

            // Find the user subject with lowest average
            const subjects = response.data.users[0].subjects;

            // Get the lowest average
            getImprove(subjects);
        }
        );

    // Get user's subjects improve
    function getImprove(subjects) {
        // Find the user subject with lowest average and with current status true
        for (let i = 1; i < subjects.length; i++) {
            for(let j = 0; j <= i; j++){
                if(subjects[i].average < subjects[j].average && subjects[i].current == true){
                    const lblImprove = document.getElementById('user-improve');
                    lblImprove.innerText = subjects[i].name;
                }
            }
        }
    }
}
