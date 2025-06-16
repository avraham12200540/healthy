
const { useState, useEffect } = React;

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

const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem('scores') || '{}'));
  const [dailyLog, setDailyLog] = useState(() => JSON.parse(localStorage.getItem('dailyLog') || '{}'));

  useEffect(() => { localStorage.setItem('scores', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { localStorage.setItem('dailyLog', JSON.stringify(dailyLog)); }, [dailyLog]);

  const getToday = () => new Date().toISOString().split('T')[0];

  const save = () => {
    if (!selectedUser || !selectedActivity || !selectedOption) return;
    const points = activities[selectedActivity][selectedOption];
    const newScores = { ...scores, [selectedUser]: (scores[selectedUser] || 0) + points, total: (scores.total || 0) + points };
    setScores(newScores);

    const today = getToday();
    const dayLog = { ...(dailyLog[today] || {}) };
    dayLog[selectedUser] = (dayLog[selectedUser] || 0) + points;
    setDailyLog({ ...dailyLog, [today]: dayLog });

    setSelectedActivity('');
    setSelectedOption('');
  };

  const renderSummary = () => {
    const today = getToday();
    const todayLog = dailyLog[today] || {};
    return users.map(user => <div key={user}>{user}: {todayLog[user] || 0} נק'</div>);
  };

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'מבצע הבריאות של משפחת גלסר'),
      React.createElement('div', null, 'ניקוד כללי: ', scores.total || 0),
      !selectedUser ? users.map(user =>
        React.createElement('button', { key: user, onClick: () => setSelectedUser(user) }, user)
      ) :
      React.createElement(React.Fragment, null,
        React.createElement('h2', null, `${selectedUser} - ניקוד אישי: ${scores[selectedUser] || 0}`),
        React.createElement('select', { value: selectedActivity, onChange: e => setSelectedActivity(e.target.value) },
          React.createElement('option', { value: '' }, 'בחר פעילות'),
          Object.keys(activities).map(act => React.createElement('option', { key: act, value: act }, act))
        ),
        selectedActivity && React.createElement('select', { value: selectedOption, onChange: e => setSelectedOption(e.target.value) },
          React.createElement('option', { value: '' }, 'בחר אפשרות'),
          Object.keys(activities[selectedActivity]).map(opt => React.createElement('option', { key: opt, value: opt }, opt))
        ),
        React.createElement('button', { onClick: save }, 'שמור פעילות'),
        React.createElement('button', { onClick: () => setSelectedUser('') }, 'החלף משתמש')
      ),
      React.createElement('div', null, renderSummary())
    )
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
