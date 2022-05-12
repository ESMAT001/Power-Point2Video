
const path = require('path');
const { ppt2pdf } = require("ppt-png");
const { pdfToPng } = require("pdf-to-png-converter");
const buffer2url = require('buffer2url').default;
const fs = require('fs');
const { BASE_PATH } = require('../utils');

class Ppt2png {

    pdfToPngOptions = {
        disableFontFace: false,
        useSystemFonts: true,
        strictPagesToProcess: false,
        viewportScale: 2.0,
    }

    constructor(filePath, id) {
        this.filePath = filePath;
        this.id = id;
    }

    releaseStorage({ paths = null, toEnd = false }) {
        const id = this.id;

        if (toEnd) {
            const tempPath = path.join(BASE_PATH, "temp", id.toString());
            return fs.rmdirSync(tempPath, { recursive: true, force: true });
        }


        paths = paths || [
            path.join(BASE_PATH, `/temp/${id}/ppt`),
            path.join(BASE_PATH, `/temp/${id}/pdf`),
            path.join(BASE_PATH, `/temp/${id}/images`),
        ]

        for (let index = 0; index < paths.length; index++) {
            const tempPath = paths[index];
            if (fs.existsSync(tempPath)) {
                fs.rmdirSync(tempPath, { recursive: true, force: true });
            }

        }

    }


    convertToPdf() {
        ppt2pdf({
            file: { path: this.filePath },
            output: path.join(BASE_PATH, `/temp/${this.id}/pdf`),
        });
    }

    async convertToPng() {

        const pngPage = await pdfToPng(
            path.join(BASE_PATH, `/temp/${this.id}/pdf/`, `${this.id}.pdf`),
            this.pdfToPngOptions
        );

        for (let index = 0; index < pngPage.length; index++) {
            const page = pngPage[index];
            fs.writeFileSync(
                path.join(BASE_PATH, `/temp/${this.id}/images/`, `${this.id}_${index + 1}.png`),
                page.content.toString('base64'),
                { encoding: 'base64' }
            );
        }


        return pngPage.map((page, index) => {
            return {
                slide: index + 1,
                image: buffer2url("image/png", page.content),
                voice: '',
            }
        })
    }

    async convert() {
        try {

            this.convertToPdf();
            const pngPage = await this.convertToPng();
            return { slides: pngPage, id: this.id };

        } catch (error) {
            this.releaseStorage({ toEnd: true });
            console.log(error)
        }
    }

}

module.exports = Ppt2png;