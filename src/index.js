const Downloader = require("nodejs-file-downloader");

const express = require("express");
const app = express();
const gasRoutes = require('./routes/gas.routes');
const touristsRoutes = require('./routes/tourists.routes');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/gas', gasRoutes);
app.use('/tourists', touristsRoutes);


app.set('port', process.env.port || 5000);

app.listen(app.get('port'), () => {
    console.log('Server on port 5000');    
})

const targetFile = '.\\src\\data\\'  
const dataUrlGas = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
const dataUrlTourists = 'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/52046?tip=AM'


const downloaderGas = new Downloader({
      url:  dataUrlGas, //If the file name already exists, a new file with the name 200MB1.zip is created.
      directory: targetFile, //This folder will be created, if it doesn't exist.
      cloneFiles: false, //If the file already exists, it will be overwritten.
      fileName: "gas.json"
});

const downloaderTourists = new Downloader({
    url:  dataUrlTourists, //If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: targetFile, //This folder will be created, if it doesn't exist.
    cloneFiles: false, //If the file already exists, it will be overwritten.
    fileName: "tourists.json"
});

function downloadFile(){
    downloaderGas.download().then(() => {
        console.log("File downloaded!");
    }).catch((e) => {
        console.log(e);
    });

    downloaderTourists.download().then(() => {
        console.log("File downloaded!");
    }).catch((e) => {
        console.log(e);
    });
}

setInterval(downloadFile, 8.64e+7);




