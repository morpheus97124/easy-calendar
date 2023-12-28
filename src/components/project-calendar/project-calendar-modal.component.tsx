import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { WrapperBackgroundColors } from './item.component';
import ColorPalette from './color-palette.component';
import ProjectList from './item-list.component';
import {
  IProject,
  IProjectWithDate,
  config,
  getDateMembersFromSelectedDate,
  isStringEqual,
  returnDaysTitle,
} from './util';

const ProjectCalendarModal = ({
  open,
  handleClose,
  items,
  setItemsForCalendar,
  selectedDate,
}: {
  open: boolean;
  handleClose: () => void;
  items: IProjectWithDate[];
  setItemsForCalendar: React.Dispatch<SetStateAction<IProjectWithDate[]>>;
  selectedDate: Array<string>;
}) => {
  const [projectNameArray, setProjectNameArray] = useState<string[]>([]);
  const [taskNameArray, setTaskNameArray] = useState<string[]>([]);

  const [newSelectedColor, setNewSelectedColor] = useState<string>(
    config.default_color
  );

  const updateNameArrays = (itemArr: IProjectWithDate[]) => {
    let projectArr: string[] = projectNameArray;
    let taskArr: string[] = taskNameArray;
    items.forEach((item) => {
      if (!projectArr.includes(item.project.projectName)) {
        projectArr.push(item.project.projectName);
      }
      if (!taskArr.includes(item.project.taskName)) {
        taskArr.push(item.project.taskName);
      }
    });
    setProjectNameArray(projectArr);
    setTaskNameArray(taskArr);
  };

  useEffect(() => {
    updateNameArrays(items);
  }, [items]);

  const validationSchema = yup.object().shape({
    projectName: yup.string().required('Needed field'),
    taskName: yup.string().required('Needed field'),
    hour: yup
      .number()
      .required('Needed field')
      .min(1, 'Must be a positive number')
      .max(24)
      .typeError('Number only'),
    color: yup.string().required(),
  });

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [colorPaletteOpen, setColorPaletteOpen] = useState<boolean>(false);

  const handleColorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setColorPaletteOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleColorClose = () => {
    setColorPaletteOpen(false);
    setAnchorEl(null);
  };

  const newColorPaletteAction = (colorCode: string) => {
    setNewSelectedColor(colorCode);
    formik.setFieldValue('color', colorCode);
    handleColorClose();
  };

  const getJsonObject = (values: IProject, date: string): IProjectWithDate => {
    const { year, month, day } = getDateMembersFromSelectedDate(date);
    return {
      year: year,
      month: month,
      day: day,
      project: {
        projectName: values.projectName,
        taskName: values.taskName,
        hour: values.hour,
        color: values.color,
      },
    };
  };

  const shouldAccumulate = (val: IProject, date: string): number => {
    const { year, month, day } = getDateMembersFromSelectedDate(date);
    let ret = -1;
    items.forEach((item, index) => {
      if (
        item.year === year &&
        item.month === month &&
        item.day === day &&
        item.project.projectName == val.projectName &&
        item.project.taskName === val.taskName
      ) {
        ret = index;
      }
    });
    return ret;
  };

  const saveItem = (val: IProject) => {
    let obj: IProjectWithDate;
    let items2: IProjectWithDate[] = [];
    items.forEach((item) => {
      items2.push({
        year: item.year,
        month: item.month,
        day: item.day,
        project: {
          projectName: item.project.projectName,
          taskName: item.project.taskName,
          hour: item.project.hour,
          color: item.project.color,
        },
      });
    });
    if (selectedDate.length === 1) {
      //1 item
      obj = getJsonObject(val, selectedDate[0]);
      const accIndex = shouldAccumulate(val, selectedDate[0]);
      if (accIndex === -1) {
        items2.push(obj);
      } else {
        items2[accIndex].project.color = val.color;
        let x: string = items2[accIndex].project.hour;
        items2[accIndex].project.hour = (
          parseInt(x) + parseInt(val.hour)
        ).toString();
      }
    } else {
      //more item
      selectedDate.map((date) => {
        obj = getJsonObject(val, date);
        let accIndex = shouldAccumulate(val, date);
        if (accIndex === -1) {
          items2.push(obj);
        } else {
          items2[accIndex].project.color = val.color;
          let x: string = items2[accIndex].project.hour;
          items2[accIndex].project.hour = (
            parseInt(x) + parseInt(val.hour)
          ).toString();
        }
      });
    }
    setItemsForCalendar(items2);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      projectName: '',
      taskName: '',
      hour: config.minimum_hour.toString(),
      color: config.default_color,
    },
    validationSchema: validationSchema,
    onSubmit: (values: IProject) => {
      if (
        //none of them is undefined
        !(values.projectName === '' || values.taskName === '')
      ) {
        saveItem(values);
        formik.values.projectName = '';
        formik.values.taskName = '';
      } else {
        console.error('not enough data to create new project');
      }
    },
  });
  const handleCloseDialog = () => {};

  const changeTextField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    argument: string
  ) => {
    const value = event.target.value;
    formik.setFieldValue(argument, value);
  };

  const changeAutoComplete = (argument: string, value: string) => {
    formik.setFieldValue(argument, value);
  };

  return selectedDate.length > 0 ? (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: '100%',
        },
      }}>
      <DialogTitle sx={{ alignItems: 'center' }}>
        {returnDaysTitle(selectedDate)}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            justifyContent: 'top',
          }}>
          <Typography
            variant='h6'
            sx={{ textDecoration: 'underline' }}>
            {selectedDate.length > 1
              ? 'Matching items in this period'
              : 'Items on this day'}
          </Typography>
          <ProjectList
            selectedDate={selectedDate}
            items={items}
            setItemsForCalendar={setItemsForCalendar}
            projectNameArray={projectNameArray}
            taskNameArray={taskNameArray}
          />
          <Typography
            variant='h6'
            sx={{ textDecoration: 'underline' }}>
            Registering new item
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Autocomplete
              id='new-projectName-AC'
              sx={{ mt: 1 }}
              freeSolo
              options={projectNameArray}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id='new-projectName-TF'
                  label='Project name'
                  name='newProjectNameTF'
                />
              )}
              value={formik.values.projectName}
              onInputChange={(event, newVal) =>
                changeAutoComplete('projectName', newVal)
              }
              isOptionEqualToValue={isStringEqual}
              disableClearable={true}
            />
            <Autocomplete
              id='new-taskName-AC'
              sx={{ mt: 2 }}
              freeSolo
              options={taskNameArray}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id='new-taskName-TF'
                  label='Task name'
                  name='newTaskNameTF'
                />
              )}
              value={formik.values.taskName}
              onInputChange={(event, newVal) =>
                changeAutoComplete('taskName', newVal)
              }
              isOptionEqualToValue={isStringEqual}
              disableClearable={true}
            />

            <Autocomplete
              id={'new-hour-AC'}
              sx={{ mt: 2, flex: 1 }}
              freeSolo
              options={['1', '2', '3', '4', '5', '6', '7', '8']}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id='new-hour-TF'
                  label='Hour'
                  name='hourField'
                />
              )}
              value={formik.values.hour}
              onInputChange={(event, newVal) =>
                changeAutoComplete('hour', newVal)
              }
              isOptionEqualToValue={isStringEqual}
              disableClearable={true}
            />
            <Box
              id='new-color-popover-container'
              sx={{ mt: 2, width: '40px', height: '40px' }}
              display='flex'>
              <Box
                sx={{
                  backgroundColor: newSelectedColor,
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.25rem',
                  '&:hover': {
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
                onClick={(event) => handleColorClick(event)}
              />
              <Popover
                id={'new-color-popover'}
                open={colorPaletteOpen}
                anchorEl={anchorEl}
                onClose={handleColorClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}>
                <ColorPalette
                  colors={WrapperBackgroundColors}
                  action={newColorPaletteAction}
                />
              </Popover>
            </Box>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type='submit'
                variant='contained'>
                Save
              </Button>
            </DialogActions>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default ProjectCalendarModal;
