import { areaCodeMapping, stateCodeToNameMapping } from './areaCodeMapping';

export const calculateStateDetails = (number: string) => {

  const mappedItem = areaCodeMapping[number?.toString().substring(0, 3)];
  const stateName = stateCodeToNameMapping[mappedItem?.stateCode]

  return {
    stateName: stateName,
    stateCode: mappedItem?.stateCode,
    areaCode: number?.toString().substring(0, 3),
  };
};

