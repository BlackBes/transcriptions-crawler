const fs = require('fs');

function log(message) {
        return fs.writeFileSync('./results.json', message);
}

module.exports = {
        log
};