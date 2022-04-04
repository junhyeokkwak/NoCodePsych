import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";

export const StandardDialog = (props) => {
  const {
    open,
    handleClose,
    title = "",
    bodyText = "",
    actionButtonLabels = [],
    actionButtonHandlers = [],
  } = { ...props };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {bodyText && <DialogContentText>{bodyText}</DialogContentText>}
      </DialogContent>
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {props.children}
      </div>
      <DialogActions>
        {actionButtonLabels.length > 0 &&
          actionButtonHandlers.length > 0 &&
          actionButtonLabels.length === actionButtonHandlers.length &&
          actionButtonLabels.map((label, index) => (
            <Button key={index} onClick={actionButtonHandlers[index]}>
              {label}
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
};
