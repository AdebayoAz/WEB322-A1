require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');


let sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


const Sector = sequelize.define('Sector', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sector_name: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});


const Project = sequelize.define('Project', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    feature_img_url: {
        type: Sequelize.STRING
    },
    summary_short: {
        type: Sequelize.TEXT
    },
    intro_short: {
        type: Sequelize.TEXT
    },
    impact: {
        type: Sequelize.TEXT
    },
    original_source_url: {
        type: Sequelize.STRING
    },
    sector_id: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});


Project.belongsTo(Sector, { foreignKey: 'sector_id' });


const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        Project.findAll({
            include: [Sector]
        })
            .then(projects => {
                if (projects.length > 0) {
                    resolve(projects);
                } else {
                    reject("no projects found");
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getProjectById(id) {
    return new Promise((resolve, reject) => {
        Project.findAll({
            include: [Sector],
            where: { id: id }
        })
            .then(projects => {
                if (projects.length > 0) {
                    resolve(projects[0]);
                } else {
                    reject("Unable to find requested project");
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        Project.findAll({
            include: [Sector],
            where: {
                '$Sector.sector_name$': {
                    [Sequelize.Op.iLike]: `%${sector}%`
                }
            }
        })
            .then(projects => {
                if (projects.length > 0) {
                    resolve(projects);
                } else {
                    reject("Unable to find requested projects");
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function addProject(projectData) {
    return new Promise((resolve, reject) => {
        Project.create(projectData)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err.errors && err.errors.length > 0 ? err.errors[0].message : err.message);
            });
    });
}

function getAllSectors() {
    return new Promise((resolve, reject) => {
        Sector.findAll()
            .then(sectors => {
                resolve(sectors);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function editProject(id, projectData) {
    return new Promise((resolve, reject) => {
        Project.update(projectData, {
            where: { id: id }
        })
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err.errors && err.errors.length > 0 ? err.errors[0].message : err.message);
            });
    });
}

function deleteProject(id) {
    return new Promise((resolve, reject) => {
        Project.destroy({
            where: { id: id }
        })
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err.errors && err.errors.length > 0 ? err.errors[0].message : err.message);
            });
    });
}

module.exports = { 
    initialize, 
    getAllProjects, 
    getProjectById, 
    getProjectsBySector,
    addProject,
    getAllSectors,
    editProject,
    deleteProject
};


if (require.main === module) {
    sequelize
        .sync()
        .then(async () => {
            try {
                await Sector.bulkCreate(sectorData);
                await Project.bulkCreate(projectData);

                await sequelize.query(`SELECT setval(pg_get_serial_sequence('"Sectors"', 'id'), (SELECT MAX(id) FROM "Sectors"))`);
                await sequelize.query(`SELECT setval(pg_get_serial_sequence('"Projects"', 'id'), (SELECT MAX(id) FROM "Projects"))`);

                console.log("-----");
                console.log("data inserted successfully");
            } catch (err) {
                console.log("-----");
                console.log(err.message);

                
            }

            process.exit();
        })
        .catch((err) => {
            console.log('Unable to connect to the database:', err);
        });
}
