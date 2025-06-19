// הגדרת מערך המשתמשים
const users = ['אבא', 'אמא', 'יאיר', 'רננה', 'איתן', 'הדר', 'דביר', 'מוריה', 'ראשית', 'שמשון', 'טליה', 'אברהם', 'אבישי', 'שוביה ציון', 'עדיה מאיר', 'נטע', 'אחר'];

// הגדרת אובייקט הפעילויות ואפשרויותיהן עם ניקוד
const activities = {
    'קמתי בבוקר לתפילה 🌞': {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1},
    'צחצחתי שיניים 🪥': {'בוקר': 2, 'ערב': 2},
    'למדתי תורה 📖': {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90},
    'מתח ברצף 💪': {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10},
    'שכיבות סמיכה ברצף 💪': {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5},
    'כפיפות בטן 💪': {'5': 1, '10': 2, '15': 3, '20': 4, '25': 5, '30': 6, '35': 7, '40': 8, '45': 9, '50': 10},
    'אכלתי פרי 🍇': {'פרי אחד': 1},
    'אכלתי ירק 🥕': {'ירק אחד': 2},
    'הלכתי לישון 😴': {'21:30': 5, '22:00': 3, '23:00': 1},
    'עבודות חופש 📚': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8, 'שעה וחצי': 13, 'שעתיים': 20},
    'רכבתי על אופניים 🚴': {'10 דקות': 2},
    'הלכתי 🚶‍♂️': {'רבע שעה': 1},
    'שחיתי בבריכה 🏊': {'בריכה 1': 1, 'בריכות 2': 2, 'בריכות 3': 3, 'בריכות 4': 4, 'בריכות 5': 5, 'בריכות 6': 6, 'בריכות 7': 7, 'בריכות 8': 8, 'בריכות 9': 9, 'בריכות 10': 10},
    'שיחקתי בכדור 🏀': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8},
    'הכנתי סלט למשפחה 🥗': {'פעם אחת': 1},
    'הכנתי ארוחה מבושלת למשפחה 🍲': {'בוקר': 2, 'צהריים': 4, 'ערב': 3},
    'שתיתי מים 🚰': {'2 ליטר': 1},
    'עזרתי בבית 🧹': {'5 דקות': 1, '10 דקות': 2, '20 דקות': 5}
};

// שליפת אלמנטים מה-DOM
const userSelect = document.getElementById('userSelect'); // תיבת בחירת משתמש
const activitySelect = document.getElementById('activitySelect'); // תיבת בחירת פעילות
const optionSelect = document.getElementById('optionSelect'); // תיבת בחירת אפשרות פעילות
const totalScoreDiv = document.getElementById('totalScore'); // הצגת ניקוד כולל
const userScoreDiv = document.getElementById('userScore'); // הצגת ניקוד למשתמש נבחר
const togetherCheckbox = document.getElementById('togetherCheckbox'); // צ'קבוקס לביצוע יחד
const historyUserSelect = document.getElementById('historyUserSelect'); // תיבת בחירת משתמש להצגת היסטוריה

// הוספת אפשרות "הכל" להיסטוריית הפעילויות
const allOption = document.createElement('option');
allOption.value = 'all';
allOption.textContent = 'הכל';
historyUserSelect.appendChild(allOption);

// מילוי תיבות הבחירה במשתמשים ובאפשרויות
users.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user;
    opt.textContent = user;
    userSelect.appendChild(opt);

    const opt2 = document.createElement('option');
    opt2.value = user;
    opt2.textContent = user;
    historyUserSelect.appendChild(opt2);
});

// מילוי תיבת הבחירה בפעילויות
Object.keys(activities).forEach(activity => {
    const opt = document.createElement('option');
    opt.value = activity;
    opt.textContent = activity;
    activitySelect.appendChild(opt);
});

// ברירת מחדל להצגת אפשרויות לפעילות הראשונה
activitySelect.value = Object.keys(activities)[0];
populateOptions(); // מילוי אפשרויות הפעולה בהתאם לבחירה

// אירועים לשינוי בחירה בתיבה
historyUserSelect.addEventListener('change', renderActivityHistory); // שינוי משתמש היסטוריה
activitySelect.addEventListener('change', populateOptions); // שינוי פעילות

// מילוי אפשרויות בהתאם לפעילות שנבחרה
function populateOptions() {
    optionSelect.innerHTML = ''; // ניקוי קודם
    const options = activities[activitySelect.value];
    if (!options) return;
    Object.keys(options).forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        optionSelect.appendChild(opt);
    });
}

// שמירת פעולה חדשה במסד הנתונים
function saveData() {
    const user = userSelect.value;
    const activity = activitySelect.value;
    const option = optionSelect.value;
    const didTogether = togetherCheckbox.checked;

    // בדיקת תקינות
    if (user === '' || activity === '' || option === '') {
        alert('בחר הכל!');
        return;
    }

    let points = activities[activity][option]; // ניקוד בסיסי
    if (didTogether) {
        points = Math.round(points * 1.5); // הכפלת ניקוד אם בוצע יחד
    }

    const now = new Date(); // תאריך ושעה נוכחיים
    const activityData = {
        user,
        name: activity,
        option,
        amount: points,
        date: now.toLocaleDateString('he-IL'),
        time: now.toLocaleTimeString('he-IL'),
        withSomeone: didTogether
    };

    const newActivityKey = database.ref().child('activityHistory').push().key; // יצירת מפתח חדש בהיסטוריה
    database.ref('activityHistory/' + newActivityKey).set(activityData) // שמירת הפעולה
        .catch(err => console.error('שגיאה בהוספת היסטוריה:', err));

    // עדכון ניקוד אישי וכללי
    database.ref('scores/' + user).once('value').then(snapshot => {
        let currentUserScore = snapshot.val() || 0;
        let newUserScore = currentUserScore + points;
        database.ref('scores/' + user).set(newUserScore)
            .catch(err => console.error('שגיאה בעדכון ניקוד משתמש:', err));

        database.ref('scores/total').once('value').then(totalSnap => {
            let currentTotal = totalSnap.val() || 0;
            let newTotal = currentTotal + points;
            database.ref('scores/total').set(newTotal)
                .then(() => {
                    updateDisplay(); // רענון הצגת ניקוד
                    renderActivityHistory(); // רענון היסטוריה
                })
                .catch(err => console.error('שגיאה בעדכון ניקוד כולל:', err));
        }).catch(err => console.error('שגיאה בקריאת ניקוד כולל:', err));
    }).catch(err => console.error('שגיאה בקריאת ניקוד משתמש:', err));
}

// הצגת ניקוד משתמש נבחר
function setUserScoreDisplay(user) {
    database.ref('scores/' + user).once('value')
        .then(snapshot => {
            userScoreDiv.textContent = user ? `${user} עשה: ${(snapshot.val() || 0)} נקודות` : '';
        })
        .catch(err => console.error('שגיאה בהצגת ניקוד משתמש:', err));
}

// הצגת ניקוד כללי
function setTotalScoreDisplay() {
    database.ref('scores/total').once('value')
        .then(snapshot => {
            totalScoreDiv.textContent = 'ניקוד כללי: ' + (snapshot.val() || 0);
        })
        .catch(err => console.error('שגיאה בהצגת ניקוד כולל:', err));
}

// רענון תצוגות הניקוד
function updateDisplay() {
    setTotalScoreDisplay();
    setUserScoreDisplay(userSelect.value);
}

// הצגת היסטוריית פעילויות בהתאם למשתמש שנבחר
function renderActivityHistory() {
    const historyContainer = document.getElementById('activity-history');
    historyContainer.innerHTML = ''; // ניקוי קודם

    const selectedUser = historyUserSelect.value; // המשתמש שנבחר להיסטוריה

    database.ref('activityHistory').once('value')
        .then(snapshot => {
            const historyData = snapshot.val();
            if (!historyData) return;

            const activitiesList = Object.values(historyData).filter(activity => {
                return selectedUser === 'all' || activity.user === selectedUser;
            });

            // מיון לפי תאריך ושעה (מהחדש לישן)
            activitiesList.sort((a, b) => {
                const parseDate = str => {
                    const [day, month, year] = str.split('/');
                    return new Date(`${year}-${month}-${day}`);
                };
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateB - dateA || b.time.localeCompare(a.time);
            });

            // יצירת אלמנטים להצגה בדף
            activitiesList.forEach(activity => {
                const li = document.createElement('li');
                li.className = 'bg-gray-100 p-2 rounded shadow mb-2';
                li.innerHTML = `
                    <p><strong>${activity.name} - ${activity.option}</strong> - ${activity.amount} נקודות</p>
                    <p class="text-sm text-gray-600">${activity.date} בשעה ${activity.time} - משתמש: ${activity.user}</p>
                    ${activity.withSomeone ? '<p class="text-sm text-blue-600">בוצע עם מישהו נוסף</p>' : ''}
                `;
                historyContainer.appendChild(li);
            });
        })
        .catch(err => console.error('שגיאה בקריאת היסטוריה:', err));
}

// רענון ראשוני של ניקוד והיסטוריה בעת טעינת הדף
updateDisplay();
renderActivityHistory();

// חשיפת פונקציית saveData לגלובל (לשימוש מהכפתור)
window.saveData = saveData;
