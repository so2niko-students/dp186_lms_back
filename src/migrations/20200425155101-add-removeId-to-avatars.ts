import {Avatars} from '../modules/avatars/avatars.model';
import {DataTypes, QueryInterface} from 'sequelize';

export async function up(query: QueryInterface) {
    return query.addColumn(Avatars.tableName, 'removeId', {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'PublicId from cloudinary (using for delete img from cloud)',
    });
}

export async function down(query: QueryInterface) {
    return query.removeColumn(Avatars.tableName, 'removeId');
}
