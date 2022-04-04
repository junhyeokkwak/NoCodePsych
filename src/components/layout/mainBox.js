import { Box, Grid } from "@mui/material";
import Colors from "@/design/colors";

/**
 * For standardizing padding for main content page
 * @param {*} props
 * @returns
 */
export default function MainBox(props) {
  return (
    <Box
      padding={3}
      paddingTop={7}
      paddingBottom={7}
      style={{ backgroundColor: props.color ? props.color : Colors.white }}
    >
      <Grid container item xs={12} justifyContent="center">
        <Grid container item xs={12} md={10} lg={8} xl={6}>
          {props.children}
        </Grid>
      </Grid>
    </Box>
  );
}
