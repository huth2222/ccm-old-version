import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { memo, useEffect, useState } from "react";
import { NumberInputType } from "../../../CommonComponent/NumberInputType";
import {
  fetchDataList,
  useGeneralInfoStore,
  useSalesStore,
  useUserDataStore,
  useVerifyStore,
} from "../../../../Store/createUserStore";
import { commaFormatter, getObjectByValue } from "../../../../Utility/Constant";
import { addLeadingZeroToSingleDigit } from "../../../../Utility/Constant";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import InputText from "../../../CommonComponent/InputText";
import { useParams } from "react-router-dom";

function SalesInfo({ employeeId, name }) {
  const { action } = useParams();
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  // const getVerigyDataFromStore = useVerifyStore((state) => state.verify);
  const updateSalesStore = useSalesStore((state) => state.updateSalesDataState);
  const salesOffices = fetchDataList((state) => state.salesOfficeList);
  const salesDistricts = fetchDataList((state) => state.salesDistrictList);
  const salesGroups = fetchDataList((state) => state.salesGroupList);
  const customerGroups = fetchDataList((state) => state.customerGroupList);
  const shippingConditions = fetchDataList(
    (state) => state.shippingConditionList
  );
  const priceList = fetchDataList((state) => state.dataPriceList);
  const paymentsList = fetchDataList((state) => state.paymentTermList);
  const carrierCodeList = fetchDataList((state) => state.carrierCodeList);
  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );
  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );
  const getJobData = userDashboardStore((state) => state.job);

  const salesStore = useSalesStore((state) => state.saleInfomation);

  const fetchDropdownData = fetchDataList((state) => state.fetchDropDownData);
  const getSalesGroupData = fetchDataList((state) => state.fetchSalesGroupData);

  const getSavedPayloadFromStore = useGeneralInfoStore((state) => state.data);

  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);

  const getVerigyDataFromStore = getJobData?.verify
    ? getJobData.verify
    : getSavedPayloadFromStore.dataList?.verify;

  const [salesUserData, setSalesUserData] = useState({
    saleEmployeeCode: "",
    saleEmployeeName: "",
    carrierCode: "",
    carrierName: "",
    salesOffice: "",
    salesDistrict: "",
    salesGroup: "",
    customerGroup: "",
    shippingCondition: "",
    paymentTerm: "",
    creditLimit: "",
    priceList: "",
    branchCode: "",
    description: "",
  });
  const [formatedNumber, setFormatedNumber] = useState("");
  const handleSalesData = (e) => {
    const { name, value } = e.target;

    if (name === "creditLimit") {
      const formatedNumber = commaFormatter(value);
      setFormatedNumber(formatedNumber);
      const removeComma = formatedNumber.replace(/\,/g, "");

      setSalesUserData({ ...salesUserData, [name]: removeComma });
      // updateSalesStore({ ...salesUserData, [name]: removeComma });
    } else {
      const copiedSalesData = {
        ...salesUserData,
        [name]: value,
      };
      setSalesUserData(copiedSalesData);
      // updateSalesStore(copiedSalesData);
    }
  };

  function formatDescription(code) {
    if (getVerigyDataFromStore?.officeType === "headOffice") {
      return `สำนักงานใหญ่`;
    } else {
      return `สาขาที่ ${code}`;
    }
  }

  const updateLocalStateForEdit = (salesParamsJobData) => {
    const extractedData = salesParamsJobData?.saleInfomation ?? salesUserData;
    const verifyStoreData = salesParamsJobData?.verify ?? {};
    setSalesUserData({
      ...salesUserData,
      ...extractedData,
      branchCode: verifyStoreData?.branchCode,
    });
    setFormatedNumber(
      commaFormatter(extractedData?.creditLimit ?? formatedNumber)
    );
    updateSalesStore({
      ...salesUserData,
      ...extractedData,
      branchCode: verifyStoreData?.branchCode,
    });
  };

  const updateStateForDraft = (data) => {
    const extractedData = data?.saleInfomation;
    const formatData = {
      ...salesUserData,
      ...extractedData,
      saleEmployeeCode: employeeId,
      saleEmployeeName: name,
      // salesDistrict: parsedUserData?.salesDistrict,
      salesDistrict: getJobData?.saleInfomation?.salesDistrict,
      // salesDistrict:
      //   action === "addinfo"
      //     ? parsedUserData?.salesDistrict
      //     : getJobData.saleInfomation.salesDistrict,
      branchCode: getVerigyDataFromStore?.branchCode,
      description: formatDescription(getVerigyDataFromStore?.branchCode),
    };
    setFormatedNumber(
      commaFormatter(extractedData?.creditLimit ?? formatedNumber)
    );
    setSalesUserData(formatData);
  };

  useEffect(() => {
    const getObj = getObjectByValue(
      carrierCodeList,
      "Carrier",
      salesUserData.carrierCode
    );
    getObj &&
      setSalesUserData({
        ...salesUserData,
        carrierName: getObj?.Description,
      });
  }, [salesUserData.carrierCode, carrierCodeList]);

  // component Mount effect.
  useEffect(() => {
    fetchDropdownData(parsedUserData.companyCode);
    salesUserData.salesOffice &&
      getSalesGroupData(salesUserData.salesOffice, parsedUserData.companyCode);
  }, [salesUserData.salesOffice]);

  // console.log(salesUserData, "000000000");
  // Edit User Effect
  useEffect(() => {
    isJobDataLoadedFromAPI &&
      !getJobData.isDraft &&
      updateLocalStateForEdit(getJobData);
    updateJobLoadingStoreFalse();
  }, [isJobDataLoadedFromAPI]);

  useEffect(() => {
    setSalesUserData({
      ...salesUserData,
      saleEmployeeCode: employeeId,
      saleEmployeeName: name,
      salesDistrict: getJobData?.saleInfomation?.salesDistrict,
      // salesDistrict:
      //   action === "addinfo"
      //     ? parsedUserData?.salesDistrict
      //     : getJobData.saleInfomation.salesDistrict,
      branchCode: getVerigyDataFromStore?.branchCode,
      description: formatDescription(getVerigyDataFromStore?.branchCode),
    });
    getJobData.isDraft && updateStateForDraft(getJobData);
  }, [employeeId, name, getVerigyDataFromStore?.branchCode, getJobData]);

  useEffect(() => {
    updateSalesStore(salesUserData);
  }, [salesUserData]);

  useEffect(() => {
    if (action === "view") {
      updateStateForDraft(getJobData);
    }
  }, [getJobData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
          4. Sales Information
        </p>
        <p className="text-lg pl-9">
          Doc Date: {dayjs().format("DD/MM/YYYY : h.mm")}
        </p>
        {getJobData?.jobNumber && (
          <p className="text-lg pl-9">Document ID - {getJobData.jobNumber}</p>
        )}
      </div>
      <div className="w-2/5">
        <p className="mb-4 text-xl">Please fill the information.</p>
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <FormControl className="w-full">
            <InputLabel size="small" id="salesOffice">
              Sales Office
            </InputLabel>
            <Select
              id="salesOffice"
              size="small"
              label="Sales Office"
              name="salesOffice"
              // defaultValue=""
              value={salesUserData.salesOffice}
              onChange={(e) => handleSalesData(e)}
              error={isSubmit && !salesUserData.salesOffice ? true : false}
              disabled={action !== "addinfo" ? true : false}
            >
              {salesOffices.map((office) => {
                return (
                  <MenuItem key={office._id} value={office.SalesOffice}>
                    {`${office.SalesOffice} - ${office.Description}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className="w-full">
            <InputLabel size="small" id="salesDistrict">
              Sales District
            </InputLabel>
            <Select
              required
              size="small"
              id="salesDistrict"
              name="salesDistrict"
              label="Sales District"
              value={salesUserData.salesDistrict}
              onChange={(e) => handleSalesData(e)}
              error={isSubmit && !salesUserData.salesDistrict ? true : false}
              disabled={action !== "addinfo" ? true : false}
            >
              {salesDistricts.map((district) => {
                return (
                  <MenuItem
                    key={district.salesDistrict}
                    value={district.salesDistrict}
                  >
                    {`${district.salesDistrict} - ${district.Description}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className="w-full">
            <InputLabel size="small" id="salesGroup-1">
              Sales Group
            </InputLabel>
            <Select
              required
              size="small"
              id="salesGroup"
              name="salesGroup"
              label="Sales Group"
              // defaultValue=""
              value={salesUserData.salesGroup}
              onChange={(e) => handleSalesData(e)}
              error={isSubmit && !salesUserData.salesGroup ? true : false}
              disabled={action !== "addinfo" ? true : false}
            >
              {salesGroups.map((group) => {
                return (
                  <MenuItem key={group._id} value={group.SalesGroup}>
                    {`${group.SalesGroup} - ${group.SaleGroupDescription}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className="w-full">
            <InputLabel size="small" id="customerGroup-1">
              Customer Group
            </InputLabel>
            <Select
              // required
              size="small"
              id="customerGroup"
              name="customerGroup"
              label="Customer Group"
              // defaultValue=""
              value={
                salesUserData.customerGroup ? salesUserData.customerGroup : ""
              }
              onChange={(e) => handleSalesData(e)}
              disabled={action !== "addinfo" ? true : false}
              // error={isSubmit && !salesUserData.customerGroup ? true : false}
            >
              {customerGroups.map((customers) => {
                return (
                  <MenuItem
                    key={customers.CustomerGroup}
                    value={customers.CustomerGroup}
                  >
                    {`${customers.CustomerGroup} - ${customers.Description}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <FormControl className="w-full">
          <InputLabel size="small" id="shippingCondition-1">
            Shipping Condition
          </InputLabel>
          <Select
            required
            size="small"
            id="shippingCondition"
            name="shippingCondition"
            label="Shipping Condition"
            // defaultValue=""
            value={
              salesUserData.shippingCondition
                ? salesUserData.shippingCondition
                : ""
            }
            onChange={(e) => handleSalesData(e)}
            error={isSubmit && !salesUserData.shippingCondition ? true : false}
            disabled={action !== "addinfo" ? true : false}
          >
            {shippingConditions.map((shippingData) => {
              return (
                <MenuItem
                  key={shippingData._id}
                  value={shippingData.ShippingCondition}
                >
                  {shippingData.ShippingCondition} - {shippingData.Description}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <p className="w-full mt-6 mb-6 subpixel-antialiased font-semibold lg:text-xl">
          Partner Function
        </p>
        <div className="flex justify-between mb-4">
          <p className="w-28">Sales Employee</p>

          <InputText
            className="p-8 w-36"
            name="saleEmployeeCode"
            label="Code"
            value={salesUserData.saleEmployeeCode}
            onChange={(e) => handleSalesData(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-80"
            name="saleEmployeeName"
            label=" Name"
            value={salesUserData.saleEmployeeName}
            onChange={(e) => handleSalesData(e)}
            wordLength={30}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <div className="flex justify-between">
          <p className="w-28">Carrier</p>
          <TOADropdown
            dataList={carrierCodeList}
            className="w-36"
            name="carrierCode"
            label="Code"
            value={salesUserData.carrierCode}
            onChange={(e) => handleSalesData(e)}
            valueLabel={"Carrier"}
            valueKey={"Carrier"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TextField
            className="w-80"
            // required
            size="small"
            placeholder="Name"
            id="name"
            name="carrierName"
            label=" Name"
            value={salesUserData.carrierName}
            onChange={(e) => handleSalesData(e)}
            // error={isSubmit && !salesUserData.carrierName ? true : false}
            autoComplete="off"
            inputProps={{ maxLength: 10 }}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <TextField
            className="p-8 "
            size="small"
            placeholder="Branch Code"
            id="branchCode"
            name="branchCode"
            label="Branch Code"
            // onChange={handleSalesData}
            autoComplete="off"
            // value={"000"}
            value={salesUserData.branchCode ? salesUserData.branchCode : ""}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: `${action === "addinfo" && "#000000"}`,
                cursor: "not-allowed",
              },
            }}
          />

          <TextField
            className="p-8"
            size="small"
            placeholder="Description"
            id="description"
            name="description"
            label="Description"
            value={salesUserData.description}
            // onChange={(e) => handleSalesData(e)}
            disabled
            autoComplete="off"
            inputProps={{ maxLength: 40 }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: `${action === "addinfo" && "#000000"}`,
                cursor: "not-allowed",
              },
            }}
          />
          <FormControl className="w-full">
            <InputLabel size="small" id="paymentTerm-1">
              Payment Term
            </InputLabel>
            <Select
              required
              size="small"
              id="paymentTerm"
              name="paymentTerm"
              label="Payment Term"
              // defaultValue=""
              value={salesUserData.paymentTerm ? salesUserData.paymentTerm : ""}
              onChange={(e) => handleSalesData(e)}
              error={isSubmit && !salesUserData.paymentTerm ? true : false}
              disabled={action !== "addinfo" ? true : false}
            >
              {paymentsList.map((payment) => {
                return (
                  <MenuItem key={payment._id} value={payment.PaymentTerm}>
                    {payment.PaymentTerm}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            required
            className="p-8"
            size="small"
            placeholder="Credit Limit"
            name="creditLimit"
            label="Credit Limit"
            value={formatedNumber}
            // value={salesUserData.creditLimit.toLocaleString()}
            onChange={(e) => handleSalesData(e)}
            error={isSubmit && !salesUserData.creditLimit ? true : false}
            autoComplete="off"
            inputProps={{ maxLength: 19 }}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <FormControl component="fieldset">
          <FormLabel className="mt-4" id="priceList" style={{ color: "black" }}>
            Price List
          </FormLabel>
          <RadioGroup
            aria-label="priceList"
            name="priceList"
            row
            aria-labelledby="priceList"
            className="mb-4"
            value={salesUserData.priceList}
            onChange={handleSalesData}
          >
            {priceList.map((price) => {
              return (
                <FormControlLabel
                  key={price._id}
                  value={price.PriceList}
                  control={<Radio color="success" />}
                  label={price.Description}
                  disabled={action !== "addinfo" ? true : false}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}

export default memo(SalesInfo);
