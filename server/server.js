'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

// ***********set up DB connection *************

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "alma",
  database: "cipher",
});

connection.connect(function(error){
  if(error){
    console.log('error on connection to database', error.toString());
    return;
  }
  console.log('connected to database');
});


// ***********  handling requests *************

app.get('/decode/all', function (req, res) {

  connection.query('SELECT * FROM text;', function (err, data) {
    if(err) {
      console.log(err.toString());
      connection.end();
      return;
    }
    let list = {"all": []};
    data.forEach(function (item, index) {
      list.all[index] = item.text;
    });
    res.status(200).json(list);
  });
});

app.post('/decode', function (req, res) {
  if (req.body.shift === '' || req.body.text === '') {
    var errorMessage = {
          "status": "error",
          "error": "Shift is out of bound",
    };
    res.status(400).json(errorMessage);
    return;
  }
  var decodedText = logic(req.body.text, req.body.shift);
  connection.query('INSERT INTO text (text) VALUES ("' + decodedText + '");',
    function (err, insertParam) {
      if(err) {
        console.log(err.toString());
        connection.end();
        return;
      }
      console.log(insertParam);
      var responseData = {
            "status": "ok",
            "text": decodedText,
      };
      res.status(200).json(responseData);
    });
});

var logic = function (text, shift) {
  text = text.split('');
  var charCoded = [];
  text.forEach(function (item) {
    console.log(item.charCodeAt(0));
    charCoded.push(parseInt(item.charCodeAt(0)) + parseInt(shift));
  });
  console.log(charCoded);
  var decodedText = [];
  charCoded.forEach(function (item){
    decodedText.push(String.fromCharCode(item));
  });
  console.log(decodedText);
  return decodedText.join('');
}

module.exports = app;
