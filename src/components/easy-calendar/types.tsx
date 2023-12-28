export interface IDate {
  year: number;
  month: number;
  day: number;
  dow: number;
  disabled: true | false;
}

export interface IDayCard {
  date: IDate;
  selected: true | false;
  backgroundColor: string;
}

export interface IMonth {
  leftPadding: IDate[];
  days: IDate[];
  rightPadding: IDate[];
}

export interface IMonthNames {
  [key: number]: string;
}

export interface IAnyObject {
  [key: string]: any;
}

export interface ItemType {
  year: string;
  month: string;
  day: string;
  project: IAnyObject;
}
