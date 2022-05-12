
const Ppt2png = require('../services/Ppt2Png');
const path = require('path');
const { BASE_PATH, makeDirectory } = require('../utils');

module.exports = async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).send('No files were uploaded.');

    const file = req.files.file;
    const fileType = file.name.split('.').pop();

    if (fileType !== 'ppt' && fileType !== 'pptx') return res.status(400).send('File type is not supported.');

    const id = Date.now();
    const fileUploadPath = path.join(BASE_PATH, `/temp/${id}/ppt/`, `${id}.${fileType}`);

    const directories = [
        path.join(BASE_PATH, `/temp/${id}/ppt`),
        path.join(BASE_PATH, `/temp/${id}/pdf`),
        path.join(BASE_PATH, `/temp/${id}/images`),
    ]

    makeDirectory(directories);

    file.mv(fileUploadPath, async (err) => {

        if (err) return res.status(500).send(err);

        const ppt2png = new Ppt2png(fileUploadPath, id);
        const conversionResult = await ppt2png.convert();

        res.send(conversionResult);
        ppt2png.releaseStorage({ paths: directories.slice(0, 2) });

    })

}