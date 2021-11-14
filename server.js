/*********************************************************************************
* BTI325 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Dmitrii Avramenko Student ID: 128138203 Date: 14.11.2021
*
* Online (Heroku) Link: https://dmitriiavramenko.herokuapp.com/
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var path = require('path');
var fs = require('fs');
var exphbs = require('express-handlebars');
var multer = require('multer');
var data_service = require("./data-service.js");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });
   
app.engine(".hbs", exphbs.engine({
    extname:".hbs" ,
    helpers: {
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
}}));
app.set("view engine", ".hbs");
var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/employees", (req, res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employees.hbs", {data: data});
        }).catch((err) => {
            res.render({message: err});
        });
    }
    else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees.hbs", {data: data});
        }).catch((err) => {
            res.render({message: err});
        });
    }
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employees.hbs", {data: data});
        }).catch((err) => {
            res.render({message: err});
        });
    } else {
        data_service.getAllEmployees().then((data) => {
            res.render("employees.hbs", {data: data});
        }).catch((err) => {
            res.render({message: err});
        });
    }
});
app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("departments", {data: data})
    }).catch((err) => {
        res.render({message: err});
    })
});
app.post("/employee/update", (req, res) => {
    console.log(req.body);
    data_service.updateEmployee(req.body).then((data) =>{
        res.redirect("/employees");
    })
   })
app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
});
app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    })
});
app.get("/employee/:employeeNum", function (req, res) {
    data_service.getEmployeesByNum(req.params.employeeNum).then((data) => {
        res.render("employee", {employee: data});
    }).catch((err) => {
        res.render("employee", {message:"no results"});
    })
});
app.get("/images", function (req, res) {
    fs.readdir((path.join(__dirname, "/public/images/uploaded")), function (err, items) {
        res.render("images", {data: items});
    });
});
app.post("/images/add", upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});
app.get("/images/add", (req, res) => {
    res.render("addImage")
});
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
data_service.initialize().then(function() {app.listen(HTTP_PORT, onHttpStart)}).catch((err) => {console.log(err)});