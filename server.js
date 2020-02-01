var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "19935ert7",
  database: "employee_manager"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add an employee",
        "Add a role",
        "View departments in your company",
        "View company employee list",
        "View all employee roles in your company",  
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
    
      case "Add a department":
        addDepartment();
        break;

      case "Add an employee":
        addEmployee();
        break;

      case "Add a role":
        addRole();
        break;
    
      case "View departments in your company":
        viewDepartments();
        break;

      case "View company employee list":
        viewEmployees();
        break;

      case "View all employee roles in your company":
        viewRoles();
          break;

      case "exit":
        connection.end();
        break;
      }
    });
}

function addDepartment(){
    inquirer
        .prompt([
          {
            name: 'department',
            message: 'What is the name of the new department?',
          },
        ])
        .then(answer => {
            const ans = answer.department.toString();
            addDepartmentFunctionality(ans);
        });
        
}
function addDepartmentFunctionality(ans){
    connection.query(`INSERT INTO department(name) VALUES (?)`,[ans],(err, dep)=>{
        if(err) throw err;
        console.log(dep);
    });
}

function addEmployee(){
    inquirer
    .prompt([
      {
        name: 'first',
        message: 'What is employees first name?',
      },
      {
        name: 'last',
        message: 'What is employees last name?',
      },
      {
        name: 'empRole',
        message: 'What is employees role within the company?'
      }, 
      {
        name: 'empSalary',
        message: 'What is this employees salary?'
      },
      {
          name: 'empDept',
          message: 'What is the employees department'
      },
      {
        name: 'isLeader', 
        message: 'Is he a manager [Y/N]'
      }
    ])
    .then(answer => {
        const firstName = answer.first.toString();
        const lastName = answer.last.toString();
        const employeeRole = answer.empRole.toString();
        const employeeSalary = parseFloat(answer.empSalary);
        const employeeDept = answer.empDept.toString();
        const isManager = answer.isLeader.toString();

        connection.query('SELECT * FROM employees, roles, department', (err, table)=> {
            const jtable = [...table];
            for(let i = 0; i < jtable.length; i++){

            }
        })
      
    })
}
function addRole(){
    inquirer
    .prompt([
      {
        name: 'role',
        message: 'What is the title of the role that you would like to add?',
      },
      {
          name: 'salary',
          message: 'What is the salary of this particular role?'
      },
      {
          name: 'department',
          message: 'What department will this role operate in?'
      }
    ])
    .then(answer => {
        const title = answer.role.toString();
        const salary = parseFloat(answer.salary);
        const deptment = answer.department.toString();
        addRoleFunctionality(title, salary, deptment);
    });
    
}
function addRoleFunctionality(title, salary, deptment){
    connection.query(`SELECT * FROM roles, department`, (err, roles)=> {
        if(err) throw err;
        const companyRoles = [...roles];
        let deptID = null;
        //Loop through joined table and identify the department id for the foreign key
        for(let i = 0; i < companyRoles.length; i++){
            if(deptment === companyRoles[i].name){
                deptID = companyRoles[i].id;
                break;
            }
        }

        connection.query(`INSERT INTO roles(title, salary, department_id) VALUES(?, ?, ?)`, [title, salary, deptID], (err, role)=>{
            if(err) throw err;
            console.log('Successfully added a new role !!!!!    '+role);
        });
    });
}

function viewDepartments(){
    connection.query(`SELECT * FROM department`, (err, deps)=>{
        if(err) throw err;
        console.log(deps);
    })
}

function viewEmployees(){
    connection.query(`SELECT * FROM employees`, (err, emp)=> {
        if(err) throw err;
        console.log(emp);
    });
}

function viewRoles(){
    connection.query(`SELECT * FROM roles`, (err, roles)=> {
        if(err) throw err;
        console.log(roles);
    });
}