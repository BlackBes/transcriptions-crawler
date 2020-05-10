const fs = require('fs');

function log(message) {
        return fs.writeFileSync('./results.json', message);
}

function dump(message) {
        return fs.writeFileSync('./dumped.json', message);
}

module.exports = {
        log,
        dump
};