const port = 8080;
const psuedoHost = "http://stellanoxsolutions.com/";
const defaultShowHeaderFooter = false;
const defaultFormat = "letter";

var http = require("http");
var puppeteer = require('puppeteer');
var fileSystem = require('fs');
var url = require("url");
var qs = require('querystring');

function isValidURL(host) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(host);
}

// define server
var server = http.createServer(function (request, response) {
    try {
        var url_parts = url.parse(request.url);
        var parameters = qs.parse(url_parts.query);

        var host = parameters.host 
            ? parameters.host
            : psuedoHost;
        var showHeaderFooter = parameters.showHeaderFooter
            ? parameters.showHeaderFooter
            : defaultShowHeaderFooter;
        var format = parameters.format
            ? parameters.format
            : defaultFormat;

        //get PDF body from request
        let doc = [];
        request.on('data', (chunk) => {
            doc.push(chunk);
        }).on('end', () => {
            doc = Buffer.concat(doc).toString();
        });

        //assume fileExist inorder to create a unique file
        var fileExist = true;
        var fileName = "";
        while (fileExist) {
            var id = Math.random() * (100000);
            fileName = 'page' + id + '.pdf';
            fileExist = fileSystem.exists(fileName);
        }

        (async () => {
            // set up to generate PDF
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            
            // In order to prevent the URL from the footer from saying About:Blank 
            // we need to intercept make a request to a desired url and use our own
            // content.
            await page.setRequestInterception(true);
            page.once('request', req => {
                req.respond({ body: doc });
            });
            if (isValidURL(host)) {
                await page.goto(host);
            }else{
                await page.goto(psuedoHost);
            }

            // Create PDF from our "web page"
            await page.pdf({
                path: fileName,
                format: format,
                margin: { top: '1cm', bottom: '1cm', left: '.5cm', right: '.5cm' },
                displayHeaderFooter: showHeaderFooter
            });

            // Send File back to the requester
            var stat = fileSystem.statSync(fileName);
            response.writeHead(200,
                {
                    'Content-Type': 'application/pdf',
                    'Content-Length': stat.size,
                    'filename': fileName
                });
            var readStream = fileSystem.createReadStream(fileName);
            readStream.pipe(response);

            // delete local file after file sent
            fileSystem.unlink(fileName);
            browser.close();
            // and we are done
        })();
    } catch (e) {
        // catch all exceptions and return a error message to avoid a crash.
        response.writeHead(500);
        response.end(e);
    }
});
//start server
server.listen(port);
console.log("PDF Generation Service listening on port: " + port);
