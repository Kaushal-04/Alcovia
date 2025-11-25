module.exports = (sequelize, DataTypes) => {
    const Intervention = sequelize.define("Intervention", {
        task: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Completed'),
            defaultValue: 'Pending',
        }
    });

    return Intervention;
};
