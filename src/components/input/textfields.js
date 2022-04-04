
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Colors from "@/design/colors";

export const StyledTextField = styled(TextField)({
  "& label": {
    color: "white",
  },
  "& .MuiInputAdornment-root *": {
    color: "#bbbbbb",
  },
  "& label.Mui-focused": {
    color: Colors.lightBlue,
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: Colors.lightBlue,
    },
    "&.Mui-focused fieldset": {
      borderColor: Colors.lightBlue,
    },
    // "&.Mui-disabled": {
    //   background: "#bbbbbb",
    //   borderColor: "#bbbbbb",
    // },
  },
});

export const StandardTextField = (props) => {
  return <StyledTextField variant="outlined" fullWidth {...props}/>;
}

