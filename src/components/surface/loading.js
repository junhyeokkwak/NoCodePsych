import { Backdrop, CircularProgress } from "@mui/material";

export const Loading = ({ loading }) => {
  console.log("loading", loading);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" style={{ zIndex: 1200 }} />
    </Backdrop>
  );
};
