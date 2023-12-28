import { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/hu';
import { IDate, IMonth, IMonthNames } from './types';
import MonthGrid from './month-grid.component';
import {
  AppBar,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';

moment.locale('hu', {
  week: {
    dow: 1,
    doy: 1,
  },
});

const convertDateFromMoment = (m: moment.Moment): IDate => {
  return {
    year: m.year(),
    month: m.month() + 1,
    day: m.date(),
    dow: m.isoWeekday(),
    disabled: false,
  };
};

const monthNames: IMonthNames = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const getLocalMoment = (): moment.Moment => {
  const m = moment().add(moment().utcOffset());
  return m;
};

const generateYearsToShow = () => {
  const currentYear = convertDateFromMoment(getLocalMoment()).year;
  const arr = [];
  for (let i = currentYear - 5; i < currentYear + 6; i++) {
    arr.push(i);
  }
  return arr;
};

const yearsToShow: number[] = generateYearsToShow();

const monthInit = (): IMonth => {
  return {
    leftPadding: [],
    days: [],
    rightPadding: [],
  };
};

const deepCopy = (o: any): any => {
  return JSON.parse(JSON.stringify(o));
};

const OverwriteDate = (date1: IDate, date2: IDate) => {
  date1.year = date2.year;
  date1.month = date2.month;
  date1.day = date2.day;
  date1.dow = date2.dow;
};

const AddDaysToDate = (date: IDate, amount: number) => {
  const tmp = convertDateFromMoment(
    convertMomentFromDate(date).add(amount, 'days')
  );
  OverwriteDate(date, tmp);
};
const SubtractDaysFromDate = (date: IDate, amount: number) => {
  const tmp = convertDateFromMoment(
    convertMomentFromDate(date).subtract(amount, 'days')
  );
  OverwriteDate(date, tmp);
};
const GetFirstDayOfMonth = (date: IDate): IDate => {
  return convertDateFromMoment(convertMomentFromDate(date).date(1));
};

const convertMonthFromDate = (date: IDate): IMonth => {
  const month = monthInit();
  const firstDay = GetFirstDayOfMonth(date);
  const start = deepCopy(firstDay);
  while (start.dow !== 1) {
    //applying left padding
    SubtractDaysFromDate(start, 1);
    month.leftPadding.unshift(deepCopy(start));
  }

  const lastDay = deepCopy(firstDay);
  while (lastDay.month === firstDay.month) {
    //applying month days
    month.days.push(deepCopy(lastDay));
    AddDaysToDate(lastDay, 1);
  }
  while (lastDay.dow !== 1) {
    //if not monday applying right padding
    month.rightPadding.push(deepCopy(lastDay));
    AddDaysToDate(lastDay, 1);
  }
  return month;
};

const convertMomentFromDate = (date: IDate): moment.Moment => {
  return moment()
    .year(date.year)
    .month(date.month - 1)
    .date(date.day);
};

export const convertDateFromIDate = (idate: IDate): Date => {
  return new Date(idate.year, idate.month - 1, idate.day);
};

const EasyCalendar = ({
  title,
  callbackFunction,
  loadItems,
  itemsForCalendar,
  wrapper,
}: {
  title?: string;
  callbackFunction: (list: IDate[], items?: any[]) => void;
  loadItems: () => Promise<any[]>;
  itemsForCalendar: any[];
  wrapper: React.ComponentType<{ item: any }>;
}) => {
  const [myMonth, setMyMonth] = useState<IMonth>(monthInit());
  const [selectedYear, setSelectedYear] = useState(
    convertDateFromMoment(getLocalMoment()).year
  );
  const [selectedMonth, setSelectedMonth] = useState(
    convertDateFromMoment(getLocalMoment()).month
  );
  useEffect(() => {
    setMyMonth(
      convertMonthFromDate(
        convertDateFromMoment(
          getLocalMoment()
            .year(selectedYear)
            .month(selectedMonth - 1)
            .date(1)
        )
      )
    );
  }, [selectedYear, selectedMonth]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    if (
      event.target.name === 'year-selector' &&
      typeof event.target.value === 'number'
    ) {
      setSelectedYear(event.target.value);
    } else if (
      event.target.name === 'month-selector' &&
      typeof event.target.value === 'number'
    ) {
      setSelectedMonth(event.target.value);
    }
  };

  const [selectionList, setSelectionList] = useState<IDate[]>([]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const processDateInSelectionList = (date: IDate): void => {
    if (!selectionList.includes(date)) {
      setSelectionList((prevSelectionList) => [...prevSelectionList, date]);
    } else {
      setSelectionList((prevSelectionList) =>
        prevSelectionList.filter((dateElem) => dateElem !== date)
      );
    }
  };

  const emptySelectionList = () => {
    setSelectionList([]);
  };

  useEffect(() => {
    setItems(itemsForCalendar);
    console.log(itemsForCalendar);
  }, [itemsForCalendar]);

  return (
    <>
      <AppBar position='static'>
        <Toolbar
          disableGutters
          sx={{ p: 2 }}>
          {title && <Typography>{title}</Typography>}
          <FormControl style={{ minWidth: 200, margin: '2.5vw' }}>
            <InputLabel id='select-year'>Year</InputLabel>
            <Select
              name='year-selector'
              label='Year'
              value={selectedYear}
              onChange={handleChange}>
              {yearsToShow &&
                yearsToShow.map((year) => (
                  <MenuItem
                    key={year}
                    value={year}>
                    {year}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl style={{ minWidth: 200, margin: '2.5vw' }}>
            <InputLabel id='select-month'>Month</InputLabel>
            <Select
              name='month-selector'
              label='Month'
              value={selectedMonth}
              onChange={handleChange}>
              {monthNames &&
                Object.keys(monthNames).map(
                  (month: string, index: number, array: string[]) => (
                    <MenuItem
                      key={parseInt(month)}
                      value={parseInt(month)}>
                      {monthNames[parseInt(month)]}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Grid container>
          <Grid
            item
            margin={'5vw'}>
            <MonthGrid
              month={myMonth}
              items={items}
              selectionList={selectionList}
              emptySelectionList={emptySelectionList}
              processDateInSelectionList={processDateInSelectionList}
              isMouseDown={isMouseDown}
              setIsMouseDown={setIsMouseDown}
              callbackFunction={callbackFunction}
              wrapper={wrapper}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EasyCalendar;
