// Check if an array is empty
export const isEmptyArray = (arr) => {
  return arr.length === 0;
};

// Get the SQL operator based on the provided string
export function getOperator(operator) {
  switch (operator) {
    case 'eq':
      return '=';

    case 'neq':
      return '!=';

    case 'gt':
      return '>';

    case 'lt':
      return '<';

    case 'gte':
      return '>=';

    case 'lte':
      return '<=';

    case 'like':
      return 'ILIKE';

    case 'in':
      return 'IN';

    case 'notIn':
      return 'NOT IN';

    case 'between':
      return 'BETWEEN';

    default:
      return '=';
  }
}

// Construct a query string and object from an array of filter objects
export function constructQueryFromArray(
  arrayOfObjects: Array<{ field: string; operator: string; value: any }>,
): { queryString: string; queryObject: Record<string, any> } {
  let queryString = '';
  const queryObject = {};

  arrayOfObjects.forEach((obj, index) => {
    const { field, operator, value } = obj;
    // Split the field to get table name and field name
    const [tableName, fieldName] = field.split('.');

    console.log(tableName + ' ' + fieldName);
    switch (operator) {
      case 'like':
        queryString += `${tableName}.${fieldName} ILIKE :${fieldName}_${index} AND `;
        queryObject[`${fieldName}_${index}`] = `%${value}%`;
        break;
      case 'in':
      case 'notIn':
        queryString += `${tableName}.${fieldName} ${getOperator(operator)} (:...${fieldName}_${index}) AND `;
        queryObject[`${fieldName}_${index}`] = value;
        break;
      case 'between':
        const [start, end] = value;
        queryString += `${tableName}.${fieldName} BETWEEN :start_${index} AND :end_${index} AND `;
        queryObject[`start_${index}`] = start;
        queryObject[`end_${index}`] = end;
        break;
      default:
        queryString += `${tableName}.${fieldName} ${getOperator(operator)} :${fieldName}_${index} AND `;
        queryObject[`${fieldName}_${index}`] = value;
    }
  });

  // Remove the trailing ' AND '
  queryString = queryString.slice(0, -5);

  return {
    queryString,
    queryObject,
  };
}
