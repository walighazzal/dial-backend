import { areaCodeMapping } from './areaCodeMapping';

export const calculateStateDetails = (number: string) => {
  const mappedItem = areaCodeMapping[number.substring(0, 3)];
  return {
    stateName: mappedItem.stateName,
    stateCode: mappedItem.stateCode,
    areaCode: number.substring(0, 3),
  };
};
