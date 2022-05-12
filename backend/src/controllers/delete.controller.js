const fs = require('fs');
const path = require('path');
const { BASE_PATH } = require('../utils');

module.exports = async (req, res) => {

    const { id } = req.params;
    const pathTobeDeleted = path.join(BASE_PATH, `/temp/${id}`);

    if (fs.existsSync(pathTobeDeleted)) {
        fs.rmdirSync(pathTobeDeleted, { recursive: true, force: true });
        fs.rmdirSync(pathTobeDeleted, { recursive: true, force: true });
        return res.send('success');
    }

    res.send('failed');

}