const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
dotenv.config();

const router = express.Router();

const TABLE_NAME_STUDENTS = 'Students';
const TABLE_NAME_MAJOR_MINOR = 'Major_Minor';
const TABLE_NAME_DEPT = 'Dept_Heads';
const TABLE_NAME_PROGRESS = 'Progress_Table';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'lemurian_root',
    password: 'Wn5fpmALjwbTD9S',
    database: 'lemurian_daystar_grad_sys',
    port: "3306"

});

// Connecting to the database

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected to DATABASE ');
});

// Get details of all the students registered in the system.

router.get('/students', async (req, res) => {

    const sql = "SELECT * FROM " + TABLE_NAME_STUDENTS;
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send(rows);
    });

});

// Get the total number of students

router.get('/student/total', async (req, res) => {
    const sql = 'select count(*) as total_students from ' + TABLE_NAME_STUDENTS;
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        res.send(rows);
    });

});

// Get all students that have collected their certificates from the registrar

router.get('/student/collected', async (req, res) => {
    const sql = 'SELECT COUNT(*)  as collected from ' + TABLE_NAME_STUDENTS + ' WHERE terminal_status = \'collected\'';
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        res.send(rows);
    });
});

//Get all students that have their certificates retained

router.get('/student/retained', async (req, res) => {
    const sql = 'SELECT COUNT(*)  as retained from ' + TABLE_NAME_STUDENTS + ' WHERE terminal_status = \'retained\'';
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        res.send(rows);
    });
});

// Get all the certificates that have been printed by the school for that academic year

router.get('/student/released', async (req, res) => {
    const sql = 'SELECT COUNT(*) as released  from ' + TABLE_NAME_STUDENTS + ' WHERE terminal_status = \'released\'';
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        res.send(rows);
    });
});

//Get a single student's information using their admission number

router.get('/student/:id', async (req, res) => {

    try {
        const sql = 'Select * from ' + TABLE_NAME_STUDENTS + ' where admno = ? ';
        await connection.query(sql, [req.params.id], (err, rows) => {
            console.log('Connection result error: ' + err);
            console.log('no of records is ' + rows.length);
            res.send(rows);
        });
    } catch (error) {
        res.send(err);
    }

});

//Get the login credentials of an already registered student

router.post('/student/login/', async (req, res) => {
    let admno =  req.body.admno;
    let pass = req.body.password;
    if (admno && pass){
        try {
            const sql = 'Select * from ' + TABLE_NAME_STUDENTS + ' where admno = ? and password = ?';
            await connection.query(sql, [admno,pass], (err, rows) => {
               if(rows.length > 0){
                console.log('Connection result error: ' + err);
                console.log('no of records is ' + rows.length);
                res.send(rows);
               }else{
                console.log("error")
                res.send("Incorrect username/password")
               }
            });
        } catch (error) {
            res.send(error);
        }
    }else{
        console.log("Provide username password");
        res.send('Please enter Username and Password!');
    }
});

// Regitser a student with the neccesary credentials 
router.post('/student/register/',async (req,res)=>{
    const sql = 'insert into '+ TABLE_NAME_STUDENTS+
    '(Student_ID,FirstName,MiddleName,LastName,Nationality,Gender,DOB,Campus,Email,Password)';
    await connection.query(sql,[req.body.admNumber,req.body.firstname,req.body.middlename,req.body.lastname,req.body.nationality,req.body.gender,req.body.dateOfBirth,req.body.email,req.body.password],(err,rows) =>{
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send("Record has been inserted");

    });

});


// Delete a incorrectly configured or redundant account using the admno

router.delete('/student/:id', async (req, res) => {

    const sql = 'delete from ' + TABLE_NAME_STUDENTS + ' where admno = ? ';
    await connection.query(sql, [req.params.id], (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send("Record deleted");
    });
});


//Get all the credentials of all staff in the database
router.get('/department', async (req, res) => {

    const sql = "SELECT * FROM " + TABLE_NAME_DEPT;
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send(rows);
    });

});
// Get the total count of all departmental staff
router.get('/department/total', async (req, res) => {
    const sql = 'select count(*) as total_staff from ' + TABLE_NAME_STUDENTS;
    await connection.query(sql, (err, rows) => {
        console.log('Connection result error: ' + err);
        res.send(rows);
    });

});

//Get a single staff's information using their staff username

router.get('/department/:id', async (req, res) => {

    try {
        const sql = 'Select * from ' + TABLE_NAME_DEPT + ' where username = ? ';
        await connection.query(sql, [req.params.id], (err, rows) => {
            console.log('Connection result error: ' + err);
            console.log('no of records is ' + rows.length);
            res.send(rows);
        });
    } catch (error) {
        res.send(err);
    }

});

//Get the login credentials of an already registered staff

router.get('/department/login/:id', async (req, res) => {
    try {
        const sql = 'Select username,password from ' + TABLE_NAME_DEPT + ' where username = ?';
        await connection.query(sql, [req.params.id], (err, rows) => {
            console.log('Connection result error: ' + err);
            console.log('no of records is ' + rows.length);
            res.send(rows);
        });
    } catch (error) {
        res.send(error);
    }
});

// Regitser a staff with the neccesary credentials 

router.post('/department/', async (req, res) => {

    const sql = 'insert into ' + TABLE_NAME_DEPT + '(username, password, dept_id) values (?,?,?)';
    await connection.query(sql, [req.body.username, req.body.password,req.body.dept_id], (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send("Record has been inserted");
    });
});

//Update student progress after clearance


router.put('/department/', async (req, res) => {

    const sql = 'update ' + TABLE_NAME_PROGRESS + ' set library = ? where admno = ?';
    await connection.query(sql, [req.body.state, req.body.admno], (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send("Record has been inserted");
    });
});


// Delete a incorrectly configured or redundant account using the username

router.delete('/department/:id', async (req, res) => {

    const sql = 'delete from ' + TABLE_NAME_DEPT + ' where username = ? ';
    await connection.query(sql, [req.params.id], (err, rows) => {
        console.log('Connection result error: ' + err);
        console.log('no of records is ' + rows.length);
        res.send("Record deleted");
    });
});



exports.router = router;
