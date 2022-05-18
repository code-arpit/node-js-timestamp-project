// importing modules
const http = require("http");
const fs = require("fs");

const getTimeStamp = date => ({
    unix: date.getTime(),
    utc: date.toUTCString()
});

const requestHandler = (req, res) => {
    if (req.url === "/") {
        fs.readFile("views/index.html", "utf-8", (err, html) => {
            if (err) throw err;;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    } else if (req.url.startsWith("/api/timestamp")) {
        const dateString = req.url.split("/api/timestamp/")[1];
        console.log(req.url)
        console.log(dateString)
        let timestamp;
        let date;


        if (dateString === undefined || dateString.trim() === "") {
            timestamp = getTimeStamp(new Date());
            date = new Date(parseInt(timestamp))
            console.log(timestamp)
        } else {
            date = !isNaN(dateString) ?
                new Date(parseInt(dateString)) :
                new Date(dateString)
            console.log(date)
        }

        if (!isNaN(date.getTime())) {
            timestamp = getTimeStamp(date);
        } else {
            timestamp = {
                eror: "invalid date"
            };
        }

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(timestamp))
    } else {
        fs.readFile("views/404.html", (err, html) => {
            if (err) throw err;

            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(html)
        })
    }
};

const server = http.createServer(requestHandler);
server.listen(process.env.PORT || 4100, err => {
    if (err) {
        console.log(err);
    }

    console.log(`"Server running on PORT ${server.address().port}"`);
});