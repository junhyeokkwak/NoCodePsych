import { Button, ButtonBase, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Colors from "@/design/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const MenuTextButton = (props) => {
  return (
    <ButtonBase {...props} style={{ padding: 15 }}>
      <Typography
        noWrap
        variant="subtitle2"
        sx={{
          color: Colors.text,
          fontWeight: "bold",
          "&:hover": {
            color: Colors.primary,
          },
        }}
      >
        {props.children}
      </Typography>
    </ButtonBase>
  );
};

// export const DefaultButton = (props) => {
//   const type = props.type ? props.type : "default"; // "default", "lightBlue"
//   return styled(Button)({
//     boxShadow: "none",
//     textTransform: "none",
//     backgroundColor: type === "lightBlue" ? Colors.lightBlue : Colors.lightRed,
//     fontSize: 17,
//     lineHeight: 1.8,
//     fontWeight: 700,
//     borderRadius: 22,
//     color: type === "lightBlue" ? Colors.blue : Colors.darkRed,
//     "&:hover": {
//       backgroundColor: type === "lightBlue" ? Colors.blue : Colors.darkRed,
//       color: Colors.white,
//       borderColor: Colors.white,
//       boxShadow: "none",
//     },
//     "&:active": {
//       boxShadow: "none",
//       backgroundColor: Colors.primary,
//       borderColor: Colors.primary,
//     },
//     "&:focus": {
//       boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
//     },
//     "&:disabled": {
//       backgroundColor: "#dddddd",
//       borderColor: "#dddddd",
//       boxShadow: "none",
//     },
//   });
// }

export const DefaultButton = styled(Button)(({ type = "default" }) => ({
  boxShadow: "none",
  textTransform: "none",
  backgroundColor: "#444",
  fontSize: 17,
  lineHeight: 1.8,
  fontWeight: 500,
  borderRadius: 30,
  paddingLeft: 30,
  paddingRight: 30,
  color: Colors.white,
  "&:hover": {
    backgroundColor: Colors.primary,
    color: Colors.black,
    borderColor: Colors.white,
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
  "&:disabled": {
    backgroundColor: "#dddddd",
    borderColor: "#dddddd",
    boxShadow: "none",
  },
}));

export const TwitterButton = styled(Button)(({ type = "default" }) => ({
  boxShadow: "none",
  textTransform: "none",
  backgroundColor: "#1DA1F2",
  borderColor: "#1DA1F2",
  fontSize: 17,
  lineHeight: 1.8,
  fontWeight: 500,
  borderRadius: 30,
  paddingLeft: 30,
  paddingRight: 30,
  color: Colors.white,
  "&:hover": {
    backgroundColor: Colors.white,
    color: "#1DA1F2",
    borderColor: Colors.white,
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#1DA1F2",
    borderColor: "#1DA1F2",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
  "&:disabled": {
    backgroundColor: "#dddddd",
    borderColor: "#dddddd",
    boxShadow: "none",
  },
}));

export const LargeButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  backgroundColor: "#444",
  fontSize: 20,
  fontWeight: 500,
  lineHeight: 1.8,
  borderRadius: 30,
  color: Colors.white,
  "&:hover": {
    backgroundColor: Colors.primary,
    color: Colors.black,
    borderColor: Colors.white,
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
  "&:disabled": {
    backgroundColor: "#dddddd",
    borderColor: "#dddddd",
    boxShadow: "none",
  },
});

export const SmallButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  backgroundColor: Colors.white,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.2,
  borderRadius: 15,
  color: Colors.darkBlue,
  "&:hover": {
    backgroundColor: Colors.lightBlue,
    color: Colors.darkBlue,
    borderColor: Colors.lightBlue,
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
  "&:disabled": {
    backgroundColor: "#dddddd",
    borderColor: "#dddddd",
    boxShadow: "none",
  },
});

export const DeleteButton = (props) => {
  return (
    <IconButton
      style={{ color: Colors.lightRed, border: 50 }}
      aria-label="delete"
      component="span"
      {...props}
    >
      <DeleteIcon fontSize="large" />
    </IconButton>
  );
};

export const PreviewButton = (props) => {
  return (
    <IconButton
      style={{ color: Colors.white, border: 50 }}
      aria-label="preview"
      component="span"
      {...props}
    >
      <VisibilityIcon fontSize="large" />
    </IconButton>
  );
};
