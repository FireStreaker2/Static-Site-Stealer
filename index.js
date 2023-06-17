const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const link = process.env.LINK || `http://localhost:${port}`

app.get("/", (req, res) => {
    res.send(`<script>window.location.href = "https://github.com/FireStreaker2/Static-Site-Stealer"</script>`);
});

app.get("/search/:url*", async (req, res) => {
    const requestedUrl =  `http://${req.params.url}${req.params[0]}`;

    try {
        const response = await axios.get(requestedUrl, { responseType: "arraybuffer" });
        const contentType = response.headers["content-type"];

        if (contentType.includes("text/html")) {
            const html = response.data.toString();
            const $ = cheerio.load(html);

            $("[src],[href]").each(function() {
                const element = $(this);
                const attributes = ["src", "href"];

                attributes.forEach((attribute) => {
                    if (element.attr(attribute)) {
                        const relativeUrl = element.attr(attribute);
                        var absoluteUrl = url.resolve(requestedUrl, relativeUrl);
                        absoluteUrl = absoluteUrl.replace("https://", "");
                        absoluteUrl = absoluteUrl.replace("http://", "");
                        absoluteUrl = `${link}/search/${absoluteUrl}`;
                        element.attr(attribute, absoluteUrl);
                    }
                });
            });

            res.send($.html());
        } else if (contentType.includes("text/javascript") || contentType.includes("text/css")) {
            const content = response.data.toString();
            var absoluteUrl = url.resolve(requestedUrl, "/");
            absoluteUrl = absoluteUrl.replace("https://", "");
            absoluteUrl = absoluteUrl.replace("http://", "");
            absoluteUrl = `${link}/search/${absoluteUrl}`;
            const modifiedContent = content.replace(/url\((?!['"]?(?:data|https?):)['"]?([^'")]+)['"]?\)/g, `url(${absoluteUrl}$1)`);

            res.set("Content-Type", contentType);
            res.send(modifiedContent);
        } else {
            res.set("Content-Type", contentType);
            res.send(response.data);
        }
    } catch (error) {
        res.status(500).send("Error fetching the HTML.");
        console.log(error);
    }
});

app.get("/simple/:url*", async (req, res) => {
    const url = `http://${req.params.url}${req.params[0]}`;

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error fetching the HTML.");
        console.log(error);
    }
});

app.get("/iframe/:url*", (req, res) => {
    const url = req.params.url + req.params[0];
    res.send(`
    <!-- https://github.com/FireStreaker2/Static-Site-Stealer --> 
    <!DOCTYPE HTML>
    <html>
        <head>
            <title>Static Site Stealer</title>
        </head>
        <body>
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
        </body>
    </html>`);
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});