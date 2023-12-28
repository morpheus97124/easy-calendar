import { Box } from '@mui/material';
import { IProject } from './util';

export const WrapperBackgroundColors = {
  'Light Gray': '#F5F5F5',
  'Sky Blue': '#87CEEB',
  'Pale Green': '#98FB98',
  Lavender: '#E6E6FA',
  Peach: '#FFDAB9',
  'Mint Cream': '#F5FFFA',
  Beige: '#F5F5DC',
  'Light Coral': '#F08080',
  'Light Slate Gray': '#778899',
  'Pale Turquoise': '#AFEEEE',
  'Lemon Chiffon': '#FFFACD',
  Lilac: '#C8A2C8',
};

const ItemComponent = ({ item }: { item: IProject }) => {
  const setBackgroundColor = () => {
    return item.project.color;
  };

  return (
    <Box
      sx={{
        backgroundColor: setBackgroundColor(),
        fontSize: '0.7vw',
        border: '1px solid black',
        padding: '0.2vw',
        justifyContent: 'center',
        zIndex: 10,
        userSelect: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {item.project.hour === '1'
        ? `${item.project.projectName} : ${item.project.taskName} ${item.project.hour} hour`
        : `${item.project.projectName} : ${item.project.taskName} ${item.project.hour} hours`}
    </Box>
  );
};

export default ItemComponent;

export const ClickMuncher = ({ children }: { children: JSX.Element }) => {
  return <div onClick={(e) => e.stopPropagation()}>{children}</div>;
};
