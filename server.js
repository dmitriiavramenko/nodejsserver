/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Dmitrii Avramenko Student ID: 128138203 Date: 01.11.2021
*
* Online (Heroku) Link: https://dmitriiavramenko.herokuapp.com/
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var path = require('path');
var fs = require('fs');
var multer = require('multer')
var data_service = require("./data-service.js");
var express = require("express");
var app = express();
app.use(express.static('public'));
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
    res.sendFile(__dirname + "/views/home.html");
});
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});
app.get("/employees", (req, res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("message: " + err);
        });
    }
    else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("message: " + err);
        });
    }
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("message: " + err);
        });
    } else {
        data_service.getAllEmployees().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("message: " + err);
        })
    }
});
app.get("/employee/:value", function (req, res) {
    data_service.getEmployeesByNum(req.params.employeeNum).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("message: " + err);
    })
});
app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("message: " + err);
    })
});
app.get("/employees/add", (req, res) => {
    res.sendFile(__dirname + path.join('/views', 'addEmployee.html'));
});
app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    });
});
app.get("/images", function (req, res) {
    fs.readdir((path.join(__dirname, "/public/images/uploaded")), function (err, items) {
        res.json(items);
    });
});
app.post("/images/add", upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});
app.get("/images/add", (req, res) => {
    res.sendFile(__dirname + path.join('/views', 'addImage.html'));
});
app.get("/managers", (req, res) => {
    data_service.getManagers().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("message: " + err);
    })
});
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
data_service.initialize().then(function() {app.listen(HTTP_PORT, onHttpStart)}).catch((err) => {console.log(err)});