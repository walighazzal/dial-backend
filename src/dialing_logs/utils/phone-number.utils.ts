export function calculateStateDetails(phoneNumber: string) {
  const areaCode = phoneNumber.substring(0, 3); // Example logic
  const stateName = 'Example State'; // Replace with lookup logic
  const stateCode = 'ES'; // Replace with lookup logic
  return { areaCode, stateName, stateCode };
}

export function calculateLengthInSeconds(
  length: string,
  queueWait: string,
  wrapUpTime: string,
): string {
  const toSeconds = (time: string) => (time ? parseInt(time, 10) || 0 : 0);
  const totalSeconds =
    toSeconds(length) + toSeconds(queueWait) + toSeconds(wrapUpTime);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
