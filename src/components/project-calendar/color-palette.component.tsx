import { Grid } from '@mui/material';

const ColorPalette = ({
  colors,
  action,
  index,
}: {
  colors: Object;
  action: (colorCode: string, index?: number) => void;
  index?: number;
}): JSX.Element => {
  const colorCodes = Object.values(colors);
  return (
    <Grid
      container
      sx={{
        width: '190px',
        height: '150px',
        padding: '15px',
      }}>
      {[0, 1, 2].map((row) => {
        return (
          <Grid
            container
            id={`ColorPaletteRow${row}`}
            item
            key={row}>
            {[0, 1, 2, 3].map((cell) => (
              <Grid
                onClick={() => action(colorCodes[row * 4 + cell], index)}
                id={`ColorPaletteCell${cell}`}
                item
                key={row.toString().concat(cell.toString())}
                sx={{
                  backgroundColor: Object.values(colors)[row * 4 + cell],
                  minWidth: '40px',
                  minHeight: '40px',
                  maxWidth: '40px',
                  maxHeight: '40px',
                }}></Grid>
            ))}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ColorPalette;
