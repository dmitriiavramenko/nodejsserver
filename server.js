/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Dmitrii Avramenko Student ID: 128138203 Date: 27.11.2021
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
app.get("/departments", (req, res) => {
    data_service.getDepartments().then((data) => {
        if (data.length > 0)
        res.render("departments.hbs", {data: data});
    else
        res.render("departments.hbs", {message: "No data!"});
    }).catch((err) => {
        res.render({message: err});
    })
});
app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});
app.post("/departments/add", (req, res) => {
    data_service.addDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch(function(){
        res.status(500).send("Unable to Add Department");
    })
});
app.post("/department/update", (req, res) => {
    console.log(req.body);
    data_service.updateDepartment(req.body).then((data) =>{
        res.redirect("/departments");
    }).catch(function(){
        res.status(500).send("Unable to Update Department");
    })
});
app.get("/department/:departmentId", function (req, res) {
    data_service.getDepartmentById(req.params.departmentId).then((data) => {
        if (data == undefined)
            res.status(404).send("Department Not Found");
        else
            res.render("department", {department: data});
    }).catch((err) => {
        res.render("department", {message:"no results"});
    })
});
app.get("/employees", (req, res) => {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            if (data.length > 0)
                res.render("employees.hbs", {data: data});
            else
                res.render("employees.hbs", {message: "No data!"});
        }).catch((err) => {
            res.render({message: err});
        });
    }
    else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            if (data.length > 0)
                res.render("employees.hbs", {data: data});
            else
                res.render("employees.hbs", {message: "No data!"});
        }).catch((err) => {
            res.render({message: err});
        });
    }
    else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            if (data.length > 0)
                res.render("employees.hbs", {data: data});
            else
                res.render("employees.hbs", {message: "No data!"});
        }).catch((err) => {
            res.render({message: err});
        });
    } else {
        data_service.getAllEmployees().then((data) => {
            if (data.length > 0)
                res.render("employees.hbs", {data: data});
            else
                res.render("employees.hbs", {message: "No data!"});
        }).catch((err) => {
            res.render({message: err});
        });
    }
});
app.post("/employee/update", (req, res) => {
    console.log(req.body);
    data_service.updateEmployee(req.body).then((data) =>{
        res.redirect("/employees");
    }).catch(function(){
        res.status(500).send("Unable to Update Employee");
    })
});
app.get("/employees/add", (req, res) => {
    data_service.getDepartments().then((data) => {
        res.render("addEmployee", {departments: data});
    }).catch((err) => {
        res.render("addEmployee", {departments: []});
    });
});
app.post("/employees/add", (req, res) => {
    data_service.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch(function(){
        res.status(500).send("Unable to Create Employee");
    })
});
app.get("/employees/delete/:employeeNum", function (req, res) {
    data_service.deleteEmployeesByNum(req.params.employeeNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
});
app.get("/employee/:employeeNum", function (req, res) {
    //initialize an empty object to store the values
    let viewData = {};
    data_service.getEmployeesByNum(req.params.employeeNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(data_service.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
 // loop through viewData.departments and once we have found the departmentId that matches
 // the employee's "department" value, add a "selected" property to the matching 
 // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
            viewData.departments[i].selected = true;
        }
    }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
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