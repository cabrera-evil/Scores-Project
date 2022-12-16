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

            // Get subjects for charts
            const data = getSubjects(subjects);
            setChartData(data[0], data[1]);

            // Get user's subjects
            setCurrentSubjects(subjects);
        }
        );

    // Get user's subjects improve
    function getImprove(subjects) {
        // Find the user subject with lowest average and with current status true
        for (let i = 1; i < subjects.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (subjects[i].average < subjects[j].average && subjects[i].current == true) {
                    const lblImprove = document.getElementById('user-improve');
                    lblImprove.innerText = subjects[i].name;
                }
            }
        }
    }

    // Get user's subjects for charts
    function getSubjects(subjects) {
        let subjectNames = [];
        let subjectAverages = [];
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].current == true) {
                subjectNames.push(subjects[i].name);
                subjectAverages.push(subjects[i].average);
            }
        }
        return [subjectNames, subjectAverages];
    }

    // Set chart data
    function setChartData(subjectNames, subjectAverages) {
        let total = 100;

        let ctx = document.getElementById("myPieChart");
        let myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjectNames,
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: false
                },
                cutoutPercentage: 80,
            },
        });
    }

    function setCurrentSubjects(subjects) {
        const subjectList = document.getElementById('subject-list');
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].current == true) {
                const subject = document.createElement('h4');
                const progress = document.createElement('div');
                const bar = document.createElement('div');

                // Label for subject
                subject.className = "small font-weight-bold";
                subject.innerHTML = `
                    ${subjects[i].name}<span class="float-right">${subjects[i].average}%</span>
                `;

                // Progress bar container
                progress.className = "progress mb-4 bg";

                // Progress bar
                bar.className = "progress-bar";

                // Set progress bar color
                if(subjects[i].average >= 60) {
                    bar.className += " bg-success";
                } else if(subjects[i].average >= 50) {
                    bar.className += " bg-warning";
                } else {
                    bar.className += " bg-danger";
                }

                // Set progress bar width
                bar.style = `width:${subjects[i].average}%`;
                bar.ariaValueNow = subjects[i].average;
                bar.ariaValueMin = "0";
                bar.ariaValueMax = "100";
                bar.role = "progressbar";

                // Append elements
                subjectList.appendChild(subject);
                subjectList.appendChild(progress);
                progress.appendChild(bar);
            }
        }
    }
}