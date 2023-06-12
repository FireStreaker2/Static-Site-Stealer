const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/search/:url", async (req, res) => {
    const requestedUrl = `http://${req.params.url}`;

    try {
        const response = await axios.get(requestedUrl);
        const html = response.data;

        const $ = cheerio.load(html);

        $("[src],[href]").each(function () {
            const element = $(this);
            const attributes = ["src", "href"];

            attributes.forEach((attribute) => {
                if (element.attr(attribute)) {
                    const relativeUrl = element.attr(attribute);
                    const absoluteUrl = url.resolve(requestedUrl, relativeUrl);
                    element.attr(attribute, absoluteUrl);
                }
            });
        });

        res.send($.html());
    } catch (error) {
        res.status(500).send("Error fetching the HTML.");
        console.log(error);
    }
});

app.get("/simple/:url", async (req, res) => {
    const url = `http://${req.params.url}`;

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error fetching the HTML.");
    }
});

app.get("/iframe/:url", (req, res) => {
    const url = req.params.url;
    res.send(`
    <!DOCTYPE HTML>
    <html>
        <head>
            <title>Static Site Stealer</title>
        </head>
    <!-- https://github.com/FireStreaker2/Static-Site-Stealer --> 
    <style>
        * {
            margin: 0;
            overflow: hidden;
        }

        iframe {
            width: 100%;
            height: 100vh;
        }

    </style>
    <iframe src="http://${url}"></iframe>
    </html>`);
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});