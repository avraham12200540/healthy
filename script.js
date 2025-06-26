const users = ['אבא', 'אמא', 'יאיר', 'רננה', 'איתן', 'הדר', 'דביר', 'מוריה', 'ראשית', 'שמשון', 'טליה', 'אברהם', 'אבישי', 'שוביה ציון', 'עדיה מאיר', 'נטע', 'יובל', 'עטרה', 'שחרי רחל', 'פאר', 'אחר'];
const activities = {
    'קמתי בבוקר לתפילה 🌞': {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1},
    'צחצחתי שיניים 🦷': {'בוקר': 2, 'ערב': 2},
    'הלכתי לישון 😴': {'21:30': 5, '22:00': 3, '23:00': 1},
    'מתח ברצף 💪': {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10},
    'שכיבות סמיכה ברצף 💪': {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5},
    'כפיפות בטן 💪': {'5': 1, '10': 2, '15': 3, '20': 4, '25': 5, '30': 6, '35': 7, '40': 8, '45': 9, '50': 10},
    'רכבתי על אופניים 🚴': {'10 דקות': 2},
    'הלכתי 🚶‍♂️': {'רבע שעה': 1},
    'רצתי 🏃‍♂️': {'רבע שעה': 5},
    'שחיתי בבריכה 🏊': {'בריכה 1': 1, 'בריכות 2': 2, 'בריכות 3': 3, 'בריכות 4': 4, 'בריכות 5': 5, 'בריכות 6': 6, 'בריכות 7': 7, 'בריכות 8': 8, 'בריכות 9': 9, 'בריכות 10': 10},
    'שיחקתי בכדור 🏀': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8},
    'תופפתי קשה 🥁': {'רבע שעה': 1},
    'אכלתי פרי 🍇': {'פרי אחד': 1},
    'אכלתי ירק 🥕': {'ירק אחד': 2},
    'שתיתי מים 🚰': {'2 ליטר': 1},
    'הכנתי סלט למשפחה 🥗': {'פעם אחת': 1},
    'השתתפתי בארוחה משפחתית 👨‍👩‍👧‍👦': {'בוקר/צהריים/ערב': 1},
    'הכנתי ארוחה מבושלת למשפחה 🍲': {'בוקר': 2, 'צהריים': 4, 'ערב': 3},
    'עזרתי בבית 🧹': {'5 דקות': 1, '10 דקות': 2, '20 דקות': 5},
    'למדתי תורה 📖': {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90},
    'עבודות חופש 📚': {'רבע שעה': 1, 'חצי שעה': 3, 'שעה': 8, 'שעה וחצי': 13, 'שעתיים': 20}

};

// הגדרת קטגוריות הפעילויות
const activityCategories = {
    'בריאות יומית': [
        'קמתי בבוקר לתפילה 🌞', 'צחצחתי שיניים 🦷', 
        'הלכתי לישון 😴'
    ],
    'פעילות גופנית': [
      'מתח ברצף 💪', 'שכיבות סמיכה ברצף 💪', 'כפיפות בטן 💪', 'רכבתי על אופניים 🚴', 'הלכתי 🚶‍♂️', 'רצתי 🏃‍♂️', 'שחיתי בבריכה 🏊', 'שיחקתי בכדור 🏀', 'תופפתי קשה 🥁'
    ],
    'תזונה בריאה': [
        'אכלתי פרי 🍇', 'אכלתי ירק 🥕' ,'שתיתי מים 🚰'
    ],
    'פעילויות משפחתיות ובית': [
        'הכנתי סלט למשפחה 🥗', 'השתתפתי בארוחה משפחתית 👨‍👩‍👧‍👦', 
        'הכנתי ארוחה מבושלת למשפחה 🍲', 'עזרתי בבית 🧹'
    ],
  
     'לימוד תורה': [
        'למדתי תורה 📖'
    ],
      'לימודים ופיתוח אישי': [
        'עבודות חופש 📚'
    ]
};

// מפה הפוכה - מפעילות לקטגוריה
const activityToCategory = {};
Object.keys(activityCategories).forEach(category => {
    activityCategories[category].forEach(activity => {
        activityToCategory[activity] = category;
    });
});



const userSelect = document.getElementById('userSelect');
const activitySelect = document.getElementById('activitySelect');
const optionSelect = document.getElementById('optionSelect');
const totalScoreDiv = document.getElementById('totalScore');
const userScoreDiv = document.getElementById('userScore');
const togetherCheckbox = document.getElementById('togetherCheckbox'); // חדש
const suggestionsRef = database.ref('suggestions');

// מילוי dropdowns
users.forEach(user => {
    const opt = document.createElement('option');
    opt.value = user;
    opt.textContent = user;
    userSelect.appendChild(opt);
});
userSelect.value = users[0]; // בחירת ברירת מחדל

Object.keys(activities).forEach(activity => {
    const opt = document.createElement('option');
    opt.value = activity;
    opt.textContent = activity;
    activitySelect.appendChild(opt);
});

// ברירת מחדל לאקטיביטי
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
    const didTogether = togetherCheckbox.checked;

    if (!user || !activity || !option) {
        alert('בחר הכל!');
        return;
    }

// שמירת הפעילות תחת userActivities
const activityRecord = {
    activity: activity,
    option: option,
    timestamp: Date.now()
};
database.ref('userActivities/' + user).push(activityRecord);

    
    let points = activities[activity][option];
    if (didTogether) points = Math.round(points * 1.5);

    toggleSavingIndicator(true);

    // עדכון ניקוד המשתמש
    database.ref('scores/' + user).once('value').then(snapshot => {
        let currentUserScore = snapshot.val() || 0;
        let newUserScore = currentUserScore + points;
        database.ref('scores/' + user).set(newUserScore).catch(handleFirebaseError);
        
        // עדכון הניקוד הכללי
        database.ref('scores/total').once('value').then(totalSnap => {
            let currentTotal = totalSnap.val() || 0;
            let newTotal = currentTotal + points;
            database.ref('scores/total').set(newTotal).catch(handleFirebaseError);
            
            // עדכון ניקוד הקטגוריה
            const category = activityToCategory[activity];
            if (category) {
                database.ref('categoryScores/' + category).once('value').then(categorySnap => {
                    let currentCategoryScore = categorySnap.val() || 0;
                    let newCategoryScore = currentCategoryScore + points;
                    database.ref('categoryScores/' + category).set(newCategoryScore).catch(handleFirebaseError);
                    updateDisplay();
                    updateCategoryDisplay();
                });
            } else {
                updateDisplay();
            }
        });
    }).finally(() => toggleSavingIndicator(false));
}

function submitPrizeSuggestion() {
    const prizeInput = document.getElementById('prizeInput');
    const suggestionText = prizeInput.value.trim();
    const user = userSelect.value;

    if (!suggestionText) {
        alert('כתוב הצעה!');
        return;
    }

    suggestionsRef.push({
        text: suggestionText,
        user: user,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    prizeInput.value = '';
}


// פונקציה לפורמט תאריך
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// פונקציה להצגת "לפני X זמן"
function timeAgo(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'לפני פחות מדקה';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `לפני ${diffMin} דקות`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `לפני ${diffHour} שעות`;
  const diffDay = Math.floor(diffHour / 24);
  return `לפני ${diffDay} ימים`;
}

// שליפת 5 הפעילויות האחרונות מכל המשתמשים
function fetchLastFiveActivities() {
  return database.ref('userActivities')
    .once('value')
    .then(snapshot => {
      const activities = [];
      snapshot.forEach(userSnap => {
        userSnap.forEach(activitySnap => {
          const activity = activitySnap.val();
          activity.user = userSnap.key;
          activities.push(activity);
        });
      });
      activities.sort((a, b) => b.timestamp - a.timestamp);
      return activities.slice(0, 5);
    });
}

// הצגת הפעילויות
function renderActivities(activities) {
  const activitiesList = document.getElementById('recent-activities');
  activitiesList.innerHTML = '';
  activities.forEach(activity => {
    const li = document.createElement('li');
    const timeStr = activity.timestamp
      ? `${formatTimestamp(activity.timestamp)} | ${timeAgo(activity.timestamp)}`
      : '';
    li.textContent = `[${activity.user}] ${activity.activity || activity.option || "פעילות ללא שם"}${timeStr ? ` (${timeStr})` : ''}`;
    activitiesList.appendChild(li);
  });
}

// קריאה ראשונית להצגת הפעילויות כשנטען הדף
document.addEventListener('DOMContentLoaded', () => {
  fetchLastFiveActivities().then(renderActivities);
});




function displaySuggestions(suggestions) {
    const list = document.getElementById('suggestionsList');
    list.innerHTML = '';

    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        const date = new Date(suggestion.timestamp);
        li.innerHTML = `
            <strong>${suggestion.text}</strong>
            <small>הוצע ע"י ${suggestion.user} ב-${date.toLocaleString('he-IL')}</small>
        `;
        list.appendChild(li);
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
    
    // עדכון תצוגת הקטגוריות
    updateCategoryDisplay();
}



function toggleSavingIndicator(isSaving) {
    const saveButton = document.querySelector('button[onclick="saveData()"]');
    saveButton.textContent = isSaving ? 'שומר...' : 'שמור פעילות';
    saveButton.classList.toggle('saving', isSaving);
}

function handleFirebaseError(error) {
    console.error("שגיאת Firebase:", error);
    alert('אירעה שגיאה. נסה שוב.');
}

function updateCategoryDisplay() {
    Object.keys(activityCategories).forEach(category => {
        database.ref('categoryScores/' + category).on('value', snapshot => {
            const score = snapshot.val() || 0;
            const categoryElement = document.getElementById('category-' + category.replace(/\s+/g, '-'));
            if (categoryElement) {
                categoryElement.textContent = `${category}: ${score} נקודות`;
            }
            // קריאה לעדכון שמות המשתמשים
            updateCategoryUsers();
        });
    });
}


function updateCategoryUsers() {
    const categoryUsers = {};
    // אתחול לכל קטגוריה
    Object.keys(activityCategories).forEach(category => {
        categoryUsers[category] = new Set();
    });

    // שליפת כל הפעילויות מה־Firebase
    database.ref('userActivities').once('value').then(snapshot => {
        snapshot.forEach(userSnap => {
            const user = userSnap.key;
            userSnap.forEach(activitySnap => {
                const activity = activitySnap.val().activity;
                const category = activityToCategory[activity];
                if (category) {
                    categoryUsers[category].add(user);
                }
            });
        });

        // עדכון ה־DOM
        Object.keys(categoryUsers).forEach(category => {
            const usersArray = Array.from(categoryUsers[category]);
            const categoryDiv = document.getElementById('category-' + category.replace(/\s+/g, '-'));
            if (categoryDiv) {
                let usersText = usersArray.length > 0 ? 'בוצע על ידי: ' + usersArray.join(', ') : 'לא בוצע עדיין';
                let usersSpan = categoryDiv.querySelector('.category-users');
                if (!usersSpan) {
                    usersSpan = document.createElement('div');
                    usersSpan.className = 'category-users handwriting';
                    usersSpan.style.fontSize = '12px';
                    usersSpan.style.marginTop = '5px';
                    categoryDiv.appendChild(usersSpan);
                }
                usersSpan.textContent = usersText;
            }
        });
    });
}



// טעינת הצעות פרסים בזמן אמת
suggestionsRef.orderByChild('timestamp').on('value', (snapshot) => {
    const suggestions = [];
    snapshot.forEach(childSnap => {
        suggestions.push(childSnap.val());
    });
    suggestions.sort((a, b) => b.timestamp - a.timestamp);
    displaySuggestions(suggestions);
});

userSelect.addEventListener('change', updateDisplay);
updateDisplay();
window.saveData = saveData;
window.submitPrizeSuggestion = submitPrizeSuggestion;
