import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import { putAxiosCallWthDataTypeJson } from "../../Utility/HelperFunction";
import { Title } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { putAxiosCallWthDataTypeJson } from "../../../../Utility/HelperFunction";
import { toast } from "react-toastify";

export default function ChangeRejectReasonPopUP({
  open,
  handleClose,
  rejectTitle,
  userId,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [wordCound, setWordCound] = useState(0);
  const [comment, setComment] = useState("");
  const [RejectTopic, setRejectTopic] = useState([]);
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleOutsideClickClose = (event, reason) => {
    if (reason && reason == "backdropClick" && "escapeKeyDown") return;
    handleClose();
    setWordCound(0);
    setComment("");
    setRejectTopic([]);
  };

  const handleBack = () => {
    setWordCound(0);
    setComment("");
    handleClose();
    setRejectTopic([]);
  };

  const handleChange = (e) => {
    setWordCound(e.target.value.length);
    setComment(e.target.value);
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setRejectTopic([...RejectTopic, { RejectTopic: e.target.name }]);
    } else {
      const copiedData = JSON.parse(JSON.stringify(RejectTopic));
      const filteredData = copiedData.filter(
        (obj) => obj["RejectTopic"] !== e.target.name
      );
      setRejectTopic(filteredData);
    }
  };

  const payload = {
    data: {
      comment: comment,
      rejectTopics: RejectTopic,
    },
  };

  const handleSave = async () => {
    // setIsSubmit(true);
    setIsValid(true);
    if (rejectTitle.includes("Cancel")) {
      if (comment) {
        setIsSubmit(true);
        const sendRequest = await putAxiosCallWthDataTypeJson(
          `job/cancelJob/${userId}`,
          payload
        );
        if (sendRequest.status === 200) {
          handleClose();
          setIsSubmit(false);
          setIsValid(false);
          navigate("/user");
        } else {
          toast.error(sendRequest?.response?.data?.message, {
            position: "top-center",
            autoClose: 3000,
          });
          setIsSubmit(false);
          setIsValid(false);
        }
      }
    } else {
      if (comment) {
        setIsSubmit(true);
        const sendRequest = await putAxiosCallWthDataTypeJson(
          `job/rejectJob/${userId}`,
          payload
        );
        if (sendRequest.status === 200) {
          handleClose();
          setIsSubmit(false);
          setIsValid(false);
          navigate("/user");
        } else {
          toast.error(sendRequest?.response?.data?.message, {
            position: "top-center",
            autoClose: 3000,
          });
          setIsSubmit(false);
          setIsValid(false);
        }
      }
    }
  };

  // console.log(userId);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleOutsideClickClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle className="text-center" id="responsive-dialog-title">
          {rejectTitle}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox color="error" />}
              label="Name/Email/Address"
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
              onChange={handleCheckBox}
              name="Name/Email/Address"
            />
            <FormControlLabel
              control={<Checkbox color="error" />}
              label="Credit Term/Credit Limit/Size/Buying Group"
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
              name="Credit Term/Credit Limit/Size/Buying Group"
              onChange={handleCheckBox}
            />
          </FormGroup>
          <textarea
            className="p-2 mt-2 border rounded"
            aria-label="minimum height"
            rows={3}
            cols="45"
            placeholder="Give Your Comments Here."
            maxLength={500}
            value={comment}
            onChange={handleChange}
            // style={{ resize: "none" }}
            style={{
              border: `${
                comment.length > 0 ? "1px solid green" : "1px solid red"
              }`,
              resize: "none",
            }}
          />
          {isValid && comment.length <= 0 && (
            <p className="text-red">Please Add Comments.</p>
          )}
          <p className="ml-1">{`${wordCound}/500`}</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleBack}
            autoFocus
          >
            BACK
          </Button>
          <Button
            variant="contained"
            size="medium"
            style={{ color: "#FFFFFF", background: "#5ae4a7" }}
            onClick={handleSave}
            autoFocus
            disabled={isSubmit ? true : false}
          >
            {isSubmit ? "Loading..." : "SAVE"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
