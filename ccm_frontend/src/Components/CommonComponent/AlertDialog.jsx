import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ handleClose, open, handleSend }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ padding: "2rem" }}>
          <DialogContentText id="alert-dialog-description">
            Update may take some time to Complete, plese wait till complete.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSend} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
