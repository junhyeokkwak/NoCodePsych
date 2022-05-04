import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Colors from "@/design/colors";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import { DefaultButton, TwitterButton } from "../input/buttons";

export const InfoCard = ({ name, description, image }) => {
  return (
    <StyledCard
      variant="outlined"
      sx={{
        height: {
          xs: 245,
          sm: 280,
        },
      }}
      hoverShadow={10}
    >
      <React.Fragment>
        <CardMedia component="img" height="140" image={image} />
        <CardContent>
          <Typography
            variant="body1"
            component="div"
            style={{ fontWeight: 500 }}
            align="left"
          >
            {name}
          </Typography>
          {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontSize: 13, paddingTop: 8 }}
            align="left"
          >
            {description}
          </Typography>
        </CardContent>
        {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      </React.Fragment>
    </StyledCard>
  );
};

export const FullInfoCard = ({
  name,
  description,
  labels = [],
  image,
  stats = [],
  url = {},
}) => {
  return (
    <Grid container item xs={12}>
      <Card
        elevation={0}
        style={{
          background: "transparent",
          justifyContent: "center",
        }}
      >
        <CardContent style={{ width: "100%" }}>
          <Grid container justify="center" spacing={1}>
            <Grid container item xs={12} justifyContent="center">
              <Avatar
                variant="rounded"
                src={image}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 20,
                  borderColor: Colors.white,
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 20 }}>
              <Typography
                variant="h4"
                align="center"
                style={{ fontWeight: 600 }}
              >
                {name}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingBottom: 6 }}>
              <Typography
                variant="subtitle1"
                align="center"
                color={Colors.gray}
                style={{ fontWeight: 300 }}
              >
                {description}
              </Typography>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              {labels.map((label) => {
                return (
                  <Chip
                    variant="outlined"
                    size="medium"
                    label={label}
                    key={`${label}`}
                    style={{ margin: 2 }}
                  />
                );
              })}
            </Grid>
            <Grid item xs={12} style={{ margin: 10, marginTop: 30 }}>
              <Divider />
            </Grid>
            <Grid
              container
              item
              xs={12}
              justifyContent="center"
              style={{ paddingTop: 20 }}
            >
              {stats.map((statObj, index) => (
                <Grid
                  container
                  item
                  xs={12}
                  md={8}
                  xl={7}
                  justifyContent="space-between"
                  style={{ margin: 3 }}
                  key={index}
                >
                  <Grid item>
                    <Typography color={Colors.gray}>{statObj.label}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{statObj.value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} style={{ margin: 10, marginTop: 30 }}>
              <Divider />
            </Grid>
            <Grid
              container
              item
              xs={12}
              justifyContent="center"
              style={{ paddingTop: 30 }}
            >
              {"twitter" in url && (
                <TwitterButton
                  startIcon={<TwitterIcon />}
                  style={{ margin: 5 }}
                  onClick={() => {
                    window.open(url.twitter);
                  }}
                >
                  Twitter
                </TwitterButton>
              )}

              {"website" in url && (
                <DefaultButton
                  startIcon={<LanguageIcon />}
                  style={{ margin: 5 }}
                  onClick={() => {
                    window.open(url.website);
                  }}
                >
                  Website
                </DefaultButton>
              )}
            </Grid>
          </Grid>
        </CardContent>
        {/* </div> */}
      </Card>
    </Grid>
  );
};

const StyledCard = styled(Card)(({ theme, hoverShadow = 1 }) => ({
  ":hover": {
    transform: "scale3d(1.03, 1.03, 1)",
  },
}));
