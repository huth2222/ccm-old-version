import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  putAxiosCallWthDataTypeJson,
  putAxiosCall,
} from "../../../../Utility/HelperFunction";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import {
  useAuthorizeStore,
  useBillingStore,
  useSalesStore,
  useUploadItemStore,
} from "../../../../Store/createUserStore";
// import {
//   useAuthorizeStore,
// useBillingStore,
// useSalesStore,
// useUploadItemStore,
// } from "../../../Store/createUserStore";

export default function ChangePassCommentPopup({
  handleClosePopup,
  open,
  payload,
  coApprovalCheckbox = false,
  BoxTitle,
  setCurrentIndex,
}) {
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [wordCound, setWordCound] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [ID, setID] = React.useState("");
  let { userId, jobId } = useParams();

  const salesStore = useSalesStore((state) => state.saleInfomation);
  const authorizeStore = useAuthorizeStore((state) => state.authorizeDirector);
  // const billingStoreData = useBillingStore((state) => state.billingAddress);
  const billingInfoStore = useBillingStore((state) => state.billingStoreData);
  const uploadStore = useUploadItemStore((state) => state.uploadItems);
  const navigate = useNavigate();

  const handleOutsideClickClose = (event, reason) => {
    if (reason && reason == "backdropClick" && "escapeKeyDown") return;
    setWordCound(0);
    setComment("");
    handleClosePopup();
  };

  const handleBack = () => {
    setWordCound(0);
    setComment("");
    handleClosePopup();
  };

  const handleChange = (e) => {
    setWordCound(e.target.value.length);
    setComment(e.target.value);
  };

  const [coApprovalData, setCoApprovalData] = React.useState({
    isSkipCoApprover: false,
    CEO: false,
    "AVP F&A": false,
    "AR Manager": false,
    CFO: false,
  });

  function getKeysWithAllTrueValues(obj) {
    const trueKeys = Object.keys(obj).filter((key) => obj[key] === true);
    return trueKeys;
  }

  const handleCheckBox = (e) => {
    const data = {
      ...coApprovalData,
      [e.target.name]: e.target.checked,
    };
    setCoApprovalData(data);
  };

  const arOfficerPayload = {
    data: {
      comment: comment,
      //   saleInfomation: payload,
    },
  };

  const arMasterPayloadData = {
    data: {
      isSkipCoApprover: coApprovalData.isSkipCoApprover,
      coApproval: !coApprovalData.isSkipCoApprover
        ? getKeysWithAllTrueValues(coApprovalData)
        : [],
      comment: comment,
    },
  };

  const payloadData = coApprovalCheckbox
    ? arMasterPayloadData
    : arOfficerPayload;

  const handleConfirm = async () => {
    setIsSubmit(true);
    // update ข้อมูลจาก AR Master
    await putAxiosCallWthDataTypeJson(`job/submitUpdateJob/${jobId}`, payload);

    const sendRequest = await putAxiosCallWthDataTypeJson(
      `job/approveJob/${ID}`,
      payloadData
    );
    if (sendRequest.status === 200) {
      console.log(sendRequest);
      setIsSubmit(false);
      setCurrentIndex(2);
      location.pathname.split("/")[1] === "change-request" && navigate("/user");
    } else {
      setIsSubmit(false);
    }
  };

  React.useEffect(() => {
    userId && setID(userId);
    jobId && setID(jobId);
  }, [userId, jobId]);

  // console.log(coApprovalData);
  // console.log(location.pathname.split("/")[1]);
  // console.log(userId, jobId);

  return (
    <div>
      <Dialog open={open} onClose={handleOutsideClickClose}>
        <DialogTitle className="text-center">{BoxTitle}</DialogTitle>
        <DialogContent>
          {coApprovalCheckbox && (
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color="error" />}
                label="Skip Co-Approval"
                className="text-green"
                sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                name="isSkipCoApprover"
                onChange={handleCheckBox}
              />
              {!coApprovalData.isSkipCoApprover && (
                <>
                  <FormControlLabel
                    control={<Checkbox color="error" />}
                    label="AR Manager(duangjai_s@toagroup.com)"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                    name="AR Manager"
                    onChange={handleCheckBox}
                  />
                  <FormControlLabel
                    control={<Checkbox color="error" />}
                    label="AVP F&A (pattaraporn_k@toagroup.com )"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                    name="AVP F&A"
                    onChange={handleCheckBox}
                  />
                  <FormControlLabel
                    control={<Checkbox color="error" />}
                    label="CFO (surasak_m@toagroup.com)"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                    name="CFO"
                    onChange={handleCheckBox}
                  />
                  <FormControlLabel
                    control={<Checkbox color="error" />}
                    label="CEO (jatuphat@toagroup.com)"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                    name="CEO"
                    onChange={handleCheckBox}
                  />
                </>
              )}
            </FormGroup>
          )}
          <textarea
            className="p-2 mt-2 border rounded"
            aria-label="minimum height"
            rows={6}
            cols="45"
            placeholder="Give Your Comments Here."
            maxLength={500}
            value={comment}
            onChange={handleChange}
            style={{ resize: "none" }}
          />
          <p className="ml-1">{`${wordCound}/500`}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="medium" onClick={handleBack}>
            BACK
          </Button>
          <Button
            onClick={() => handleConfirm()}
            style={{ color: "#FFFFFF", background: "#5ae4a7" }}
            disabled={isSubmit ? true : false}
            size="medium"
          >
            {isSubmit ? "Loading..." : "CONFIRM"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
