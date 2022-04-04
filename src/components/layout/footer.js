import { Grid, Typography, Button } from "@mui/material";
import Colors from "@/design/colors";
import { DefaultButton } from "../input/buttons";

export const Footer = () => {
  return (
    <Grid container item xs={12} justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          Have feedback, requests, or suggestions?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          style={{ fontWeight: 300, color: Colors.gray }}
          align="center"
        >
          Reach out to us at info@mintandwear.com or fill out the form below.
        </Typography>
      </Grid>
      <Grid item style={{ paddingTop: 20, paddingBottom: 50 }}>
        <DefaultButton
          onClick={() => {
            window.open("https://forms.gle/dECKRj2yLPenjTvv5");
          }}
        >
          Request form
        </DefaultButton>
      </Grid>
    </Grid>
  );
};
