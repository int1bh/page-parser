const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cheerio = require("cheerio");
const axios = require("axios");
const config = require("config");

const app = express();

app.use(express.static(path.join(__dirname, 'front')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    let origins = [
        'http://localhost',
        'http://localhost:8080',
        'http://localhost:5000'
    ];

    for(let i = 0; i < origins.length; i++){
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'front', 'dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'front', 'dist', 'index.html'))
    })
}


const PORT = config.get('port') || 5000

app.post('/api/info', async (req, res) => {
    async function getCssFiles(url) {
        try {
            // Выполняем GET-запрос для получения HTML-страницы
            const response = await axios.get(url);
            // Создаем экземпляр объекта Cheerio для работы с HTML
            const $ = cheerio.load(response.data);
            // Получаем все элементы link на странице
            const linkElements = $('link');
            // Создаем пустой массив для хранения ссылок на CSS-файлы
            const cssFiles = [];
            // Проходимся по каждому элементу link
            linkElements.each((index, element) => {
                const rel = $(element).attr('rel');
                const href = $(element).attr('href');

                // Проверяем, что тип элемента - stylesheet
                if (rel === 'stylesheet' && href) {
                    cssFiles.push(href);
                }
            });
            // Возвращаем массив CSS-файлов
            return cssFiles;
        } catch (error) {
            return [];
        }
    }

    async function getJsFiles(url) {
        try {
            // Выполняем GET-запрос для получения HTML-страницы
            const response = await axios.get(url);
            // Создаем экземпляр объекта Cheerio для работы с HTML
            const $ = cheerio.load(response.data);
            // Получаем все элементы link на странице
            const linkElements = $('script');
            // Создаем пустой массив для хранения ссылок на js-файлы
            const jsFiles = [];
            // Проходимся по каждому элементу link
            linkElements.each((index, element) => {
                const src = $(element).attr('src');
                if (src) {
                    // Добавляем ссылку на js-файл в массив
                    jsFiles.push(src);
                }
            });

            // Возвращаем массив js-файлов
            return jsFiles;
        } catch (error) {
            return [];
        }
    }

    const [css, js] = await Promise.all([getCssFiles(req.body.url), getJsFiles(req.body.url)]);

    res.send(JSON.stringify({css, js}));
})

app.listen(PORT, () => console.log('Сервер запущен на http://127.0.0.1:' + PORT));