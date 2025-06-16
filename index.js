const { useState, useEffect } = React;
const { motion } = window['framer-motion'];

const users = ['אבא', 'אמא', 'טליה', 'אברהם', 'אבישי', 'אחר'];

const activities = {
  'קימה בבוקר לתפילה': { options: {'5:45': 10, '6:30': 5, '7:00': 3, '8:00': 1} },
  'צחצוח שיניים': { options: {'בוקר': 2, 'ערב': 2} },
  'לימוד תורה': { options: {'רבע שעה': 5, 'חצי שעה': 15, 'שעה': 30, 'שעתיים': 60, 'שלוש': 90} },
  'מתח ברצף': { options: {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10} },
  'שכיבות סמיכה ברצף': { options: {'2': 1, '4': 2, '6': 3, '8': 4, '10': 5} },
  'אכילת פרי': { options: {'פרי אחד': 1} },
  'אכילת ירק': { options: {'ירק אחד': 2} },
  'הליכה לישון': { options: {'21:30': 5, '22:00': 3, '23:00': 1} },
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

function App() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem('healthScores')) || {});
  const [dailyLog, setDailyLog] = useState(() => JSON.parse(localStorage.getItem('healthDailyLog')) || {});

  useEffect(() => localStorage.setItem('healthScores', JSON.stringify(scores)), [scores]);
  useEffect(() => localStorage.setItem('healthDailyLog', JSON.stringify(dailyLog)), [dailyLog]);

  const handleSave = () => {
    if (!selectedUser || !selectedActivity || !selectedOption) return;
    const points = activities[selectedActivity].options[selectedOption];
    setScores(prev => {
      const newScores = { ...prev };
      newScores[selectedUser] = (newScores[selectedUser] || 0) + points;
      newScores['total'] = (newScores['total'] || 0) + points;
      return newScores;
    });
    const today = getTodayDate();
    setDailyLog(prev => {
      const newLog = { ...prev };
      if (!newLog[today]) newLog[today] = {};
      if (!newLog[today][selectedUser]) newLog[today][selectedUser] = 0;
      newLog[today][selectedUser] += points;
      return newLog;
    });
    setSelectedActivity(''); setSelectedOption('');
  };

  const renderDailySummary = () => {
    const today = getTodayDate();
    const todayLog = dailyLog[today] || {};
    return (
      React.createElement("div", { className: "mt-4" },
        React.createElement("h3", { className: "font-bold" }, `סיכום יומי (${today}):`),
        users.map(user =>
          React.createElement("div", { key: user }, `${user}: ${todayLog[user] || 0} נקודות`)
        )
      )
    );
  };

  return (
    React.createElement("div", { className: "space-y-4" },
      React.createElement("h1", { className: "text-3xl font-extrabold text-purple-700 drop-shadow" }, "מבצע הבריאות של משפחת גלסר"),
      React.createElement("div", { className: "text-xl" }, `ניקוד כללי: ${scores['total'] || 0}`),
      !selectedUser ?
        React.createElement("div", null,
          React.createElement("h2", { className: "text-lg" }, "בחר משתמש:"),
          users.map(user =>
            React.createElement("button", {
              key: user, onClick: () => setSelectedUser(user),
              className: "m-2 p-3 bg-yellow-300 rounded-full shadow hover:scale-105 transition"
            }, user)
          )
        ) :
        React.createElement(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 } },
          React.createElement("h2", { className: "text-lg" }, `${selectedUser} - ניקוד אישי: ${scores[selectedUser] || 0}`),
          React.createElement("select", {
            value: selectedActivity,
            onChange: e => setSelectedActivity(e.target.value),
            className: "p-2 border rounded"
          },
            React.createElement("option", { value: "" }, "בחר פעילות"),
            Object.keys(activities).map(act =>
              React.createElement("option", { key: act, value: act }, act)
            )
          ),
          selectedActivity &&
          React.createElement("select", {
            value: selectedOption,
            onChange: e => setSelectedOption(e.target.value),
            className: "p-2 border rounded mt-2"
          },
            React.createElement("option", { value: "" }, "בחר אפשרות"),
            Object.keys(activities[selectedActivity].options).map(opt =>
              React.createElement("option", { key: opt, value: opt }, opt)
            )
          ),
          React.createElement("button", {
            onClick: handleSave,
            className: "block mt-4 bg-green-400 p-2 rounded-full shadow hover:bg-green-500 transition"
          }, "שמור פעילות"),
          React.createElement("button", {
            onClick: () => setSelectedUser(''),
            className: "block mt-2 text-sm text-blue-600 underline"
          }, "החלף משתמש")
        ),
      renderDailySummary()
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
