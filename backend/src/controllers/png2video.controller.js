const Png2video = require('../services/Png2video');

module.exports = async (req, res) => {

    try {

        const { id } = req.params;
        const { voices } = req.body;

        const png2video = new Png2video(id, voices);
        const videoPath = await png2video.convert()

        res.download(videoPath, (err) => {
            if (err) {
                return new Error('file send failed!')
            }
            png2video.releaseResources();
        });
        
    } catch (error) {
        res.status(500).send({
            error
        })
    }

}

