export const calculateStateDetails = (number: string) => {
  // Mocked logic for calculating state details
  return {
    stateName: 'Sample State',
    stateCode: 'SS',
    areaCode: number.substring(0, 3),
  };
};
