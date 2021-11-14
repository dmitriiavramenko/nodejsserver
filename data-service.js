var fs = require("fs");
const { resolve } = require("path");
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

exports.addEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        if (employeeData.isManager === undefined) {
            employeeData.isManager = false;
        } else {
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
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
            var tmp = [];
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true) {
                    tmp[i] = employees[i];
                }
            }
            resolve(tmp);
        }
    });
}

exports.getEmployeesByStatus = function(status) {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("No data inside of array");
        }
        var tmp = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                tmp[i] = employees[i];
            }
        }
        if (tmp.length == 0) {
            reject("No matches!");
        }
        resolve(tmp);
    });
}

exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("No results returned");
        }
        var tmp = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                tmp[i] = employees[i];
            }
        }
        if (tmp.length == 0) {
            reject("No matches!");
        }
        resolve(tmp);
    });
}

exports.getEmployeesByManager = function(manager) {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("No results returned");
        }
        var tmp = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                tmp[i] = employees[i];
            }
        }
        if (tmp.length == 0) {
            reject("No matches!");
        }
        resolve(tmp);
    });
}

exports.getEmployeesByNum = function(num) {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("No results returned");
        }
        var tmp = 0;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                tmp = employees[i];
            }
        }
        if (!tmp) {
            reject("No matches!");
        }
        resolve(tmp);
    });
}

exports.updateEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                resolve();
            }
        }
    });
}
