

const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];


function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map(p => {
                let sector = sectorData.find(s => s.id === p.sector_id);
                return { ...p, sector: sector ? sector.sector_name : "Unknown" };
            });
            resolve();
        } catch (err) {
            reject("problem initializing");
        }
    });
}


function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) resolve(projects);
        else reject("no projects found");
    });
}


function getProjectById(id) {
    return new Promise((resolve, reject) => {
        let project = projects.find(p => p.id == id);
        if (project) resolve(project);
        else reject("no project with that id");
    });
}


function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        let result = projects.filter(p => 
            p.sector.toLowerCase().includes(sector.toLowerCase())
        );
        if (result.length > 0) resolve(result);
        else reject("no projects in that sepwdtor");
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };

if (require.main === module) {
    initialize()
    .then(() => getAllProjects())
    .then(all => console.log("all projects:", all.length))
    .then(() => getProjectById(9))
    .then(p => console.log("project 9:", p.title))
    .then(() => getProjectsBySector("agriculture"))
    .then(list => console.log("agriculture projects:", list.length))
    .catch(err => console.log("ERROR:", err));
}
