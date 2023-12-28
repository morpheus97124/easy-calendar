import {
  Autocomplete,
  Box,
  Button,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import ColorPalette from './color-palette.component';
import { WrapperBackgroundColors } from './item.component';
import { SetStateAction, useEffect, useState } from 'react';
import {
  IProject,
  IProjectWithDate,
  addDateToProject,
  getDateMembersFromSelectedDate,
  getItemsForToday,
  isSameItem,
  isStringEqual,
  leaveDateFromProjects,
} from './util';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ProjectList = ({
  selectedDate,
  items,
  setItemsForCalendar,
  projectNameArray,
  taskNameArray,
}: {
  selectedDate: string[];
  items: IProjectWithDate[];
  setItemsForCalendar: React.Dispatch<SetStateAction<IProjectWithDate[]>>;
  projectNameArray: string[];
  taskNameArray: string[];
}) => {
  const [autocompleteValues, setAutocompleteValues] = useState<IProject[]>(
    leaveDateFromProjects(getItemsForToday(selectedDate, items))
  );

  const [existingAnchorEl, setExistingAnchorEl] =
    useState<HTMLDivElement | null>(null);
  const [existingColorPaletteOpen, setExistingColorPaletteOpen] =
    useState<boolean>(false);

  const handleExistingColorClick = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setExistingColorPaletteOpen(true);
    setExistingAnchorEl(event.currentTarget);
    setColorIndex(index);
  };
  const handleExistingColorClose = () => {
    setExistingColorPaletteOpen(false);
    setExistingAnchorEl(null);
  };

  const existingColorPaletteAction = (colorCode: string, index?: number) => {
    if (selectedDate.length > 2) {
      handleMultipleActions(
        colorIndex,
        selectedDate,
        'change',
        'color',
        colorCode
      );
    } else {
      changeItem(
        'color',
        selectedDate[0],
        autocompleteValues[colorIndex],
        colorCode
      );
    }
    handleExistingColorClose();
  };

  const changeItem = (
    arg: 'projectName' | 'taskName' | 'hour' | 'color',
    date: string,
    item: IProject,
    val: string
  ) => {
    const newItem: IProject = {
      ...item,
      [arg]: val,
    };
    let newItems = items;
    newItems.forEach((existingItem, index) => {
      let itemWithDate = addDateToProject(item, date);
      if (isSameItem(itemWithDate, existingItem)) {
        newItems[index] = addDateToProject(newItem, date);
      }
    });
    setItemsForCalendar(newItems);
    updateACVal2(newItems);
  };

  const updateACVal2 = (newItems: IProjectWithDate[]) => {
    setAutocompleteValues(
      leaveDateFromProjects(getItemsForToday(selectedDate, newItems))
    );
  };

  const [colorIndex, setColorIndex] = useState<number>(0);

  const deleteItem = (item: IProjectWithDate) => {
    let newItems = items;
    newItems = newItems.filter((newItem) => !isSameItem(item, newItem));
    setItemsForCalendar(newItems);
    updateACVal2(newItems);
  };

  const handleSingleChange = (
    index: number,
    date: string,
    arg: 'projectName' | 'taskName' | 'hour' | 'color',
    val: string
  ) => {
    changeItem(arg, date, autocompleteValues[index], val);
  };

  const handleMultipleActions = (
    index: number,
    selectedDate: string[],
    action: 'change' | 'delete',
    arg?: 'projectName' | 'taskName' | 'hour' | 'color',
    val?: string
  ) => {
    if (
      (arg === undefined && val !== undefined) ||
      (arg !== undefined && val === undefined)
    ) {
      console.error('Not enough arguments in handleMultipleActions');
    }
    if (selectedDate.length < 2) {
      console.error(
        'handleMultipleAction can only be called with multiple actions'
      );
    }
    let item = autocompleteValues[index];
    if (action === 'change' && arg !== undefined && val !== undefined) {
      selectedDate.forEach((date) => {
        changeItem(arg, date, item, val);
      });
    }
  };

  const deletePeriod = () => {
    let newItems = items;
    selectedDate.forEach((date) => {
      const { year, month, day } = getDateMembersFromSelectedDate(date);
      newItems = newItems.filter(
        (item) =>
          !(item.year === year && item.month === month && item.day === day)
      );
      setItemsForCalendar(newItems);
      updateACVal2(newItems);
    });
  };

  return (
    <Box id='existing-items-container'>
      <Button
        variant='outlined'
        sx={{
          borderColor: 'red',
          color: 'red',
        }}
        onClick={deletePeriod}>
        Empty this period
        <DeleteForeverIcon style={{ color: 'red' }} />
      </Button>
      {autocompleteValues.map((item, index) => (
        <Box
          key={index.toString()}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
          }}>
          <Autocomplete
            id={`existing-projectName-AC-${index}`}
            sx={{ mt: 2, mr: 2, flex: 1 }}
            freeSolo
            options={projectNameArray}
            renderInput={(params) => (
              <TextField
                {...params}
                id={`existing-projectName-TF-${index}`}
                label='Project name'
                name='Project name'
              />
            )}
            value={autocompleteValues[index].projectName}
            onInputChange={(event, val) => {
              if (selectedDate.length > 1) {
                handleMultipleActions(
                  index,
                  selectedDate,
                  'change',
                  'projectName',
                  val
                );
              } else {
                handleSingleChange(index, selectedDate[0], 'projectName', val);
              }
            }}
            isOptionEqualToValue={isStringEqual}
            disableClearable={true}
          />
          <Autocomplete
            id={`existingName-AC-${index}`}
            sx={{ mt: 2, mr: 2, flex: 1 }}
            freeSolo
            options={taskNameArray}
            renderInput={(params) => (
              <TextField
                {...params}
                id={`existing-taskName-TF-${index}`}
                label='Task name'
                name='Task name'
              />
            )}
            value={autocompleteValues[index].taskName}
            onInputChange={(event, val) => {
              if (selectedDate.length > 1) {
                handleMultipleActions(
                  index,
                  selectedDate,
                  'change',
                  'taskName',
                  val
                );
              } else {
                handleSingleChange(index, selectedDate[0], 'taskName', val);
              }
            }}
            isOptionEqualToValue={isStringEqual}
            disableClearable={true}
          />
          <Autocomplete
            id={`existing-hour-AC-${index}`}
            sx={{ mt: 2, mr: 2, flex: 1 }}
            options={['1', '2', '3', '4', '5', '6', '7', '8']}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Hour'
                name='hourField'
                id={`existing-hour-TF-${index}`}
                autoComplete='false'
              />
            )}
            value={autocompleteValues[index].hour}
            onInputChange={(event, val) => {
              if (selectedDate.length > 1) {
                handleMultipleActions(
                  index,
                  selectedDate,
                  'change',
                  'hour',
                  val
                );
              } else {
                handleSingleChange(index, selectedDate[0], 'hour', val);
              }
            }}
            isOptionEqualToValue={isStringEqual}
            disableClearable={true}
          />

          <Box
            id={`existing-popover-container-${index}`}
            sx={{
              mt: 2,
              mr: 2,
              flex: 0.25,
            }}
            display='flex'>
            <Box
              sx={{
                backgroundColor: autocompleteValues[index].color,
                width: '100%',
                height: '100%',
                borderRadius: '0.25rem',
                '&:hover': {
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={(event) => handleExistingColorClick(event, index)}
            />
          </Box>
          <Button
            variant='outlined'
            sx={{
              borderColor: 'black',
              backgroundColor: 'red',
              mt: 2,
              flex: 0.25,
              position: 'relative',
              '&:hover': {
                backgroundColor: 'white',
                borderColor: 'black',
              },
            }}
            onClick={() => {
              deleteItem(
                addDateToProject(autocompleteValues[index], selectedDate[0])
              );
            }}>
            <DeleteForeverIcon
              sx={{
                color: 'white',
                position: 'absolute',
                width: '100%',
                height: '100%',
                padding: 1,
                boxSizing: 'border-box',
                '&:hover': {
                  color: 'transparent',
                },
                transitionDuration: 0,
              }}
            />
            <Typography
              sx={{
                color: 'transparent',
                margin: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                '&:hover': {
                  color: 'red',
                },
                textAlign: 'center',
                fontWeight: 'bold',
                transitionDuration: 0,
              }}>
              Delete
            </Typography>
          </Button>
        </Box>
      ))}
      <Popover
        id={`existing-color-popover`}
        open={existingColorPaletteOpen}
        anchorEl={existingAnchorEl}
        onClose={handleExistingColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <ColorPalette
          colors={WrapperBackgroundColors}
          action={existingColorPaletteAction}
          index={colorIndex}
        />
      </Popover>
    </Box>
  );
};

export default ProjectList;
