import { IDate, IMonth } from './types';
import DayCard from './day-card.component';
import './month-grid.style.scss';
import { Box, Grid } from '@mui/material';
import { Dispatch, SetStateAction, ComponentType } from 'react';

const MonthGrid = ({
  month,
  items,
  selectionList,
  emptySelectionList,
  processDateInSelectionList,
  isMouseDown,
  setIsMouseDown,
  callbackFunction,
  wrapper,
}: {
  month: IMonth;
  items: any[];
  selectionList: IDate[];
  emptySelectionList: () => void;
  processDateInSelectionList: (date: IDate) => void;
  isMouseDown: boolean;
  setIsMouseDown: Dispatch<SetStateAction<boolean>>;
  callbackFunction: (list: IDate[], items?: any[]) => void;
  wrapper: ComponentType<{ item: any }>;
}) => {
  const selectIDateByIndexes = (weekNum: number, dayNum: number): IDate => {
    const index = weekNum * 7 + dayNum;
    if (month.leftPadding.length && month.leftPadding.length - 1 >= index) {
      month.leftPadding[index].disabled = true;
      return month.leftPadding[index];
    } else if (month.days.length - 1 >= index - month.leftPadding.length) {
      month.days[index - month.leftPadding.length].dow === 6 ||
      month.days[index - month.leftPadding.length].dow === 7
        ? (month.days[index - month.leftPadding.length].disabled = true)
        : (month.days[index - month.leftPadding.length].disabled = false);
      return month.days[index - month.leftPadding.length];
    } else if (
      month.rightPadding.length - 1 >=
      index - month.leftPadding.length - month.days.length
    ) {
      //LR nem üres
      month.rightPadding[
        index - month.leftPadding.length - month.days.length
      ].disabled = true;
      return month.rightPadding[
        index - month.leftPadding.length - month.days.length
      ];
    } else {
      throw new Error('Index is out of bounds. Max should be weeks*7');
    }
  };

  const allDays =
    month.leftPadding.length + month.days.length + month.rightPadding.length;
  const rowCount = allDays / 7;
  if (Math.floor(rowCount) !== rowCount) {
    throw new Error('rowCount has to be an round number');
  }
  return (
    <>
      <Box>
        <Grid
          display={'flex'}
          flexDirection={'row'}
          width={'100%'}
          height={'10%'}>
          {[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((day) => {
            return (
              <Box
                key={day}
                display={'flex'}
                flex={1}
                justifyContent={'center'}
                style={{ border: '1px solid black' }}>
                {day}
              </Box>
            );
          })}
        </Grid>
        {Array.from(Array(rowCount).keys()).map((week) => {
          return (
            <Grid
              key={week}
              container
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              display={'flex'}
              flexDirection={'row'}>
              {Array.from(Array(7).keys()).map((day) => {
                return (
                  <DayCard
                    key={day}
                    day={selectIDateByIndexes(week, day)}
                    items={items}
                    selectionList={selectionList}
                    emptySelectionList={emptySelectionList}
                    processDateInSelectionList={processDateInSelectionList}
                    isMouseDown={isMouseDown}
                    setIsMouseDown={setIsMouseDown}
                    callbackFunction={callbackFunction}
                    wrapper={wrapper}
                  />
                );
              })}
            </Grid>
          );
        })}
      </Box>
    </>
  );
};

export default MonthGrid;
