import { Button } from "@mui/material";
import React, { useState } from "react";
import { putAxiosCallWthDataTypeJson } from "../../../../Utility/HelperFunction";
import { useNavigate, useParams } from "react-router-dom";
import PassCommentPopup from "../../../CommonComponent/PassCommentPopup";
import {
  createUser,
  useAuthorizeStore,
  useBillingStore,
  useSalesStore,
  useUploadItemStore,
} from "../../../../Store/createUserStore";
import { validateObjectIncludes } from "../../../../Utility/Constant";

export default function ButtonGroup({
  handleClickOpen,
  setCurrentIndex,
  payload,
  userId,
  userRole,
}) {
  let { action } = useParams();
  const navigate = useNavigate();
  // const [isSubmit, setIsSubmit] = useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);

  const salesStore = useSalesStore((state) => state.saleInfomation);
  const authorizeStore = useAuthorizeStore((state) => state.authorizeDirector);
  const billingInfoStore = useBillingStore((state) => state.billingStoreData);
  const sendSubmitTrueToStore = createUser((state) => state.sendSubmitTrue);

  const isValidSalesData = () => {
    const includeFields = [
      "salesOffice",
      "salesDistrict",
      "salesGroup",
      "shippingCondition",
      "paymentTerm",
      "creditLimit",
    ];
    return validateObjectIncludes(salesStore, includeFields);
  };

  const isValidAuthorizeData = () => {
    const includeFields = [
      "firstName",
      "lastName",
      "countryCode",
      "postalCode",
      "city",
      "houseNo",
      "transportZoneCode",
      "region",
    ];
    // Check if every object in the array has empty values for the specified fields
    return authorizeStore?.every((obj) => {
      return includeFields.every((field) => obj[field] !== "");
    });
  };

  const isValidBillingData = () => {
    const includeFields = [
      "postalCode",
      // "city",
      "addressLine1",
      "region",
      "transportZoneCode",
      "transportZone",
      "countryCode",
      "country",
    ];

    const validName = () => {
      try {
        if (billingInfoStore?.name?.length > 0) {
          let value_check = 0;
          billingInfoStore?.name?.filter((x) => {
            if (x.trim()?.length > 0) {
              value_check += 1;
            }
          });
          if (value_check === billingInfoStore?.name?.length) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    if (
      validateObjectIncludes(billingInfoStore, includeFields) &&
      validName()
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isAllDataValid = () => {
    if (billingInfoStore.billingAddressChoose === "sameAddress") {
      return isValidAuthorizeData() && isValidSalesData() ? true : false;
    } else {
      return isValidAuthorizeData() &&
        isValidSalesData() &&
        isValidBillingData()
        ? true
        : false;
    }
  };

  const handleClickOpenCancel = () => {
    setOpenPopup(true);
  };

  function handleClosePopup() {
    setOpenPopup(false);
  }

  const handlePass = () => {
    sendSubmitTrueToStore();
    // setIsSubmit(true);
    isAllDataValid() && setOpenPopup(true);
  };

  return (
    <>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42"></div>
        <div
          className="flex justify-center w-2/5 mt-6"
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
                onClick={() => handlePass()}
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
        BoxTitle={"Select Co-Approval"}
        coApprovalCheckbox={userRole === "ARMaster" ? true : false}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
}
