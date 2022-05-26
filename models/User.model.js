'use strict';
const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('User', {
        first_name : {
            type    : DataTypes.STRING(100), 
            allowNull: false,
            validate: {
                len: [3, 100],
                notEmpty: true,
            }
        },
        last_name : {
            type: DataTypes.STRING(100), 
            allowNull: false, 
            validate: {
                len: [3, 100],
                notEmpty: true,
            }
        },
        dob : {
            type: DataTypes.DATEONLY, 
            allowNull: false,
            validate: {
                isDate: true,
                notEmpty: true,
            }
            
        },
        location : {
            type: DataTypes.STRING(100), 
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: {
                    args: [moment.tz.names()],
                    msg: "Not valid location, please see the location list at /locations "
                }
            }
        },
    },{
        paranoid: true,
        underscored: true
    });

    // get all user data including creation date and update date.
    Model.prototype.toWeb = function () {
        return this.toJSON();
    };

    // get specific user data.
    Model.prototype.userData = function () {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            dob: this.dob,
            location: this.location,
        };
    };

    return Model;
};
