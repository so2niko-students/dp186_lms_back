import { QueryInterface, DataTypes } from 'sequelize';
import { Student } from '../modules/students/students.model';

export async function up(query: QueryInterface) {
    try {
        return query.createTable(Student.TableName, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            first_name_ukr: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            last_name_ukr: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            first_name_eng: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            last_name_eng: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            email: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            phone_number: {
                type: new DataTypes.DOUBLE(),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(),
                allowNull: false,
            },
            group_id: {
                type: new DataTypes.INTEGER(),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'Date of creation',
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'Date of the last update',
            },
        });
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * function that sequelize-cli runs if you want to remove this migration from your database
 * */
export async function down(query: QueryInterface) {
    try {
        return query.dropTable(Student.TableName);
    } catch (e) {
        return Promise.reject(e);
    }
}
