const { apiPort } = require('./config/env.js')
const app = require('./app');

app.listen(apiPort, () => {
    console.log(`Server listen on port ${apiPort}`)
});