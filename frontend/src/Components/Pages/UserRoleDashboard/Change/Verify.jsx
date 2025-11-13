import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputText from "../../../CommonComponent/InputText";
import { useNavigate } from "react-router-dom";
import { changeUserStore } from "../../../../Store/changeUserStore";
import { postAxiosCall } from "../../../../Utility/HelperFunction";
import { areAllValuesFalse } from "../../../../Utility/Constant";
import {
  fetchDataList,
  useGeneralInfoStore,
} from "../../../../Store/createUserStore";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import { userDashboardStore } from "../../../../Store/jobDashboard";

export default function Verify() {
  const navigate = useNavigate();
  const fetchJob = userDashboardStore((state) => state.fetchJob);
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};

  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const updateChangeSelectedStore = changeUserStore(
    (state) => state.updateSelectionState
  );
  const updateVerifyChangeData = changeUserStore(
    (state) => state.updateVerifyObjChange
  );
  const changeSelectedData = changeUserStore(
    (state) => state.selectedChangeOption
  );
  const updateJobIdInStore = useGeneralInfoStore(
    (state) => state.updateResponseJobIdState
  );
  const salesDistricts = fetchDataList((state) => state.salesDistrictList);

  const [customerId, setcustomerId] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCustomerFound, setIsCustomerFound] = useState(null);
  const [verifiedData, setverifiedData] = useState({
    CompanyCode: userParsedData?.companyCode,
    DistChan: "",
    salesDistrict: "",
  });
  const [disablecustomerid, setDisableCustomerID] = useState(false);

  const [selection, setSelection] = useState({
    name: false,
    telephoneNo: false,
    address: false,
    email: false,
    billingAddress: false,
    creditLimit: false,
    paymentTerm: false,
    priceList: false,
  });

  const handleSelection = (e) => {
    const { name, checked } = e.target;

    const copiedData = {
      ...selection,
      [name]: checked,
    };
    setSelection(copiedData);
  };

  const handleSelectDropdown = (e) => {
    const { name, value } = e.target;
    setverifiedData({
      ...verifiedData,
      [name]: value,
    });
  };

  const payloadData = {
    customerId: customerId,
    jobType: "changeCustomer",
    companyCode: userParsedData?.companyCode,
  };

  const verifyCustomerId = async () => {
    setIsSubmit(true);
    if (customerId) {
      setIsLoading(true);
      const sendRequest = await postAxiosCall(
        "customers/verifyData",
        payloadData
      );

      if (sendRequest.status === 200) {
        setIsCustomerFound(true);
        const responseData = sendRequest.data;
        await fetchJob(responseData.id);
        const { CompanyCode, DistChan } = responseData.customer;
        updateJobIdInStore(responseData.id);
        setverifiedData({
          ...verifiedData,
          // CompanyCode,
          DistChan,
        });
        // localStorage.setItem("channel", DistChan);
        setIsSubmit(false);
        setIsLoading(false);
        setIsError(false);
        setDisableCustomerID(true);
      } else {
        // console.log("not found");
        setIsError(true);
        setIsCustomerFound(false);
        setIsLoading(false);
        setIsSubmit(false);
        setDisableCustomerID(false);
      }
      // console.log(sendRequest);
    }
  };

  const handleNext = async () => {
    setIsSubmit(true);
    if (verifiedData.DistChan && verifiedData.salesDistrict && customerId) {
      const verifyObjConstructed = {
        customerId: customerId,
        channel: verifiedData.DistChan,
        companyCode: verifiedData.CompanyCode,
        salesDistrict: verifiedData.salesDistrict,
      };
      updateVerifyChangeData(verifyObjConstructed);
      localStorage.setItem("channel", verifiedData.DistChan);
      setIsSubmit(false);
      navigate("/change-request");
    }
  };

  useEffect(() => {
    updateChangeSelectedStore(selection);
  }, [selection]);

  useEffect(() => {
    setSelection({
      ...selection,
      ...changeSelectedData,
    });
  }, []);

  // useEffect(() => {
  //   verifiedData.CompanyCode && fetchDropDownData(verifiedData.CompanyCode);
  // }, [verifiedData.CompanyCode]);
  useEffect(() => {
    verifiedData.CompanyCode && fetchDropDownData(verifiedData.CompanyCode);
  }, [verifiedData.DistChan]);
  //
  // console.log(isSubmit ? true : false);
  // console.log(isSubmit && !verifiedData.salesDistrict ? true : false);

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8">
        <div className="w-4/12 lg:pl-48"></div>
        <div className="w-2/5">
          <p className="text-xl">
            Please Select Topic To Change Their Information
          </p>
          <div className="mt-4 ml-4">
            <>
              <p className="text-lg font-semibold">General Information.</p>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Name"
                  name="name"
                  checked={selection.name}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Mobile No."
                  name="telephoneNo"
                  checked={selection.telephoneNo}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Address"
                  name="address"
                  checked={selection.address}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Email"
                  name="email"
                  checked={selection.email}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Billing Address"
                  name="billingAddress"
                  checked={selection.billingAddress}
                  onChange={(e) => handleSelection(e)}
                />
              </FormGroup>
              <p className="mt-4 text-lg font-semibold">DOA Information.</p>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Credit Limit"
                  name="creditLimit"
                  checked={selection.creditLimit}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Payment Term"
                  name="paymentTerm"
                  checked={selection.paymentTerm}
                  onChange={(e) => handleSelection(e)}
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Price List"
                  name="priceList"
                  checked={selection.priceList}
                  onChange={(e) => handleSelection(e)}
                />
              </FormGroup>
            </>
          </div>
          {areAllValuesFalse(selection) && isCustomerFound && (
            <p className="mt-4 font-semibold text-red">
              Select At Least One Information from above that you want to
              Change.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8">
        <div className="w-4/12 lg:pl-48">
          <p className="subpixel-antialiased font-semibold text-green lg:text-3xl">
            2. Verify Step
          </p>
        </div>
        <div className="w-2/5">
          <p className="mb-4 text-xl">Please fill in the information</p>
          <InputText
            className="w-full p-8"
            required
            size="small"
            name="CustomerId"
            label="Customer Id"
            // value={"11000001"} 11002331
            value={customerId}
            onChange={(e) => setcustomerId(e.target.value)}
            error={isSubmit && !customerId ? true : false}
            wordLength={10}
            disabled={disablecustomerid}
          />
          {!isCustomerFound && isError && (
            <p className="text-red">
              Customer Not Found, Please Check Customer Id.
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
            {verifiedData.DistChan && (
              <>
                <InputText
                  className="p-8"
                  size="small"
                  name="CompanyCode"
                  label="Company Code"
                  value={verifiedData.CompanyCode}
                  disabled={true}
                />
                <TOADropdown
                  required={true}
                  dataList={userParsedData?.distChannel}
                  label="Channel"
                  name="DistChan"
                  value={verifiedData.DistChan}
                  onChange={(e) => handleSelectDropdown(e)}
                  dataArrayOfObject={false}
                  error={isSubmit && !verifiedData.DistChan ? true : false}
                />
              </>
            )}
          </div>
          {verifiedData.DistChan && (
            <TOADropdown
              required={true}
              dataList={salesDistricts}
              name="salesDistrict"
              label="Sales District"
              value={verifiedData.salesDistrict}
              onChange={(e) => handleSelectDropdown(e)}
              valueLabel={"salesDistrict"}
              valueLabel2={"Description"}
              valueKey={"salesDistrict"}
              error={isSubmit && !verifiedData.salesDistrict ? true : false}
            />
          )}

          <div className="flex justify-center w-full mt-6 mb-10">
            <Button
              style={{
                marginRight: "14px",
                color: "black",
                border: "1px solid black",
              }}
              variant="outlined"
              size="medium"
              onClick={() => navigate("/user")}
            >
              CANCEL
            </Button>
            {isCustomerFound ? (
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => handleNext()}
                disabled={areAllValuesFalse(selection)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                // onClick={() => navigate("/change-request")}
                onClick={() => verifyCustomerId()}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "VERIFY"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
