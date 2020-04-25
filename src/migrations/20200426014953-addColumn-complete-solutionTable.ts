import { QueryInterface, DataTypes } from 'sequelize';
import { Solution } from '../modules/solutions/solutions.model';

export async function up(query: QueryInterface) {
    return query.addColumn(Solution.tableName, 'isCompleted', {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'NULL',
    });
}

export async function down(query: QueryInterface) {
    return query.removeColumn(Solution.tableName, 'isCompleted');
}
