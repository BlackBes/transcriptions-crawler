const fs = require('fs');

function log(message) {
        return fs.appendFileSync('./results.json', message);
}

module.exports = {
        log
};