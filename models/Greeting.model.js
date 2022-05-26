'use strict';

module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('Greeting', {
        text : {
            type    : DataTypes.TEXT, 
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    },{
        timestamps: false,
        underscored: true
    });

    // get specific user data.
    Model.prototype.getText = function () {
        return this.text;
    };

    return Model;
};
