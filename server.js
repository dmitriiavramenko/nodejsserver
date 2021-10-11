var HTTP_PORT = process.env.PORT || 8080;
var data_service = require("./data-service.js");
var express = require("express");
var app = express();
app.use(express.static('public'));
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});
app.get("/employees", (req, res) => {
    data_service.getAllEmployees().then((data) => {
        res.json(JSON.stringify(data));
    }).catch((err) => {
        res.json(JSON.stringify("message: " + err));
    })
});
app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.json(JSON.stringify(data));
    }).catch((err) => {
        res.json(JSON.stringify("message: " + err));
    })
});
app.get("/managers", (req, res) => {
    data_service.getManagers().then((data) => {
        res.json(JSON.stringify(data));
    }).catch((err) => {
        res.json(JSON.stringify("message: " + err));
    })
});
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
data_service.initialize().then(function() {app.listen(HTTP_PORT, onHttpStart)}).catch((err) => {console.log(err)});