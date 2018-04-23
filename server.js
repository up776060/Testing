'use strict'

var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');

//var Cookies = require('js-cookie');

var globalCheck;

const mysql = require('mysql');

// Establish connection to database

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    pass: "",
    database: "776060",
    port: 3307
});

con.connect(function(err){
    if (err){
        console.log('Errors occured');
    }
    console.log("MySQL Database Connected!");
});

// HTML File Routing

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test.html'));
});

app.get('/try', function(req, res) {
    res.sendFile(path.join(__dirname + '/try.html'));
});

app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname + '/signup.html'));
})

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/login.html'));

})

app.get('/VRVG', function(req, res){
    res.sendFile(path.join(__dirname + '/videogallery.html'));
})

app.get('/settings', function(req, res){
    res.sendFile(path.join(__dirname + '/settings.html'));
})

app.get('/VRS',function(req, res){
    res.sendFile(path.join(__dirname + '/360Settings.html'));
})

app.get('/VRG',function(req, res){
    res.sendFile(path.join(__dirname + '/360gallery.html'));
})

// SQL Database Function Routing

app.get('/getName/:id', (req, res) => {
    var sql = "SELECT Name from Users where Username = " + req.params.id + ";";
    console.log(sql);

    var user = req.params.id;
    console.log(user);

    con.query('SELECT * FROM Users WHERE Username = ?',[user], function(err, results, fields){
    
        if(err){
            console.log("An Error Occured ", err);
        }
        else{
            console.log(results[0].Name);
            res.send(results[0].Name);
        }

    })


    // con.query(sql, function(err, result, fields){
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.send(result);
    //     console.log(result);
    // })
})

app.get('/getPassword/:id', (req, res) => {
    var sql = "SELECT Password from Users where Username = " + req.params.id + ";";
    console.log(sql);

    con.query(sql, function(err, result, fields){
        if (err) {
            console.log('Error');
        }
        res.send(result);
        console.log(result);
    })
})

app.get('/getSettings/:username', (req, res) =>{
    
    var user = req.params.username;

    con.query('SELECT * FROM Users WHERE Username =?', [user], function(err, results, fields){

        if(err){
            console.log("Error occured: ", err);
        }
        else{
            console.log(results[0].ID);
            var id = results[0].ID;
            
            con.query('SELECT * FROM User_Settings WHERE userID = ?',[id], function(err, results, fields){

                if(err){
                    console.log("An error occured: " + err);
                }

                console.log(results);
                res.send(results);

            })

        }
    })

})

app.post('/changeSettings/:id&:font&:bgcol&:fontCol', (req, res) => {

    console.log('POST Request Recieved');

    var username = req.params.id;
    var font = req.params.font;
    var bgCol = req.params.bgcol;
    var fontCol = req.params.fontCol;

    var id;

    con.query('SELECT * FROM Users WHERE Username = ?',[username], function(err, results, fields){
    
        if(err){
            console.log("An Error Occured ", err);
        }
        else{
            console.log(results[0].ID);
            id = results[0].ID;


            con.query('SELECT * FROM User_Settings WHERE userID = ?',[id], function(err, results, fields){

                if(err){
                    console.log("An error occured: " + err);
                }


                if(results.length = 1){

                    var thisId = results[0].ID;

                    con.query('UPDATE User_Settings SET bgCol = ' + bgCol + ', font = ' + font + ', fontCol = ' + fontCol + ' WHERE ID = ' + thisId, function(err, results, fields){
                        if(err){
                            console.log("An error occured: ", err);
                        }
                        else{
                            console.log("Settings UPDATED!");
                        }
                    })
                }
                else{
                    con.query('INSERT INTO User_Settings (userID, bgCol, font, fontCol) VALUES (' + id + "," + bgCol + "," + font + "," + fontCol+')', function(err, results, fields){

                        if(err){
                            console.log("An Error Occured ", err);
                        }
                        else{
                            console.log("Settings added!");
                        }
                
                })
                }

            })


        //     con.query('INSERT INTO User_Settings (userID, bgCol, font, fontCol) VALUES (' + id + "," + bgCol + "," + font + "," + fontCol+')', function(err, results, fields){

        //         if(err){
        //             console.log("An Error Occured ", err);
        //         }
        //         else{
        //             console.log("Settings added!");
        //         }
        
        // })

    }


})
});


app.post('/addUser/:id&:pass&:name', (req, res) => {

    var sql = "INSERT INTO Users (Username, Password, Name) VALUES ('" + req.params.id + "','" + req.params.pass + "','" + req.params.name + "')";
    console.log(sql);

    var username = req.params.id;

    // con.query(sql, function(err, result){
    //     if (err) {
    //         //console.log('Error');
    //         throw err;
    //         }
    //         res.send("User Added: " + req.params.id);
    //         console.log(result);
    //     })

    //checkUserExists(username);

    console.log("User to check is: " + username);
    
    //var sql2 = "SELECT * FROM 'Users' WHERE 'Username' = "+ username;
    //console.log("The SQL code from CUE is: " + sql2);

    con.query("SELECT * from Users WHERE Username = '" + username + "'", function (err, result){
        if (err) throw err;
        console.log("Length of users is: " + result.length);

        var l = result.length;
        console.log(l);

        if (l == 1){
            console.log("User cannot be added, already exists in database!");
            res.send("User already exists. Cannot be added to DB");
        }
        else{
            con.query(sql, function(err, result){
                if (err) {
                    //console.log('Error');
                    throw err;
                }
                //res.cookie('user',username);
                res.send("User Added: " + req.params.id);
                console.log(result);

                //Cookies.set('test','value');
                //console.log(Cookies.get('test'));
            })

        }

    });



    //var isChecked = checkUserExists(username);
    //console.log("This is: " + isChecked);

    // if (checkUserExists(username) === true){
    //     console.log('Stuff');
         //res.send("User cannot be added, already exists");
    // }
    // else{
    //     con.query(sql, function(err, result){
    //         if (err) {
    //             //console.log('Error');
    //             throw err;
    //         }
    //         res.send("User Added: " + req.params.id);
    //         console.log(result);
    //     })
    //  }

});

function addSettingsEntry(req){
                    // Add User_Settings DB entry for user

                    con.query('SELECT * FROM Users WHERE Username = ?',[req.params.id], function(err, results, fields){
    
                        if(err){
                            console.log("An Error Occured ", err);
                        }
                        else{
                            console.log(results[0].ID);
                            id = results[0].ID;
                        }})
    
                    con.query('INSERT INTO User_Settings (userID, bgCol, font, fontCol) VALUES (' + id + ',1,2,7)', function(err, results, fields){
    
                        if(err){
                            console.log("An Error Occured ", err);
                        }
                        else{
                            console.log("Settings added!");
                        }
                
                    })
}

app.get('/login/:id&:pass', (req, res) => {


    //var sql = "SELECT id from Users where Username =" + req.params.id + " AND Password =" + req.params.pass;
    //console.log("GET on LOGIN generated " + sql);

    var user = req.params.id;
    var pass = req.params.pass;

    console.log(user + pass);

    con.query('SELECT * FROM Users WHERE Username = ?',[user], function(err, results, fields){
        if (err) {
            console.log("Error occured", err);
        }
        else {
            console.log(results.length);
            console.log(results);
            if (results.length > 0){
                if(results[0].Password == pass){
                    console.log("User Verified");
                    res.cookie('userLoggedIn',user);

                    // con.query('SELECT * FROM Users WHERE Username = ?',[user], function(err, results, fields){
    
                    //     if(err){
                    //         console.log("An Error Occured ", err);
                    //     }
                    //     else{
                    //         console.log(results[0].ID);
                    //         id = results[0].ID;
                    //     }})
    
                    con.query('INSERT INTO User_Settings (userID, bgCol, font, fontCol) VALUES (' + results[0].ID + ',1,7,7)', function(err, results, fields){
    
                        if(err){
                            console.log("An Error Occured ", err);
                        }
                        else{
                            console.log("Settings added!");
                        }
                
                    })    

                    res.send('1');
                }
                else{
                    res.send('0');
                }
            }
            else{
                res.send('0');
            }
        }
    })

    // con.query(sql, function(err, result, fields){

    //     if (err) {
    //         //console.log('Error')
    //         console.log(err);
    //     }
    //     else if (result.length == 0){
    //         console.log('Error, user cannot be found');
    //         res.send(0);
    //     }
    //     else {
    //         res.cookie('userLoggedIn',username);
    //         res.send(1);
    //     }
    // })


    

})

function checkUserExists(req){
    console.log("User to check is: " + req);
    
    var sql = "SELECT * FROM 'Users' WHERE 'Username' = "+ req;
    console.log("The SQL code from CUE is: " + sql);

    con.query("SELECT * from Users WHERE Username = '" + req + "'", function (err, result){
        if (err) throw err;
        console.log("Length of users is: " + result.length);

        if (result.length >0){
            var globalCheck = true;
        } else var globalCheck = false;

        console.log(globalCheck);
    })

}

function addNewUser(req, res){
    res.send("User " + req.params.userName + " will be added to database");
}

app.use(express.static('public'));

app.use(cookieParser());

app.listen(8080);