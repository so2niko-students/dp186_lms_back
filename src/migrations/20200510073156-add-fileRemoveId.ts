import { QueryInterface, DataTypes } from 'sequelize';
import { File } from '../modules/files/files.model';

export async function up(query: QueryInterface) {
    return query.addColumn(File.tableName, 'removeId', {
        type: DataTypes.STRING,
        allowNull: false,
    });
}

export async function down(query: QueryInterface) {
    return query.removeColumn(File.tableName, 'removeId');
}

