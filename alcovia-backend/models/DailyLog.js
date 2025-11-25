module.exports = (sequelize, DataTypes) => {
    const DailyLog = sequelize.define("DailyLog", {
        quiz_score: {
            type: DataTypes.INTEGER,
        },
        focus_minutes: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING, // "Success" or "Failure"
        }
    });

    return DailyLog;
};
