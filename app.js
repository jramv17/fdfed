// app.js
const App = require('./index'); // The class you defined
const appInstance = new App(); // instantiate it

module.exports = appInstance.app; // ✅ export the actual Express app
