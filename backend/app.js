//initialize express app
const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ppt2pngController = require("./src/controllers/ppt2png.controller");
const png2videoController = require('./src/controllers/png2video.controller');
const deleteController = require('./src/controllers/delete.controller');

const port = process.env.PORT || 3001

app.use(express.json());
app.use(fileUpload())
app.use(cors());

app.route('/ppt2png').post(ppt2pngController)
app.route("/png2video/:id").post(png2videoController)
app.route("/delete/:id").all(deleteController)


app.listen(port, () => {
    console.log(`server started on port ${port}`)
})