export class ProcessDialingLogDto {
  phone_number_dialed: string;
  FileName: string;
  AreaCode: string;
  StateName: string;
  StateCode: string;
  TotalCount: number;
  length_in_secs: string;
  call_dates: string; // Comma-separated dates
  status_names: string; // Comma-separated statuses
  FileNames: string; // Comma-separated file names

  constructor(data: Partial<ProcessDialingLogDto>) {
    this.phone_number_dialed = data.phone_number_dialed || '';
    this.FileName = data.FileName || '';
    this.AreaCode = data.AreaCode || '';
    this.StateName = data.StateName || '';
    this.StateCode = data.StateCode || '';
    this.TotalCount = data.TotalCount || 0;
    this.length_in_secs = data.length_in_secs || '00:00:00';
    this.call_dates = data.call_dates || '';
    this.status_names = data.status_names || '';
    this.FileNames = data.FileNames || '';
  }
}
