import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { NumberInputType } from "../../../CommonComponent/NumberInputType";
import {
  fetchDataList,
  useSalesStore,
  useUserDataStore,
  useVerifyStore,
} from "../../../../Store/createUserStore";
import {
  commaFormatter,
  convertToFiveDigitFormat,
} from "../../../../Utility/Constant";
// import { addLeadingZeroToSingleDigit } from "../../../../Utility/Constant";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInputDisabled from "../../../CommonComponent/TextInputDisabled";
import { useParams } from "react-router-dom";
import VirtualAutoComplete from "../../../CommonComponent/VirtualAutoComplete";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import { getAxiosCall } from "../../../../Utility/HelperFunction";

export default function SalesInfo({ jobDataFromStore, setPassPayload }) {
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  const getVerigyDataFromStore = useVerifyStore((state) => state.verify);
  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);
  const userRole = `${parsedUserData?.userType} ${parsedUserData?.role}`;
  const attributeList = fetchDataList((state) => state.attributeList);
  const classificationList = fetchDataList((state) => state.classificationList);
  const deliveryPriorityList = fetchDataList(
    (state) => state.deliveryPriorityList
  );
  const incotermsList = fetchDataList((state) => state.incotermsList);
  const bankBranchList = fetchDataList((state) => state.bankBranchList);
  const bankBranchCodeList = fetchDataList((state) => state.bankBranchCodeList);
  const incotermsLocationList = fetchDataList(
    (state) => state.incotermsLocationList
  );
  const updateSalesStore = useSalesStore((state) => state.updateSalesDataState);
  const { action } = useParams();

  const salesOffices = fetchDataList((state) => state.salesOfficeList);
  const salesDistricts = fetchDataList((state) => state.salesDistrictList);
  const salesGroupsList = fetchDataList((state) => state.salesGroupList);
  const customerGroups = fetchDataList((state) => state.customerGroupList);
  const carrierCodeList = fetchDataList((state) => state.carrierCodeList);
  const currencyList = fetchDataList((state) => state.currencyList);
  const shippingConditions = fetchDataList(
    (state) => state.shippingConditionList
  );

  const getData = fetchDataList((state) => state.fetchDropDownData);
  const getSalesGroupData = fetchDataList((state) => state.fetchSalesGroupData);

  // console.log(
  //   { attributeList },
  //   { classificationList },
  //   { deliveryPriorityList },
  //   { incotermsList },
  //   { incotermsLocationList }
  // );

  // console.log(bankBranchList?.slice(0, 10));

  const [bankList, setBankList] = useState([
    {
      bankCode: "",
      bankBranch: "",
      bankAccount: "",
      bankAccountName: "",
    },
  ]);
  const [alreadyAddedBankCount, setAlreadyAddedBankCount] = useState(1);

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
    branchCode: getVerigyDataFromStore.branchCode
      ? getVerigyDataFromStore.branchCode
      : "",
    description: "",
    buyingGroup: "",
  });
  const extractedData = jobDataFromStore?.saleInfomation;
  const constExtractedBuyingGroup = jobDataFromStore.verify;

  const addMoreName = () => {
    setBankList([
      ...bankList,
      {
        bankCode: "",
        bankBranch: "",
        bankAccount: "",
        bankAccountName: "",
      },
    ]);
  };

  const { employeeId, name, role } = parsedUserData;
  // console.log("2222222", employeeId, name, role);

  const [salesLocalState, setSalesLocalState] = useState({
    incoterms: "",
    classification: "",
    attribute: "",
    deliveryPriority: "",
    incoLocation: "",
    comment: "",
    billCollectorCode: "",
    arOfficerCode: role === "Officer" ? employeeId : "",
    arOfficerName: role === "Officer" ? name : "",
    bank: bankList,
  });

  // console.log("222222", salesLocalState, name, role);

  const handleSalesInput = (e) => {
    const { name, value } = e.target;
    const copiedSalesData = {
      ...salesLocalState,
      [name]: value,
    };
    setSalesLocalState(copiedSalesData);
    updateSalesStore(copiedSalesData);
  };

  function changeValuesForKeyFromIndex(array, startIndex, key) {
    if (startIndex < 0 || startIndex >= array.length) {
      return array;
    }

    return array?.map((object, index) =>
      index >= startIndex
        ? {
            ...object,
            [key]: convertToFiveDigitFormat(index + alreadyAddedBankCount, 4),
          }
        : object
    );
  }

  const handleDelete = (key) => {
    // console.log(key);
    let data = [...bankList];
    data.splice(key, 1);

    const filteredObject = changeValuesForKeyFromIndex(data, key, "bankCode");

    setBankList(filteredObject);
    setSalesLocalState({ ...salesLocalState, bank: filteredObject });
    // console.log("------------------", filteredObject);
  };

  const handleBankChange = (e, key) => {
    const convert3digitFormat = convertToFiveDigitFormat(
      key + alreadyAddedBankCount,
      4
    );
    const { name, value } = e.target;
    let data = [...bankList];
    data[key] = { ...data[key], [name]: value, bankCode: convert3digitFormat };

    setBankList(data);
    setSalesLocalState({ ...salesLocalState, bank: data });
  };

  const handleBankBranch = (e, key) => {
    // const convert3digitFormat = convertToFiveDigitFormat(key + 1, 4);
    const { name, value } = e;
    let data = [...bankList];
    data[key] = { ...data[key], [name]: value?.BankBranch };
    // console.log(name, value?.BankBranch);
    setBankList(data);
    setSalesLocalState({ ...salesLocalState, bank: data });
  };

  const handleNumber = (e, key) => {
    const convert3digitFormat = convertToFiveDigitFormat(
      key + alreadyAddedBankCount,
      4
    );
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      let data = [...bankList];
      data[key] = { ...data[key], [name]: value };
      setBankList(data);
      setSalesLocalState({
        ...salesLocalState,
        bank: data,
        bankCode: convert3digitFormat,
      });
    }
  };

  useEffect(() => {
    getData(parsedUserData.companyCode);
    salesUserData.salesOffice &&
      getSalesGroupData(
        salesUserData.salesOffice,
        constExtractedBuyingGroup?.companyCode
      );
  }, [salesUserData.salesOffice]);
  // console.log("2222222", constExtractedBuyingGroup);
  useEffect(() => {
    setPassPayload(salesLocalState);
  }, [salesLocalState]);

  useEffect(() => {
    setSalesUserData({
      ...salesUserData,
      ...extractedData,
      buyingGroup: constExtractedBuyingGroup?.buyingGroup,
    });
    setSalesLocalState({
      ...salesLocalState,
      ...extractedData,
      arOfficerCode:
        role === "Officer" ? employeeId : extractedData.arOfficerCode ?? "",
      arOfficerName:
        role === "Officer" ? name : extractedData.arOfficerName ?? "",
    });
    setBankList(extractedData.bank);
  }, [extractedData]);

  const findBankIndex = async () => {
    if (Object.entries(constExtractedBuyingGroup).length > 0) {
      const responseData = await getAxiosCall(
        // `data/bankCheck/${"0965529000039"}/${"00003"}`
        `data/bankCheck/${constExtractedBuyingGroup?.taxId}/${constExtractedBuyingGroup?.branchCode}`
      );
      if (responseData.status === 200) {
        setAlreadyAddedBankCount(responseData.data.bankNumberNext);
      }
      // console.log(responseData);
    }
  };
  useEffect(() => {
    findBankIndex();
  }, [extractedData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // console.log("2222222", extractedData);
  // console.log(bankList);

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
          4. Sales Information
        </p>
        <p className="text-lg pl-9">
          Doc Date: {dayjs(jobDataFromStore?.createDate).format("DD/MM/YYYY")}
        </p>
        <p className="text-lg pl-9">
          Document ID - {jobDataFromStore?.jobNumber}
        </p>
      </div>
      <div className="w-2/5">
        <p className="mb-4 text-xl">Please fill the information.</p>
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <TOADropdown
            dataList={salesOffices}
            name="salesOffice"
            label="Sales Office"
            value={salesUserData.salesOffice}
            valueLabel={"SalesOffice"}
            valueLabel2={"Description"}
            valueKey={"SalesOffice"}
            disabled={true}
          />
          <TOADropdown
            dataList={salesDistricts}
            name="salesDistrict"
            label="Sales District"
            value={salesUserData.salesDistrict}
            valueLabel={"SalesDistrict"}
            valueLabel2={"Description"}
            valueKey={"SalesDistrict"}
            disabled={true}
          />
          <TOADropdown
            dataList={salesGroupsList}
            name="salesGroup"
            label="Sales Group"
            value={salesUserData.salesGroup}
            valueLabel={"SalesGroup"}
            valueLabel2={"SaleGroupDescription"}
            valueKey={"SalesGroup"}
            disabled={true}
          />
          <TOADropdown
            dataList={customerGroups}
            label="Customer Group"
            name="customerGroup"
            value={salesUserData.customerGroup}
            valueLabel={"CustomerGroup"}
            valueLabel2={"Description"}
            valueKey={"CustomerGroup"}
            disabled={true}
          />
        </div>
        <TOADropdown
          dataList={shippingConditions}
          name="shippingCondition"
          label="Shipping Condition"
          value={salesUserData.shippingCondition}
          valueLabel={"ShippingCondition"}
          valueLabel2={"Description"}
          valueKey={"ShippingCondition"}
          disabled={true}
        />
        <p className="w-full mt-6 mb-6 subpixel-antialiased font-semibold lg:text-xl">
          Partner Function
        </p>
        <div className="flex justify-between mb-4">
          <p className="w-28">Sales Employee</p>

          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Code Name/No."
            id="code"
            name="saleEmployeeCode"
            value={salesUserData.saleEmployeeCode}
            label="Code"
            autoComplete="off"
            inputProps={{ maxLength: 10 }}
          />
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Name"
            id="name"
            name="saleEmployeeName"
            label=" Name"
            value={salesUserData.saleEmployeeName}
            autoComplete="off"
          />
        </div>
        <div className="flex justify-between">
          <p className="w-28">Carrier</p>
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Code Name/No."
            name="carrierCode"
            value={salesUserData.carrierCode}
            label="Code"
            inputProps={{ maxLength: 10 }}
          />
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Name"
            id="name"
            name="carrierName"
            value={salesUserData.carrierName}
            label=" Name"
            autoComplete="off"
            inputProps={{ maxLength: 10 }}
          />
        </div>
        {(parsedUserData?.role === "Officer" ||
          parsedUserData?.role === "Assistant Manager") && (
          <div className="flex justify-between mt-4">
            <p className="w-28">AR Officer</p>
            <TextInputDisabled
              className="p-8"
              size="small"
              placeholder="Code."
              name="arOfficerCode"
              value={salesLocalState.arOfficerCode}
              label="Code"
              inputProps={{ maxLength: 10 }}
            />
            <TextInputDisabled
              className="p-8"
              size="small"
              placeholder="Name"
              id="name"
              name="arOfficerName"
              label="Name"
              value={salesLocalState.arOfficerName}
              autoComplete="off"
              inputProps={{ maxLength: 10 }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <TextInputDisabled
            className="p-8 "
            size="small"
            placeholder="Branch Code"
            id="branchCode"
            name="branchCode"
            label="Branch Code"
            autoComplete="off"
            value={salesUserData.branchCode}
          />

          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Description"
            id="description"
            name="description"
            label="Description"
            value={salesUserData.description}
            autoComplete="off"
            inputProps={{ maxLength: 40 }}
          />
          <TextInputDisabled
            className="w-full"
            size="small"
            id="paymentTerm"
            name="paymentTerm"
            value={salesUserData.paymentTerm}
            label="Payment Term"
            // defaultValue=""
          />
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Credit Limit"
            name="creditLimit"
            label="Credit Limit"
            value={commaFormatter(salesUserData.creditLimit)}
            autoComplete="off"
            inputProps={{ maxLength: 19 }}
          />
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Price List"
            name="priceList"
            label="Price List"
            value={salesUserData.priceList}
            autoComplete="off"
            inputProps={{ maxLength: 19 }}
          />
          <TextInputDisabled
            className="p-8"
            size="small"
            placeholder="Buying Group"
            name="buyingGroup"
            label="Buying Group"
            value={salesUserData.buyingGroup}
            autoComplete="off"
            inputProps={{ maxLength: 19 }}
          />
        </div>
        <TextField
          className="w-full p-8 mb-4"
          size="small"
          placeholder="Bill Collector"
          name="billCollectorCode"
          label="Bill Collector"
          value={salesLocalState.billCollectorCode}
          onChange={handleSalesInput}
          autoComplete="off"
          inputProps={{ maxLength: 8 }}
          disabled={
            parsedUserData?.role !== "Officer" || action !== "addinfo"
              ? true
              : false
          }
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        {(parsedUserData?.role === "Officer" ||
          parsedUserData?.role === "Assistant Manager") &&
          bankList?.map((bankData, index) => {
            return (
              <div
                key={index}
                className="pt-2 pb-2 pl-4 pr-4 mt-4 mb-4 border border-dashed rounded"
              >
                <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
                  <TextField
                    className="p-8"
                    size="small"
                    placeholder="Code"
                    name="bankCode"
                    label="Code"
                    value={convertToFiveDigitFormat(
                      index + alreadyAddedBankCount,
                      4
                    )}
                    autoComplete="off"
                    inputProps={{ maxLength: 4 }}
                    // onChange={handleBankCodeCount(index)}
                    disabled={true}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#777777",
                        cursor: "not-allowed",
                      },
                    }}
                  />
                  {/* <FormControl className="w-full">
                  <InputLabel value="" size="small">
                    Select country
                  </InputLabel>
                  <Select
                    size="small"
                    label="Select Branch"
                    // value={countryCodes}
                    // onChange={handleCountryCodeChange}
                  >
                    {bankBranchList.map((countryData) => (
                      <MenuItem
                        key={countryData._id}
                        value={countryData.BankBranch}
                      >
                        {countryData.BankBranch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                  {/* {parsedUserData?.role === "Officer" &&
                  action === "addinfo" ? ( */}

                  <VirtualAutoComplete
                    dataList={bankBranchList}
                    label={"Branch Code"}
                    size={"small"}
                    onChange={(e) => handleBankBranch(e, index)}
                    name={"bankBranch"}
                    value={bankData.bankBranch}
                    disabled={
                      parsedUserData?.role !== "Officer" || action !== "addinfo"
                        ? true
                        : false
                    }
                  />
                  {/* ) : (
                    <TextInputDisabled
                      className="p-8"
                      size="small"
                      name="brnchCode"
                      label="Branch Code"
                      value={bankData.bankBranch}
                      autoComplete="off"
                    />
                  )} */}

                  {/* {action !== "addinfo" ? (
                    <TextInputDisabled
                      className="p-8"
                      size="small"
                      name="brnchCode"
                      label="Branch Code"
                      value={bankData.bankBranch}
                      autoComplete="off"
                    />
                  ) : (
                    <VirtualAutoComplete
                      dataList={bankBranchList}
                      label={"Branch Code"}
                      size={"small"}
                      onChange={(e) => handleBankBranch(e, index)}
                      name={"bankBranch"}
                      value={bankData.bankBranch}
                      disabled={
                        parsedUserData?.role !== "Officer" ? true : false
                      }
                    />
                  )} */}

                  <TextField
                    className="p-8"
                    size="small"
                    placeholder="Bank Account"
                    name="bankAccount"
                    label="Bank Account"
                    value={bankData.bankAccount}
                    autoComplete="off"
                    inputProps={{ maxLength: 15 }}
                    onChange={(e) => handleNumber(e, index)}
                    disabled={
                      parsedUserData?.role !== "Officer" || action !== "addinfo"
                        ? true
                        : false
                    }
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#777777",
                        cursor: "not-allowed",
                      },
                    }}
                  />
                  <TextField
                    className="p-8"
                    size="small"
                    placeholder="Account Name"
                    name="bankAccountName"
                    label="Account Name"
                    value={bankData.bankAccountName}
                    autoComplete="off"
                    inputProps={{ maxLength: 39 }}
                    onChange={(e) => handleBankChange(e, index)}
                    disabled={
                      parsedUserData?.role !== "Officer" || action !== "addinfo"
                        ? true
                        : false
                    }
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#777777",
                        cursor: "not-allowed",
                      },
                    }}
                  />
                </div>
                {/* {handleBankCodeCount(index)} */}
                {bankList.length > 1 &&
                  action === "addinfo" &&
                  parsedUserData?.role === "Officer" && (
                    <div className="flex justify-end w-full">
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(index)}
                        title="delete bank"
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  )}
              </div>
            );
          })}
        {parsedUserData?.role === "Officer" &&
          bankList.length + alreadyAddedBankCount <= 10 &&
          action === "addinfo" && (
            <div className="flex justify-end w-full">
              <Button
                sx={{
                  marginBottom: "1rem",
                  float: "right",
                }}
                variant="outlined"
                size="medium"
                onClick={() => addMoreName()}
                title="add more bank"
              >
                <AddIcon /> Add More Bank
              </Button>
            </div>
          )}
        {(parsedUserData?.role === "Officer" ||
          parsedUserData?.role === "Assistant Manager") && (
          <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
            <FormControl className="w-full">
              <InputLabel size="small" id="attribute">
                Attribute
              </InputLabel>
              <Select
                size="small"
                id="attribute"
                name="attribute"
                label="Attribute"
                defaultValue=""
                value={salesLocalState.attribute}
                onChange={(e) => handleSalesInput(e)}
                disabled={
                  parsedUserData?.role !== "Officer" || action !== "addinfo"
                    ? true
                    : false
                }
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {attributeList?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item.AttributeOne}>
                      {`${item.AttributeOne} - ${item.Description}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className="w-full">
              <InputLabel size="small" id="classification">
                Classification
              </InputLabel>
              <Select
                size="small"
                id="classification"
                name="classification"
                label="Classification"
                value={salesLocalState.classification}
                defaultValue=""
                onChange={(e) => handleSalesInput(e)}
                disabled={
                  parsedUserData?.role !== "Officer" || action !== "addinfo"
                    ? true
                    : false
                }
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {classificationList?.map((item) => {
                  return (
                    <MenuItem
                      key={item._id}
                      value={item.CustomerClassification}
                    >
                      {`${item.CustomerClassification} - ${item.Description}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className="w-full">
              <InputLabel size="small" id="deliveryPriority">
                Delivery Priority
              </InputLabel>
              <Select
                size="small"
                id="deliveryPriority"
                name="deliveryPriority"
                label="Delivery Priority"
                defaultValue=""
                onChange={(e) => handleSalesInput(e)}
                value={salesLocalState.deliveryPriority}
                disabled={
                  parsedUserData?.role !== "Officer" || action !== "addinfo"
                    ? true
                    : false
                }
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {deliveryPriorityList?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item.DeliveryPriority}>
                      {`${item.DeliveryPriority} - ${item.Description}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className="w-full">
              <InputLabel size="small" id="incoterms">
                Incoterms
              </InputLabel>
              <Select
                size="small"
                id="incoterms"
                name="incoterms"
                value={salesLocalState.incoterms}
                label="Incoterms"
                defaultValue=""
                onChange={(e) => handleSalesInput(e)}
                disabled={
                  parsedUserData?.role !== "Officer" || action !== "addinfo"
                    ? true
                    : false
                }
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {incotermsList?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item.Incoterm}>
                      {`${item.Incoterm} - ${item.Description}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              className="p-8"
              size="small"
              id="incoLocation"
              name="incoLocation"
              label="Incoterms Location1"
              value={salesLocalState.incoLocation}
              onChange={handleSalesInput}
              autoComplete="off"
              inputProps={{ maxLength: 50 }}
              disabled={
                parsedUserData?.role !== "Officer" || action !== "addinfo"
                  ? true
                  : false
              }
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#777777",
                  cursor: "not-allowed",
                },
              }}
            />
            <TextField
              className="p-8"
              size="small"
              placeholder="Comment"
              name="comment"
              label="Comment"
              value={salesLocalState.comment}
              onChange={handleSalesInput}
              autoComplete="off"
              inputProps={{ maxLength: 50 }}
              disabled={
                parsedUserData?.role !== "Officer" || action !== "addinfo"
                  ? true
                  : false
              }
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#777777",
                  cursor: "not-allowed",
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
