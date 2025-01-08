import * as fs from 'fs';

export function writeFile(filePath: string, data: any[]) {
  const headers = Object.keys(data[0]);
  const content = [
    headers.join(','),
    ...data.map((row) => headers.map((header) => row[header]).join(',')),
  ].join('\n');
  fs.writeFileSync(filePath, content);
}
