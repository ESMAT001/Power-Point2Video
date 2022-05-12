const fs = require('fs');
const path = require('path');

module.exports.BASE_PATH = path.join(__dirname, '../');
module.exports.makeDirectory = (paths) => {
    paths.forEach(path => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    })
}
