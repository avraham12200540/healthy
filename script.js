const users = ['אבא', 'אמא', 'טליה', 'אברהם', 'אבישי', 'אחר'];
const activities = {
    'קימה בבוקר לתפילה': {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1},
    'צחצוח שיניים': {'בוקר': 2, 'ערב': 2},
    'לימוד תורה': {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90},
    'מתח ברצף': {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10},
    'שכיבות סמיכה ברצף': {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5},
    'אכילת פרי': {'פרי אחד': 1},
    'אכילת ירק': {'ירק אחד': 2},
    'הליכה לישון': {'21:30': 5, '22:00': 3, '23:00': 1},
    'עבודות חופש': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8, 'שעה וחצי': 13, 'שעתיים': 20},
    'רכיבה על אופניים': {'10 דקות': 2},
    'הליכה': {'רבע שעה': 1},
    'שחייה': {'בריכה 1': 1, 'בריכה 2': 2, 'בריכה 3': 3, 'בריכה 4': 4, 'בריכה 5': 5, 'בריכה 6': 6, 'בריכה 7': 7, 'בריכה 8': 8, 'בריכה 9': 9, 'בריכה 10': 10},
    'משחק כדור': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8},
    'הכנת סלט למשפחה': {'פעם אחת': 1},
    'הכנת ארוחה מבושלת למשפחה': {'בוקר': 2, 'צהריים': 4, 'ערב': 3},
    'שתיית מים': {'2 ליטר': 1},
    'עזרה בבית': {'5 דקות': 1, '10 דקות': 2, '20 דקות': 5}
};

const userSelect = document.getElementById('userSelect');
const activitySelect = document.getElementById('activitySelect');
const optionSelect = document.getElementById('optionSelect');
const totalScoreDiv = document.getElementById('totalScore');
const userScoreDiv = document.getElementById('userScore');

let chartInstance = null;

// יצירת אפשרויות משתמשים ופעילויות
users.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user;
    opt.textContent = user;
    userSelect.appendChild(opt);
});

Object.keys(activities).forEach(activity => {
    const opt = document.createElement('option');
    opt.value = activity;
    opt.textContent = activity;
    activitySelect.appendChild(opt);
});

// אתחל אפשרויות של פעילות
activitySelect.value = Object.keys(activities)[0];
updateOptionSelect();

activitySelect.addEventListener('change', updateOptionSelect);

function updateOptionSelect() {
    optionSelect.innerHTML = '';
    const options = activities[activitySelect.value];
    Object.keys(options).forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        optionSelect.appendChild(opt);
    });
}

function saveData() {
    const user = userSelect.value;
    const activity = activitySelect.value;
    const option = optionSelect.value;

    if (!user || !activity || !option) {
        alert('בחר הכל!');
        return;
    }

    const points = activities[activity][option];

    // עדכון ניקוד משתמש
    firebase.database().ref('scores/' + user).once('value').then(snapshot => {
        let currentUserScore = snapshot.val() || 0;
        let newUserScore = currentUserScore + points;

        firebase.database().ref('scores/' + user).set(newUserScore);

        // עדכון ניקוד כללי
        firebase.database().ref('scores/total').once('value').then(totalSnap => {
            let currentTotal = totalSnap.val() || 0;
            let newTotal = currentTotal + points;
            firebase.database().ref('scores/total').set(newTotal);

            // עדכון רשימת פעילויות לפי משתמש
            firebase.database().ref('userActivities/' + user + '/' + activity).once('value').then(actSnap => {
                let currentActivityPoints = actSnap.val() || 0;
                let newActivityPoints = currentActivityPoints + points;
                firebase.database().ref('userActivities/' + user + '/' + activity).set(newActivityPoints);

                updateDisplay();
            });
        });
    });
}

function updateDisplay() {
    // ניקוד כללי
    firebase.database().ref('scores/total').once('value').then(snapshot => {
        totalScoreDiv.textContent = 'ניקוד כללי: ' + (snapshot.val() || 0);
    });

    const user = userSelect.value;
    if (!user) {
        userScoreDiv.textContent = '';
        document.getElementById('userActivitiesList').innerHTML = '';
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        return;
    }

    // ניקוד משתמש
    firebase.database().ref('scores/' + user).once('value').then(snapshot => {
        userScoreDiv.textContent = `${user} עשה: ${(snapshot.val() || 0)} נקודות`;
    });

    // הצגת רשימת פעילויות משתמש
    showUserActivitiesList();

    // הצגת גרף ניקוד משתמש לפי פעילות
    showUserScoreChart();
}

userSelect.addEventListener('change', updateDisplay);

// הצגת רשימת פעילויות עם ניקוד למשתמש
function showUserActivitiesList() {
    const user = userSelect.value;
    const ul = document.getElementById('userActivitiesList');
    ul.innerHTML = '';

    if (!user) return;

    firebase.database().ref('userActivities/' + user).once('value').then(snapshot => {
        const activities = snapshot.val() || {};
        if (Object.keys(activities).length === 0) {
            ul.innerHTML = '<li>אין פעילויות</li>';
            return;
        }
        Object.entries(activities).forEach(([activity, points]) => {
            const li = document.createElement('li');
            li.textContent = `${activity}: ${points} נקודות`;
            ul.appendChild(li);
        });
    });
}

// הצגת גרף ניקוד משתמש לפי פעילות
function showUserScoreChart() {
    const user = userSelect.value;
    if (!user) return;

    firebase.database().ref('userActivities/' + user).once('value').then(snapshot => {
        const data = snapshot.val() || {};
        const labels = Object.keys(data);
        const scores = Object.values(data);

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('scoreChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `נקודות לפי פעילות - ${user}`,
                    data: scores,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                }
            }
        });
    });
}

// טעינת נתונים ראשונית
updateDisplay();

// חשוף לפונקציה כפתור ב-HTML
window.saveData = saveData;
