const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = require('./Student')(sequelize, Sequelize);
db.DailyLog = require('./DailyLog')(sequelize, Sequelize);
db.Intervention = require('./Intervention')(sequelize, Sequelize);

// Associations
db.Student.hasMany(db.DailyLog, { foreignKey: 'student_id' });
db.DailyLog.belongsTo(db.Student, { foreignKey: 'student_id' });

db.Student.hasMany(db.Intervention, { foreignKey: 'student_id' });
db.Intervention.belongsTo(db.Student, { foreignKey: 'student_id' });

module.exports = db;
