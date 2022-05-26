'use strict';

module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('Schedule', {
        model_id : {
            type    : DataTypes.INTEGER(100), 
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        invoke_date : {
            type: DataTypes.DATEONLY, 
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        invoke_time : {
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        status : {
            type: DataTypes.STRING(50), 
            allowNull: false, 
            validate: {
                notEmpty: true,
            }
        },
        last_invoke : {
            type: DataTypes.DATE, 
            allowNull: true,
            defaultValue: null
        },
    },{
        timestamps: false,
        underscored: true,
        indexes: [
            {
              unique: true,
              fields: ['model_id']
            },
        ]
    });

    return Model;
};
