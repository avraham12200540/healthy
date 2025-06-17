const users = ['אבא', 'אמא', 'יאיר', 'רננה', 'איתן', 'הדר', 'דביר', 'מוריה', 'ראשית', 'שמשון', 'טליה', 'אברהם', 'אבישי', 'שוביה ציון', 'עדיה מאיר', 'נטע', 'אחר'];
const activities = {
    'קימה בבוקר לתפילה': {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1},
    'צחצוח שיניים': {'בוקר': 2, 'ערב': 2},
    'לימוד תורה': {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90},
    'מתח ברצף': {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10},
    'שכיבות סמיכה ברצף': {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5},
    'כפיפות בטן': {'5': 1, '10': 2, '15': 3, '20': 4, '25': 5, '30': 6, '35': 7, '40': 8, '45': 9, '50': 10},
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
const togetherCheckbox = document.getElementById('togetherCheckbox'); // חדש

// מילוי dropdowns
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

// ברירת מחדל
activitySelect.value = Object.keys(activities)[0];
populateOptions();

activitySelect.addEventListener('change', populateOptions);

function populateOptions() {
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
    const didTogether = togetherCheckbox.checked; // האם נבחר תיבה

    if (!user || !activity || !option) {
        alert('בחר הכל!');
        return;
    }

    let points = activities[activity][option];

    // אם סומן שעשו ביחד - הכפלת ניקוד פי 1.5
    if (didTogether) {
        points = Math.round(points * 1.5); // עיגול לניקוד שלם
    }

    // קריאת ניקוד קיים
    database.ref('scores/' + user).once('value').then(snapshot => {
        let currentUserScore = snapshot.val() || 0;
        let newUserScore = currentUserScore + points;

        // שמירת ניקוד חדש
        database.ref('scores/' + user).set(newUserScore);

        // עדכון ניקוד כללי
        database.ref('scores/total').once('value').then(totalSnap => {
            let currentTotal = totalSnap.val() || 0;
            let newTotal = currentTotal + points;
            database.ref('scores/total').set(newTotal);

            // עדכון התצוגה
            updateDisplay();
        });
    });
}

function updateDisplay() {
    // ניקוד כללי
    database.ref('scores/total').once('value').then(snapshot => {
        totalScoreDiv.textContent = 'ניקוד כללי: ' + (snapshot.val() || 0);
    });

    // ניקוד של המשתמש הנבחר
    const user = userSelect.value;
    database.ref('scores/' + user).once('value').then(snapshot => {
        userScoreDiv.textContent = user ? `${user} עשה: ${(snapshot.val() || 0)} נקודות` : '';
    });
}

// עדכון תצוגה בשינוי משתמש
userSelect.addEventListener('change', updateDisplay);

// טעינת ניקוד בעת טעינת הדף
updateDisplay();

// זמינות הפונקציה לכפתור ב-HTML
window.saveData = saveData;
