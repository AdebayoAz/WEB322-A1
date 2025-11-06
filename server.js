/******************************************************************************** 
*  WEB322 – Assignment 01 
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: ADEBAYO AZEEZ Student ID: 139260228 Date: 09/29/2025
* 
********************************************************************************/ 


const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


projectData.initialize()
  .then(() => {

    app.get("/", (req, res) => {
      res.render("home");
    });

    
    app.get("/solutions/projects", (req, res) => {
      projectData.getAllProjects()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
    });

    
    app.get("/solutions/projects/id-demo", (req, res) => {
      projectData.getProjectById(9)
        .then(p => res.json(p))
        .catch(err => res.status(404).send(err));
    });

    
    app.get("/solutions/projects/sector-demo", (req, res) => {
      projectData.getProjectsBySector("agriculture")
        .then(list => res.json(list))
        .catch(err => res.status(404).send(err));
    });

    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    });

  })
  .catch(err => {
    console.log("unable to start server: " + err);
  });