module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('On Track', 'Needs Intervention', 'Remedial'),
            defaultValue: 'On Track',
        },
    });

    return Student;
};
