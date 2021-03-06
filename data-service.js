const Sequelize = require('sequelize');
var sequelize = new Sequelize('d635916465q3ev', 'jzymrycuzmvrny', '26f503f5929871e9f5146e505b815168612fb5e40384193e6b628c4f6d056a78', {
    host: 'ec2-54-198-213-75.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } 
   });
sequelize.authenticate().then(()=> console.log('Connection success.')).catch((err)=>console.log("Unable to connect to DB.", err));
var Employee = sequelize.define('Employee', {
    employeeNum: { 
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});
exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function() {
            resolve();
        }).catch(function() {
            reject("Unable to sync the database.");
        })
    });
}


exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject) {
        Employee.findAll().then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("No results returned.");
        })
       
    });
}

exports.getDepartments = function() {
    return new Promise(function(resolve, reject) {
        Department.findAll().then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}

exports.getManagers = function() {
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getEmployeesByStatus = function(status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: status
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}

exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: department
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}

exports.getEmployeesByManager = function(manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}

exports.getEmployeesByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}

exports.updateEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "")
                employeeData[prop] = null;
        }
        Employee.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        }).then(function() {
            resolve();
        }).catch(function(){
            reject();
        })
    });
}
exports.deleteEmployeesByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {
                employeeNum: num
            }
        }).then(function(data){
            resolve();
        }).catch(function(){
            reject("No results returned.");
        })
    });
}
exports.addEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "")
                employeeData[prop] = null;
        }
        Employee.create(employeeData).then(function() {
            resolve();
        }).catch(function(){
            reject();
        })
    });
}

exports.addDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (var prop in departmentData) {
            if (departmentData[prop] == "")
                departmentData[prop] = null;
        }
        Department.create(departmentData).then(function() {
            console.log(departmentData);
            resolve();
        }).catch(function(){
            reject();
        })
    });
}

exports.updateDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (var prop in departmentData) {
            if (departmentData[prop] == "")
                departmentData[prop] = null;
        }
        Department.update(departmentData, {
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(function() {
            resolve();
        }).catch(function(){
            reject();
        })
    });
}

exports.getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(function(data){
            data = data.map(value => value.dataValues);
            resolve(data[0]);
        }).catch(function(){
            reject("No results returned.");
        })
    });
}