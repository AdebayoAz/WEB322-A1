/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: ADEBAYO AZEEZ Student ID: 139260228 Date: ______________
*
* Published URL: https://web-322-a1-coral.vercel.app/
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

    app.get("/about", (req, res) => {
      res.render("about");
    });

    // Commented out old demo routes
    // app.get("/solutions/projects/id-demo", (req, res) => {
    //   projectData.getProjectById(9)
    //     .then(p => res.json(p))
    //     .catch(err => res.status(404).send(err));
    // });

    // app.get("/solutions/projects/sector-demo", (req, res) => {
    //   projectData.getProjectsBySector("agriculture")
    //     .then(list => res.json(list))
    //     .catch(err => res.status(404).send(err));
    // });

    // Dynamic route for individual project
    app.get("/solutions/projects/:id", (req, res) => {
      projectData.getProjectById(req.params.id)
        .then(project => res.render("project", {project: project}))
        .catch(err => res.status(404).render("404", {message: err}));
    });

    // Dynamic route for projects list (with optional sector query parameter)
    app.get("/solutions/projects", (req, res) => {
      if(req.query.sector) {
        // If sector query parameter exists
        projectData.getProjectsBySector(req.query.sector)
          .then(projects => {
            if(projects.length > 0) {
              res.render("projects", {projects: projects});
            } else {
              res.status(404).render("404", {message: `No projects found for sector: ${req.query.sector}`});
            }
          })
          .catch(err => res.status(404).render("404", {message: err}));
      } else {
        // If no sector query parameter, show all projects
        projectData.getAllProjects()
          .then(projects => res.render("projects", {projects: projects}))
          .catch(err => res.status(404).render("404", {message: err}));
      }
    });

    // 404 catch-all route (must be last)
    app.use((req, res) => {
      res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    });

    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    });

  })
  .catch(err => {
    console.log("unable to start server: " + err);
  });