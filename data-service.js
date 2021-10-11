var fs = require("fs");
var employees = [];
var departments = [];

exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile("./data/employees.json", (err, data) => {
            if (err) {
                reject("Can't read the file: employees.json");
            }
            else {
                employees = JSON.parse(data);
                fs.readFile("./data/departments.json", (err, data) => {
                    if (err) {
                        reject("Can't read the file: departments.json");
                    }
                    else {
                        departments = JSON.parse(data);
                        resolve('Reading of files finished.');
                    }
                });
            }
        });
    });
}

exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject) {
        if (employees.length == 0) {
            reject("No data inside of array");
        }
        else
            resolve(employees);
    });
}

exports.getDepartments = function() {
    return new Promise(function(resolve, reject) {
        if (departments.length == 0) {
            reject("No data inside of array");
        }
        else {
            resolve(departments);
        }
    });
}

exports.getManagers = function() {
    return new Promise(function(resolve, reject) {
        if (departments.length == 0) {
            reject("No data inside of array");
        }
        else {
            tmp = [];
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true) {
                    tmp[i] = employees[i];
                }
            }
            resolve(tmp);
        }
    });
}