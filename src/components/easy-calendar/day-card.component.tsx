import { IDate, IDayCard, ItemType } from './types';
import { grayBg, blueBg, whiteBg } from './styles';
import { Box, Grid } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

const DayCard = ({
  day,
  items,
  selectionList,
  emptySelectionList,
  processDateInSelectionList,
  isMouseDown,
  setIsMouseDown,
  callbackFunction,
  wrapper,
}: {
  day: IDate;
  items: any[];
  selectionList: IDate[];
  emptySelectionList: () => void;
  processDateInSelectionList: (date: IDate) => void;
  isMouseDown: boolean;
  setIsMouseDown: Dispatch<SetStateAction<boolean>>;
  callbackFunction: (list: IDate[], items?: any[]) => void;
  wrapper: React.ComponentType<{ item: any }>;
}) => {
  const initDayCard = (day: IDate): IDayCard => {
    return {
      date: day,
      selected: false,
      backgroundColor: day.disabled ? grayBg : whiteBg,
    };
  };
  const dayCard = initDayCard(day);

  const handleMouseDown = () => {
    if (!dayCard.date.disabled && selectionList.length === 0) {
      processDateInSelectionList(dayCard.date);
      setIsMouseDown(true);
    }
  };

  const handleMouseUp = () => {
    if (!dayCard.date.disabled) {
      const selectionListCopy = JSON.parse(JSON.stringify(selectionList));
      callbackFunction(selectionListCopy, items);
      setIsMouseDown(false);
      emptySelectionList();
      dayCard.selected = false;
    }
  };

  const handleMouseEnter = (dayCard: IDayCard) => {
    if (!dayCard.date.disabled && !selectionList.includes(dayCard.date)) {
      processDateInSelectionList(dayCard.date);
    }
  };

  const backgroundColorHandler = () => {
    if (selectionList.includes(dayCard.date)) {
      return blueBg;
    } else {
      return dayCard.backgroundColor;
    }
  };

  const WrapperComponent = wrapper;

  const dateExists = (date: IDate) => {
    return items.some(
      (item) =>
        item.year === date.year.toString() &&
        item.month ===
          (date.month.toString().length === 1
            ? '0'.concat(date.month.toString())
            : date.month.toString()) &&
        item.day ===
          (date.day.toString().length === 1
            ? '0'.concat(date.day.toString())
            : date.day.toString())
    );
  };

  const returnItem = (date: IDate): ItemType[] => {
    return items.filter(
      (item) =>
        item.year === date.year.toString() &&
        item.month ===
          (date.month.toString().length === 1
            ? '0'.concat(date.month.toString())
            : date.month.toString()) &&
        item.day ===
          (date.day.toString().length === 1
            ? '0'.concat(date.day.toString())
            : date.day.toString())
    );
  };

  return (
    <Grid
      onMouseEnter={() => (isMouseDown ? handleMouseEnter(dayCard) : null)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      sx={{
        minWidth: '10vw',
        minHeight: '10vw',
        maxWidth: '10vw',
        maxHeight: '10vw',
        zIndex: 1,
      }}>
      <Box
        className='day-card'
        style={{
          backgroundColor: backgroundColorHandler(),
          border: '1px solid black',
        }}
        width={'100%'}
        height={'100%'}
        sx={{ zIndex: 0 }}
        position={'relative'}>
        {returnItem(dayCard.date).length > 0 && (
          <Grid
            item
            sx={{
              overflow: 'hidden',
              margin: '0.25rem',
              border: '1px solid black',
              borderRadius: '0.25rem',
            }}
            height={'75%'}>
            {dateExists(dayCard.date)
              ? returnItem(dayCard.date).map((item, id) => {
                  return (
                    <WrapperComponent
                      key={id}
                      item={returnItem(dayCard.date).at(id)}
                    />
                  );
                })
              : null}
          </Grid>
        )}
        <Box
          className='day-num'
          position={'absolute'}
          right={'0.2vw'}
          bottom={'0.2vw'}
          fontSize={'1vw'}>{`${dayCard.date.day}.`}</Box>
      </Box>
    </Grid>
  );
};

export default DayCard;
