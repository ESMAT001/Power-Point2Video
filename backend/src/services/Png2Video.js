
const fs = require('fs');
const path = require('path');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { BASE_PATH } = require("../utils")

class Png2video {

    constructor(id, voices) {
        this.voices = voices;
        this.error = null;
        this.id = id;
        this.ffmpeg = createFFmpeg({ log: true });
        fs.mkdirSync(path.join(BASE_PATH, 'temp', id.toString(), 'short_videos'), { recursive: true });
        this.length = fs.readdirSync(path.join(BASE_PATH, 'temp', this.id.toString(), 'images')).length;
    }


    releaseResources() {
        const pathToDelete = path.join(BASE_PATH, 'temp', this.id.toString());
        if (fs.existsSync(pathToDelete)) {
            //delete pathToDelete
            fs.rmdirSync(pathToDelete, { recursive: true, force: true });
        }
    }


    async joinShortVideos() {
        const id = this.id;
        const ffmpeg = this.ffmpeg;
        const outputPath = path.join(BASE_PATH, 'temp', id.toString(), `video.mp4`);
        const shortVideosPath = path.join(BASE_PATH, 'temp', id.toString(), 'short_videos');

        let txt = '';
        for (let i = 0; i < this.length; i += 1) {
            txt += `file '${id}_${i + 1}.mp4'\n`;
            ffmpeg.FS('writeFile', `${id}_${i + 1}.mp4`, await fetchFile(path.join(shortVideosPath, `${id}_${i + 1}.mp4`)));
        }

        const inputFilesTxtPath = path.join(BASE_PATH, 'temp', id.toString(), 'short_videos', "inputFiles.txt")
        fs.writeFileSync(inputFilesTxtPath, txt)
        ffmpeg.FS('writeFile', `input.txt`, await fetchFile(inputFilesTxtPath));

        await ffmpeg.run('-f', 'concat', "-safe", "0", '-i', 'input.txt', '-c', 'copy', 'result.mp4');

        for (let i = 0; i < this.length; i += 1) {
            ffmpeg.FS('unlink', `${id}_${i + 1}.mp4`);
        }

        await fs.promises.writeFile(outputPath, ffmpeg.FS('readFile', 'result.mp4'));
        return outputPath;
    }


    async joinVoiceWithSlideImage(slidePath, voice, slideNumber) {
        const id = this.id;
        const ffmpeg = this.ffmpeg;

        const outputPath = path.join(BASE_PATH, 'temp', id.toString(), 'short_videos', `${id}_${slideNumber}.mp4`);

        ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(voice.voice));
        ffmpeg.FS('writeFile', `image.png`, await fetchFile(slidePath));

        await ffmpeg.run('-framerate', '10', "-loop", "1", '-i', 'image.png', '-i', 'audio.mp3', '-c:a', 'copy', '-preset', 'ultrafast', "-speed", "8", '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', `${id}_${slideNumber}.mp4`);

        ffmpeg.FS('unlink', 'audio.mp3');
        ffmpeg.FS('unlink', 'image.png');

        await fs.promises.writeFile(outputPath, ffmpeg.FS('readFile', `${id}_${slideNumber}.mp4`));
    }

    async createShortVideo() {
        for (let index = 0; index < this.length; index++) {

            const slideNumber = index + 1;
            const slidePath = path.join(BASE_PATH, 'temp', this.id.toString(), 'images', `${this.id}_${slideNumber}.png`);
            const voice = this.voices[index];

            await this.joinVoiceWithSlideImage(slidePath, voice, slideNumber);
        }
    }


    async convert() {

        try {
            await this.ffmpeg.load();
            await this.createShortVideo();
            return await this.joinShortVideos();
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = Png2video;