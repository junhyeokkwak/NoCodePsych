import { Avatar } from "@mui/material";

const STANDARD_SHORT_SIDE = 210;
const STANDARD_LONG_SIDE = 280;

export const getImageCard = (url, width, height) => {
  const shape = width >= height ? "landscape" : "portrait";
  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Avatar
        variant="rounded"
        sx={
          shape === "landscape"
            ? { width: STANDARD_LONG_SIDE, height: STANDARD_SHORT_SIDE }
            : { width: STANDARD_SHORT_SIDE, height: STANDARD_LONG_SIDE }
        }
        src={url}
      ></Avatar>
    </div>
  );
};
