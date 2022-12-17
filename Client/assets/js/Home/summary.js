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
            const data = setCurrentSubjects(subjects);
            setChartData(data[0], data[1]);

            // Set progress bar
            setProgressBar(subjects);

            // Get user's passed subjects
            const approvedSubjects = setPassedSubjects(subjects);
            setOverview(approvedSubjects[0], approvedSubjects[1]);
        }
        );

    // Get user's subjects improve
    function getImprove(subjects) {
        // Find the user subject with lowest average and with current status true
        let lowestAverage = 10.0;
        let subjectName = "";
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].current && subjects[i].average < lowestAverage) {
                lowestAverage = subjects[i].average;
                subjectName = subjects[i].name;
            }
        }

        // Set the lowest average
        const lblImprove = document.getElementById('user-improve');
        lblImprove.innerText = subjectName;
    }

    // Get user current subjects
    function setCurrentSubjects(subjects) {
        let subjectNames = [];
        let subjectAverages = [];
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].current) {
                subjectNames.push(subjects[i].name);
                subjectAverages.push(subjects[i].average);
            }
        }
        return [subjectNames, subjectAverages];
    }

    // Get all subjects data
    function setPassedSubjects(subjects) {
        let subjectNames = [];
        let subjectAverages = [];
        for (let i = 0; i < subjects.length; i++) {
            if (!subjects[i].current) {
                subjectNames.push(subjects[i].name);
                subjectAverages.push(subjects[i].average);
            }
        }
        return [subjectNames, subjectAverages];
    }

    // Set pie chart data
    function setChartData(subjectNames, subjectAverages) {
        let ctx_pie = document.getElementById("myPieChart");
        let mySubject = document.getElementById("subject-name");

        // Set pie chart labels
        for (let i = 0; i < subjectNames.length; i++) {
            // Set a color per subject average
            if (subjectAverages[i] > 6.0) {
                mySubject.innerHTML += `
                <div class="col-auto">
                    <i class="fas fa-circle text-success"></i> ${subjectNames[i]}
                </div>
            `;
            }
            else if (subjectAverages[i] == 6.0) {
                mySubject.innerHTML += `
                <div class="col-auto">
                    <i class="fas fa-circle text-primary"></i> ${subjectNames[i]}
                </div>
            `;
            }
            else if (subjectAverages[i] >= 5.0) {
                mySubject.innerHTML += `
                <div class="col-auto">
                    <i class="fas fa-circle text-info"></i> ${subjectNames[i]}
                </div>
            `;
            }
            else if (subjectAverages[i] >= 4.0) {
                mySubject.innerHTML += `
                <div class="col-auto">
                    <i class="fas fa-circle text-warning"></i> ${subjectNames[i]}
                </div>
            `;
            }
            else {
                mySubject.innerHTML += `
                <div class="col-auto">
                    <i class="fas fa-circle text-danger"></i> ${subjectNames[i]}
                </div>
            `;
            }
        }

        // Set pie chart data
        let myPieChart = new Chart(ctx_pie, {
            type: 'doughnut',
            data: {
                labels: subjectNames,
                datasets: [{
                    // If subject average is 0, set the entire chart on 100% red
                    data: subjectAverages,
                    // Set the same color as the label for every subject depending on the average
                    backgroundColor: function (context) {
                        if (context.dataset.data[context.dataIndex] > 6.0) {
                            return '#1cc88a';
                        }
                        else if (context.dataset.data[context.dataIndex] == 6.0) {
                            return '#4e73df';
                        }
                        else if (context.dataset.data[context.dataIndex] >= 5.0) {
                            return '#36b9cc';
                        }
                        else if (context.dataset.data[context.dataIndex] >= 4.0) {
                            return '#f6c23e';
                        }
                        else {
                            return '#e74a3b';
                        }
                    }
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    // Set the same color as the label for every subject depending on the average
                    backgroundColor: function (context) {
                        if (context.parsed.y > 6.0) {
                            return '#1cc88a';
                        }
                        else if (context.parsed.y == 6.0) {
                            return '#4e73df';
                        }
                        else if (context.parsed.y >= 5.0) {
                            return '#36b9cc';
                        }
                        else if (context.parsed.y >= 4.0) {
                            return '#f6c23e';
                        }
                        else {
                            return '#e74a3b';
                        }
                    },
                    bodyFontColor: "#fff",
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

    // Set current subjects data on progress bar
    function setProgressBar(subjects) {
        const subjectList = document.getElementById('subject-list');
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].current == true) {
                const subject = document.createElement('h4');
                const progress = document.createElement('div');
                const bar = document.createElement('div');

                // Label for subject
                subject.className = "small font-weight-bold";
                subject.innerHTML = `
                    ${subjects[i].name}<span class="float-right">Average: ${subjects[i].average}</span>
                `;

                // Progress bar container
                progress.className = "progress mb-4 bg";

                // Progress bar
                bar.className = "progress-bar";

                // Set progress bar color
                if (subjects[i].average > 6.0) {
                    bar.className += " bg-success";
                }
                else if (subjects[i].average == 6.0) {
                    bar.className += " bg-primary";
                }
                else if (subjects[i].average >= 5.0) {
                    bar.className += " bg-info";
                }
                else if (subjects[i].average >= 4.0) {
                    bar.className += " bg-warning";
                }
                else {
                    bar.className += " bg-danger";
                }

                // Set progress bar width
                bar.style = `width:${subjects[i].average * 10}%`;
                bar.ariaValueNow = subjects[i].average;
                bar.ariaValueMin = "0";
                bar.ariaValueMax = "10";
                bar.role = "progressbar";

                // Append elements
                subjectList.appendChild(subject);
                subjectList.appendChild(progress);
                progress.appendChild(bar);
            }
        }
    }

    // Set area chart data
    function setOverview(subjectNames, subjectAverages) {
        let ctx_area = document.getElementById("myAreaChart");

        // Set area chart data
        let myAreaChart = new Chart(ctx_area, {
            type: 'line',
            data: {
                labels: subjectNames.map((subject) => subject.substring(0, 3)),
                datasets: [{
                    label: "Average",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: subjectAverages,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return value;
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + tooltipItem.yLabel;
                        }
                    }
                }
            }
        });
    }
}