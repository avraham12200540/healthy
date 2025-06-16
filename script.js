const users = ['אבא', 'אמא', 'טליה', 'אברהם', 'אבישי', 'אחר'];
const activities = {
    'קימה בבוקר לתפילה': {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1},
    'צחצוח שיניים': {'בוקר': 2, 'ערב': 2},
    'לימוד תורה': {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90},
    'מתח ברצף': {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10},
    'שכיבות סמיכה ברצף': {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5},
    'אכילת פרי': {'פרי אחד': 1},
    'אכילת ירק': {'ירק אחד': 2},
    'הליכה לישון': {'21:30': 5, '22:00': 3, '23:00': 1}
};

let scores = JSON.parse(localStorage.getItem('healthScores')) || {};

const userSelect = document.getElementById('userSelect');
const activitySelect = document.getElementById('activitySelect');
const optionSelect = document.getElementById('optionSelect');
const totalScoreDiv = document.getElementById('totalScore');
const userScoreDiv = document.getElementById('userScore');

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

activitySelect.addEventListener('change', () => {
    optionSelect.innerHTML = '';
    const options = activities[activitySelect.value];
    Object.keys(options).forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        optionSelect.appendChild(opt);
    });
});

function saveData() {
    const user = userSelect.value;
    const activity = activitySelect.value;
    const option = optionSelect.value;

    if (!user || !activity || !option) return alert('בחר הכל!');

    const points = activities[activity][option];
    scores[user] = (scores[user] || 0) + points;
    scores['total'] = (scores['total'] || 0) + points;

    localStorage.setItem('healthScores', JSON.stringify(scores));
    updateDisplay();
}

function updateDisplay() {
    totalScoreDiv.textContent = 'ניקוד כללי: ' + (scores['total'] || 0);
    const user = userSelect.value;
    userScoreDiv.textContent = user ? `${user} עשה: ${(scores[user] || 0)} נקודות` : '';
}

userSelect.addEventListener('change', updateDisplay);
updateDisplay();
