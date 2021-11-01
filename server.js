/*********************************************************************************
* BTI325 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Dmitrii Avramenko Student ID: 128138203 Date: 10.10.2021
*
* Online (Heroku) Link: https://dmitriiavramenko.herokuapp.com/
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var path = require('path');
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
app.get("/employees/add", (req, res) => {
    res.sendFile(__dirname + path.join('views', 'addEmployee.html'));
});
app.get("/images/add", (req, res) => {
    res.sendFile(__dirname + path.join('views', 'addImage.html'));
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