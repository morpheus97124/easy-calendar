import { IAnyObject, ItemType } from '../easy-calendar/types';

export interface IProject extends IAnyObject {
  hour: string;
  projectName: string;
  taskName: string;
  color: string;
}

export interface IProjectWithDate extends ItemType {
  year: string;
  month: string;
  day: string;
  project: IProject;
}

export const isStringEqual = (option: string, value: string) => {
  return option === value;
};
const monthMap: { [key: string]: string } = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

export const getDateMembersFromSelectedDate = (date: string) => {
  const year = date.slice(11);
  const month = monthMap[date.slice(4, 7)];
  const day = date.slice(8, 10);
  return { year, month, day };
};

export const leaveDateFromProjects = (
  items: IProjectWithDate[]
): IProject[] => {
  let arr: IProject[] = [];
  items.forEach((item) =>
    arr.push({
      hour: item.project.hour.toString(),
      projectName: item.project.projectName,
      taskName: item.project.taskName,
      color: item.project.color,
    })
  );
  return arr;
};

export const addDateToProject = (
  item: IProject,
  selectedDate: string
): IProjectWithDate => {
  const { year, month, day } = getDateMembersFromSelectedDate(selectedDate);
  return {
    year: year,
    month: month,
    day: day,
    project: item,
  };
};

export const getItemsThisDay = (
  items: IProjectWithDate[],
  year: string,
  month: string,
  day: string
): IProjectWithDate[] => {
  return items.filter((item) => {
    return item.year === year && item.month === month && item.day === day;
  });
};

export const getItemsIntersection = (
  firstArr: IProjectWithDate[],
  secondArr: IProjectWithDate[]
) => {
  if (firstArr.length === 0 || secondArr.length === 0) {
    return [];
  } else {
    return firstArr.filter((item) =>
      secondArr.some(
        (secondItem) =>
          item.project.projectName === secondItem.project.projectName &&
          item.project.taskName === secondItem.project.taskName &&
          item.project.hour === secondItem.project.hour
      )
    );
  }
};

export const getItemsForToday = (
  selectedDate: string[],
  items: IProjectWithDate[]
): IProjectWithDate[] => {
  let itemsForDay: IProjectWithDate[];
  if (selectedDate.length > 1) {
    let { year, month, day } = getDateMembersFromSelectedDate(selectedDate[0]);
    let itemsForAllDays: IProjectWithDate[] = getItemsThisDay(
      items,
      year,
      month,
      day
    );
    selectedDate.slice(1).forEach((selectedDay) => {
      let { year, month, day } = getDateMembersFromSelectedDate(selectedDay);
      let itemsForSpecificDay = getItemsThisDay(items, year, month, day);
      itemsForAllDays = getItemsIntersection(
        itemsForAllDays,
        itemsForSpecificDay
      );
    });
    itemsForDay = itemsForAllDays;
  } else {
    const { year, month, day } = getDateMembersFromSelectedDate(
      selectedDate[0]
    );
    itemsForDay = getItemsThisDay(items, year, month, day);
  }
  return itemsForDay;
};

export const isSameItem = (
  item1: IProjectWithDate,
  item2: IProjectWithDate
) => {
  return (
    item1.project.projectName === item2.project.projectName &&
    item1.project.taskName === item2.project.taskName &&
    item1.project.hour === item2.project.hour &&
    item1.project.color === item2.project.color &&
    item1.year === item2.year &&
    item1.month === item2.month &&
    item1.day === item2.day
  );
};

export const config = {
  default_color: '#F08080',
  minimum_hour: 1,
};

export const sortItems = (items: IProjectWithDate[]): IProjectWithDate[] => {
  return items.sort((a, b) => {
    if (a.year !== b.year) {
      return Number(a.year) - Number(b.year);
    } else {
      if (a.month !== b.month) {
        return Number(a.month) - Number(b.month);
      } else {
        return Number(a.day) - Number(b.day);
      }
    }
  });
};

export const returnDaysTitle = (selectedDate: string[]): string | undefined => {
  if (selectedDate.length >= 2) {
    const { year, month, day } = getDateMembersFromSelectedDate(
      selectedDate[0]
    );
    let str = `${year}.${month}.`;
    let days: number[] = [];
    selectedDate.forEach((date) => {
      days.push(parseInt(getDateMembersFromSelectedDate(date).day));
    });

    let prevDay: number = days[0];
    days.slice(1).forEach((currDay, index) => {
      if (prevDay + 1 === currDay) {
        //consecutive
        if (str.slice(-1) !== '-') {
          //doesn't end with '-'
          str += `${prevDay}-`;
        }
        if (index === days.length - 2) {
          //last day in month
          str += `${currDay},`;
        }
      } else {
        //not consecutive
        str += `${prevDay},`;
        if (index === days.length - 2) {
          //last day in month
          str += `${currDay},`;
        }
      }

      prevDay = currDay;
    });
    if (str.slice(-1) === ',') {
      str = str.slice(0, -1);
    }
    str += '.';
    return str;
  } else if (selectedDate.length > 0) {
    return `${getDateMembersFromSelectedDate(selectedDate[0]).year}.${
      getDateMembersFromSelectedDate(selectedDate[0]).month
    }.${getDateMembersFromSelectedDate(selectedDate[0]).day}.`;
  }
  if (selectedDate.length === 0) {
    console.error('selectedDate.length is 0');
    return '';
  }
};
