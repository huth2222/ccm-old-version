import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PassCommentPopup from "../../../CommonComponent/PassCommentPopup";

export default function ButtonGroup({
  handleClickOpen,
  setCurrentIndex,
  payload,
  userId,
}) {
  let { action } = useParams();
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = React.useState(false);

  const handleClickOpenCancel = () => {
    setOpenPopup(true);
  };

  function handleClosePopup() {
    setOpenPopup(false);
  }

  return (
    <>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42"></div>
        <div
          className="w-2/5 flex justify-center mt-6"
          style={{ marginBottom: "6rem" }}
        >
          {action === "addinfo" ? (
            <Button
              sx={{
                marginRight: "14px",
                color: "black",
                border: "1px solid black",
              }}
              variant="outlined"
              size="medium"
              onClick={() => handleClickOpen("Cancel/Back to Requestor Topics")}
            >
              CANCEL
            </Button>
          ) : (
            <>
              <Button
                sx={{
                  marginRight: "14px",
                  color: "black",
                  border: "1px solid black",
                }}
                variant="outlined"
                size="medium"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => navigate("/user")}
              >
                Back To Dashboard
              </Button>
            </>
          )}

          {action === "addinfo" && (
            <>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => handleClickOpen("Back to Requestor Topics")}
              >
                BACK TO REQUESTOR
              </Button>
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => setOpenPopup(true)}
                title="All data are correct and verified."
              >
                PASS
              </Button>
            </>
          )}
        </div>
      </div>
      <PassCommentPopup
        handleClickOpen={handleClickOpenCancel}
        handleClosePopup={handleClosePopup}
        open={openPopup}
        payload={payload}
        BoxTitle={"Comment and Confirm"}
        coApprovalCheckbox={false}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
}
