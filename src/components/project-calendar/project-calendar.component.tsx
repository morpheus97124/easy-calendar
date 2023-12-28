import { useState, useEffect } from 'react';
import EasyCalendar, {
  convertDateFromIDate,
} from '../easy-calendar/easy-calendar.component';
import { IDate } from '../easy-calendar/types';
import ItemComponent from './item.component';
import ProjectCalendarModal from './project-calendar-modal.component';
import { IProjectWithDate } from './util';
import { dataForCalendar } from './data';

const ProjectCalendar = () => {
  const [openProjectHour, setOpenProjectHourDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const handleClose = () => {
    setOpenProjectHourDialog(false);
  };

  function openProjectHourDialog() {
    setOpenProjectHourDialog(true);
  }

  const compareDateStrings = (a: string, b: string) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  };

  const CustomCalendarCallback = (
    list: IDate[],
    items?: IProjectWithDate[]
  ) => {
    const newArr: Array<string> = [];
    list.forEach((idate) => {
      newArr.push(convertDateFromIDate(idate).toDateString());
    });
    setSelectedDate(newArr.sort(compareDateStrings));
    openProjectHourDialog();
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/data.json');
      const data = await response.json();
      return data.projects;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const getItemsForCustomCalendar = async () => {
    const data = fetchData().catch((error) => {
      console.error('Error in fetchData:', error);
    });
    return data;
  };

  const [itemsForCalendar, setItemsForCalendar] = useState<IProjectWithDate[]>(
    []
  );

  const setItemsFirstTime = async () => {
    //getItemsForCustomCalendar().then((data) => setItemsForCalendar(data));
    setItemsForCalendar(dataForCalendar);
  };
  useEffect(() => {
    setItemsFirstTime();
  }, []);

  return (
    <>
      <ProjectCalendarModal
        open={openProjectHour}
        handleClose={handleClose}
        items={itemsForCalendar}
        setItemsForCalendar={setItemsForCalendar}
        selectedDate={selectedDate}
      />
      <EasyCalendar
        title={'Easy-Calendar Demo'}
        callbackFunction={CustomCalendarCallback}
        loadItems={getItemsForCustomCalendar}
        itemsForCalendar={itemsForCalendar}
        wrapper={ItemComponent}
      />
    </>
  );
};

export default ProjectCalendar;
