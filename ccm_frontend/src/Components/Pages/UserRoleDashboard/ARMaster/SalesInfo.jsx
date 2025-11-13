import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
// import { NumberInputType } from "../../../CommonComponent/NumberInputType";
import {
  createUser,
  fetchDataList,
  useSalesStore,
  useUserDataStore,
  useVerifyStore,
} from "../../../../Store/createUserStore";
import {
  commaFormatter,
  convertToFiveDigitFormat,
  getObjectByValue,
} from "../../../../Utility/Constant";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InputText from "../../../CommonComponent/InputText";
import { useParams } from "react-router-dom";
import VirtualAutoComplete from "../../../CommonComponent/VirtualAutoComplete";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import { getAxiosCall } from "../../../../Utility/HelperFunction";

export default function SalesInfo({ jobDataFromStore, setPassPayload }) {
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  const getVerigyDataFromStore = useVerifyStore((state) => state.verify);
  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);
  const attributeList = fetchDataList((state) => state.attributeList);
  const classificationList = fetchDataList((state) => state.classificationList);
  const deliveryPriorityList = fetchDataList(
    (state) => state.deliveryPriorityList
  );
  const countryList = fetchDataList((state) => state.countryList);
  const incotermsList = fetchDataList((state) => state.incotermsList);
  const bankBranchList = fetchDataList((state) => state.bankBranchList);
  const incotermsLocationList = fetchDataList(
    (state) => state.incotermsLocationList
  );
  const bpGroupList = fetchDataList((state) => state.bpGroupList);
  const languageList = fetchDataList((state) => state.languageList);
  const tradingPartnerList = fetchDataList((state) => state.tradingPartnerList);
  const reconciliationList = fetchDataList((state) => state.reconciliationList);
  const riskClassList = fetchDataList((state) => state.riskClassList);
  const checkRulesList = fetchDataList((state) => state.checkRulesList);
  // const currencyList = fetchDataList((state) => state.currencyList);
  const exchangeRateTypeList = fetchDataList(
    (state) => state.exchangeRateTypeList
  );

  const updateSalesStore = useSalesStore((state) => state.updateSalesDataState);
  const isSubmitClicked = createUser((state) => state.isSubmitClicked);

  const { action } = useParams();

  const salesOffices = fetchDataList((state) => state.salesOfficeList);
  const salesDistricts = fetchDataList((state) => state.salesDistrictList);
  const salesGroupsList = fetchDataList((state) => state.salesGroupList);
  const carrierCodeList = fetchDataList((state) => state.carrierCodeList);
  const currencyList = fetchDataList((state) => state.currencyList);

  const fetchSalesGropDataForAR = fetchDataList(
    (state) => state.fetchSalesGroupData
  );

  const customerGroups = fetchDataList((state) => state.customerGroupList);
  const shippingConditions = fetchDataList(
    (state) => state.shippingConditionList
  );
  const priceList = fetchDataList((state) => state.dataPriceList);
  const paymentsList = fetchDataList((state) => state.paymentTermList);
  const taxClassificationList = fetchDataList(
    (state) => state.taxClassificationList
  );
  const accountAssignmentList = fetchDataList(
    (state) => state.accountAssignmentList
  );

  const withHoldingTaxList = fetchDataList((state) => state.withHoldingTaxList);

  const [alreadyAddedBankCount, setAlreadyAddedBankCount] = useState(1);
  const [bankList, setBankList] = useState([
    {
      bankCode: "",
      bankBranch: "",
      bankAccount: "",
      bankAccountName: "",
    },
  ]);

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
    branchCode: getVerigyDataFromStore.branchCode ?? "",
    description: "",
    buyingGroup: "",
    taxId: "",
    withHoldingTaxCode: "",
    accountAssignment: "",
    taxClassification: "",
    settlement: false,
    gypsumName: "",
    gypsumCode: "",
    ceramicCode: "",
    ceramicName: "",
    chemicalSpecialistCode: "",
    chemicalSpecialistName: "",
    incoterms: "",
    classification: "",
    attribute: "",
    deliveryPriority: "",
    incoLocation: "",
    comment: "",
    arOfficerCode: parsedUserData?.employeeId,
    arOfficerName: parsedUserData?.name,
    bank: bankList,
    bpGroup: "",
    country: "",
    language: "",
    tradingPartner: "",
    reconciliation: "",
    riskClass: "",
    checkRule: "",
    currency: "",
    exchangeRateType: "",
    billCollectorCode: "",
  });
  const extractedData = jobDataFromStore?.saleInfomation;
  const extractedBuyingGroupData = jobDataFromStore.verify;

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

  const [salesLocalState, setSalesLocalState] = useState({
    incoterms: "",
    classification: "",
    attribute: "",
    deliveryPriority: "",
    incoLocation: "",
    comment: "",
    arOfficerCode: parsedUserData?.employeeId,
    arOfficerName: parsedUserData?.name,
    bank: bankList,
  });

  const handleSalesInput = (e) => {
    const { name, value } = e.target;
    if (
      name === "gypsumCode" ||
      name === "ceramicCode" ||
      name === "chemicalSpecialistCode"
    ) {
      const regex = /^[0-9\b]+$/;
      if (value === "" || regex.test(value)) {
        const copiedSalesData = {
          ...salesUserData,
          [name]: value,
        };
        setSalesUserData(copiedSalesData);
      }
    } else {
      const copiedSalesData = {
        ...salesUserData,
        [name]: value,
      };
      setSalesUserData(copiedSalesData);
    }
  };

  function changeValuesForKeyFromIndex(array, startIndex, key) {
    if (startIndex < 0 || startIndex >= array.length) {
      return array;
    }

    return array.map((object, index) =>
      index >= startIndex
        ? {
            ...object,
            [key]: convertToFiveDigitFormat(index + alreadyAddedBankCount, 4),
          }
        : object
    );
  }

  const handleDelete = (key) => {
    let data = [...bankList];
    data.splice(key, 1);

    const filteredObject = changeValuesForKeyFromIndex(data, key, "bankCode");

    setBankList(filteredObject);
    setSalesUserData({ ...salesUserData, bank: filteredObject });
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
    setSalesUserData({ ...salesUserData, bank: data });
  };

  const handleBankBranch = (e, key) => {
    // const convert3digitFormat = convertToFiveDigitFormat(key + 1, 4);
    const { name, value } = e;
    let data = [...bankList];
    data[key] = { ...data[key], [name]: value?.BankBranch };

    setBankList(data);
    setSalesUserData({ ...salesUserData, bank: data });
  };

  const handleNumber = (e, key) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      let data = [...bankList];
      data[key] = { ...data[key], [name]: value };
      setBankList(data);
      setSalesUserData({ ...salesUserData, bank: data });
    }
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setSalesUserData({ ...salesUserData, settlement: true });
    } else {
      setSalesUserData({ ...salesUserData, settlement: false });
    }
  };

  useEffect(() => {
    setPassPayload(salesUserData);
    updateSalesStore(salesUserData);
  }, [salesUserData]);

  useEffect(() => {
    setSalesUserData({
      ...salesUserData,
      ...extractedData,
      buyingGroup: extractedBuyingGroupData?.buyingGroup,
      // billCollectorCode: extractedBuyingGroupData?.billCollectorCode ?? "",
      // withHoldingTaxCode: "",
    });
    setBankList(extractedData.bank);
  }, [extractedData]);

  useEffect(() => {
    salesUserData.salesOffice &&
      fetchSalesGropDataForAR(
        salesUserData.salesOffice,
        extractedBuyingGroupData?.companyCode
      );
  }, [salesUserData.salesOffice]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const findBankIndex = async () => {
    if (Object.entries(extractedBuyingGroupData).length > 0) {
      const responseData = await getAxiosCall(
        // `data/bankCheck/${"0965529000039"}/${"00003"}`
        `data/bankCheck/${extractedBuyingGroupData?.taxId}/${extractedBuyingGroupData?.branchCode}`
      );
      if (responseData.status === 200) {
        setAlreadyAddedBankCount(responseData.data.bankNumberNext);
      }
    }
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

  useEffect(() => {
    findBankIndex();
  }, [extractedData]);

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
          4. Sales Information
        </p>
        <p className="text-lg pl-9">
          Doc Date: {dayjs().format("DD/MM/YYYY : h.mm")}
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
            required={true}
            name="salesOffice"
            label="Sales Office"
            value={salesUserData.salesOffice}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"SalesOffice"}
            valueLabel2={"Description"}
            valueKey={"SalesOffice"}
            error={isSubmitClicked && !salesUserData.salesOffice ? true : false}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            required={true}
            dataList={salesGroupsList.length > 0 ? salesGroupsList : []}
            name="salesGroup"
            label="Sales Group"
            value={salesUserData.salesGroup}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"SalesGroup"}
            valueLabel2={"SaleGroupDescription"}
            valueKey={"SalesGroup"}
            error={isSubmitClicked && !salesUserData.salesGroup ? true : false}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            required={true}
            dataList={salesDistricts}
            name="salesDistrict"
            label="Sales District"
            value={salesUserData.salesDistrict}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"SalesDistrict"}
            valueLabel2={"Description"}
            valueKey={"SalesDistrict"}
            error={
              isSubmitClicked && !salesUserData.salesDistrict ? true : false
            }
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            dataList={customerGroups}
            label="Customer Group"
            name="customerGroup"
            value={salesUserData.customerGroup}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"CustomerGroup"}
            valueLabel2={"Description"}
            valueKey={"CustomerGroup"}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            required={true}
            dataList={shippingConditions}
            name="shippingCondition"
            label="Shipping Condition"
            value={salesUserData.shippingCondition}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"ShippingCondition"}
            valueLabel2={"Description"}
            valueKey={"ShippingCondition"}
            error={
              isSubmitClicked && !salesUserData.shippingCondition ? true : false
            }
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            required={true}
            dataList={accountAssignmentList}
            name="accountAssignment"
            label="Account Assignment"
            value={salesUserData.accountAssignment}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"AccountAssignmentGroup"}
            valueLabel2={"Description"}
            valueKey={"AccountAssignmentGroup"}
            error={
              isSubmitClicked && !salesUserData.accountAssignment ? true : false
            }
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <TOADropdown
          style={{ marginBottom: "1rem" }}
          dataList={withHoldingTaxList}
          name="withHoldingTaxCode"
          label="Withholding Tax Code"
          value={salesUserData.withHoldingTaxCode}
          onChange={(e) => handleSalesInput(e)}
          valueLabel={"WithholdingTaxCode"}
          valueLabel2={"Description"}
          valueKey={"WithholdingTaxCode"}
          disabled={action !== "addinfo" ? true : false}
        />
        <TOADropdown
          required={true}
          dataList={taxClassificationList}
          name="taxClassification"
          label="Tax Classification"
          value={salesUserData.taxClassification}
          onChange={(e) => handleSalesInput(e)}
          valueLabel={"TaxClassification"}
          valueLabel2={"Description"}
          valueKey={"TaxClassification"}
          error={
            isSubmitClicked && !salesUserData.taxClassification ? true : false
          }
          disabled={action !== "addinfo" ? true : false}
        />
        {/* <Button>Hello</Button> */}
        <FormGroup className="mt-2" aria-label="position" row>
          <FormControlLabel
            sx={{ marginLeft: "0px" }}
            labelPlacement="start"
            control={
              <Checkbox color="success" checked={salesUserData.settlement} />
            }
            label="Settlement"
            name="settlement"
            onChange={(e) => handleCheckBox(e)}
            disabled={action !== "addinfo" ? true : false}
          />
        </FormGroup>
        <p className="w-full mt-1 mb-6 subpixel-antialiased font-semibold lg:text-xl">
          Partner Function
        </p>
        <div className="flex justify-between mb-4">
          <p className="w-28">Sales Employee</p>

          <InputText
            className="p-8 w-36"
            id="code"
            name="saleEmployeeCode"
            value={salesUserData.saleEmployeeCode}
            label="Code"
            wordLength={10}
            onChange={(e) => handleSalesInput(e)}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-80"
            name="saleEmployeeName"
            label=" Name"
            value={salesUserData.saleEmployeeName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
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
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"Carrier"}
            valueKey={"Carrier"}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-80"
            name="carrierName"
            label=" Name"
            value={salesUserData.carrierName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <div className="flex justify-between mt-4">
          <p className="w-28">AR Officer</p>
          <InputText
            className="p-8 w-36"
            name="arOfficerCode"
            label="Code"
            value={salesUserData.arOfficerCode}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-36"
            name="arOfficerName"
            label="Name"
            value={salesUserData.arOfficerName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <div className="flex justify-between mt-4">
          <p className="w-28">Gypsum</p>
          <InputText
            className="p-8 w-36"
            name="gypsumCode"
            label="Code"
            value={salesUserData.gypsumCode}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-36"
            name="gypsumName"
            label="Name"
            value={salesUserData.gypsumName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <div className="flex justify-between mt-4">
          <p className="w-28">Ceramic</p>
          <InputText
            className="p-8 w-36"
            name="ceramicCode"
            label="Code"
            value={salesUserData.ceramicCode}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-36"
            name="ceramicName"
            label="Name"
            value={salesUserData.ceramicName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>

        <div className="flex justify-between mt-4">
          <p className="w-28">Chemical Specialist</p>
          <InputText
            className="p-8 w-36"
            name="chemicalSpecialistCode"
            label="Code"
            value={salesUserData.chemicalSpecialistCode}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8 w-36"
            name="chemicalSpecialistName"
            label="Name"
            value={salesUserData.chemicalSpecialistName}
            onChange={(e) => handleSalesInput(e)}
            wordLength={10}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <InputText
            className="p-8 "
            name="branchCode"
            label="Branch Code"
            value={salesUserData.branchCode}
            onChange={(e) => handleSalesInput(e)}
            disabled={action !== "addinfo" ? true : false}
          />

          <InputText
            className="p-8"
            name="description"
            label="Description"
            value={salesUserData.description}
            onChange={(e) => handleSalesInput(e)}
            wordLength={40}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            required={true}
            name="paymentTerm"
            dataList={paymentsList}
            label={"Payment Term"}
            value={salesUserData.paymentTerm ? salesUserData.paymentTerm : ""}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"PaymentTerm"}
            valueKey={"PaymentTerm"}
            error={isSubmitClicked && !salesUserData.paymentTerm ? true : false}
            // disabled={action !== "addinfo" ? true : false}
            disabled={true}
          />
          <InputText
            className="p-8"
            name="creditLimit"
            label="Credit Limit"
            value={commaFormatter(salesUserData.creditLimit)}
            wordLength={19}
            disabled={true}
            error={isSubmitClicked && !salesUserData.creditLimit ? true : false}
            // onChange={(e) => handleSalesInput(e)}
          />

          <TOADropdown
            dataList={priceList}
            name="priceList"
            label="Price List"
            value={salesUserData.priceList}
            // onChange={(e) => handleSalesInput(e)}
            valueLabel={"Description"}
            valueKey={"PriceList"}
            disabled={true}
          />
          <InputText
            className="p-8"
            name="buyingGroup"
            label="Buying Group"
            value={salesUserData.buyingGroup}
            onChange={(e) => handleSalesInput(e)}
            wordLength={19}
            disabled={true}
          />
        </div>

        <InputText
          className="w-full p-8"
          name="billCollectorCode"
          label="Bill Collector"
          value={salesUserData.billCollectorCode}
          onChange={(e) => handleSalesInput(e)}
          wordLength={8}
          disabled={action !== "addinfo" ? true : false}
          sx={{ marginBottom: "1rem" }}
        />

        {bankList.map((bankData, index) => {
          return (
            <div
              key={index}
              className="pt-2 pb-2 pl-4 pr-4 mb-4 border border-dashed rounded"
            >
              <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
                <InputText
                  className="p-8"
                  name="bankCode"
                  label="Code"
                  value={convertToFiveDigitFormat(
                    index + alreadyAddedBankCount,
                    4
                  )}
                  inputProps={{ maxLength: 4 }}
                  // onChange={handleBankCodeCount(index)}
                  disabled={true}
                />
                <VirtualAutoComplete
                  dataList={bankBranchList}
                  label={"Branch Code"}
                  size={"small"}
                  onChange={(e) => handleBankBranch(e, index)}
                  name={"bankBranch"}
                  value={bankData.bankBranch}
                  disabled={action !== "addinfo" ? true : false}
                />
                <InputText
                  className="p-8"
                  name="bankAccount"
                  label="Bank Account"
                  value={bankData.bankAccount}
                  onChange={(e) => handleNumber(e, index)}
                  wordLength={15}
                  disabled={action !== "addinfo" ? true : false}
                />
                <InputText
                  className="p-8"
                  name="bankAccountName"
                  label="Account Name"
                  value={bankData.bankAccountName}
                  onChange={(e) => handleBankChange(e, index)}
                  wordLength={39}
                  disabled={action !== "addinfo" ? true : false}
                />
              </div>
              {/* {handleBankCodeCount(index)} */}
              {bankList.length > 1 && action === "addinfo" && (
                <div className="flex justify-end w-full">
                  <Button
                    variant="outlined"
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
        {bankList.length + alreadyAddedBankCount <= 10 &&
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
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <TOADropdown
            dataList={attributeList}
            size="small"
            name="attribute"
            label="Attribute"
            value={salesUserData.attribute}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"AttributeOne"}
            valueLabel2={"Description"}
            valueKey={"AttributeOne"}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            dataList={classificationList}
            name="classification"
            label="Classification"
            value={salesUserData.classification}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"CustomerClassification"}
            valueLabel2={"Description"}
            valueKey={"CustomerClassification"}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            dataList={deliveryPriorityList}
            name="deliveryPriority"
            label="Delivery Priority"
            value={salesUserData.deliveryPriority}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"DeliveryPriority"}
            valueLabel2={"Description"}
            valueKey={"DeliveryPriority"}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            dataList={incotermsList}
            name="incoterms"
            label="Incoterms"
            value={salesUserData.incoterms}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"Incoterm"}
            valueLabel2={"Description"}
            valueKey={"Incoterm"}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8"
            name="incoLocation"
            label="Incoterms Location1"
            value={salesUserData.incoLocation}
            onChange={(e) => handleSalesInput(e)}
            wordLength={50}
            disabled={action !== "addinfo" ? true : false}
          />
          <InputText
            className="p-8"
            name="comment"
            label="Comment"
            value={salesUserData.comment}
            onChange={(e) => handleSalesInput(e)}
            wordLength={50}
            disabled={action !== "addinfo" ? true : false}
          />

          <TOADropdown
            dataList={bpGroupList}
            name="bpGroup"
            label="BP Group"
            value={salesUserData.bpGroup}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"BPGroup"}
            valueLabel2={"Description"}
            valueKey={"BPGroup"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={countryList}
            name="country"
            label="Country"
            value={salesUserData.country}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"Description"}
            valueKey={"Country"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={languageList}
            name="language"
            label="Language"
            value={salesUserData.language}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"Language"}
            valueLabel2={"Description"}
            valueKey={"Language"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={tradingPartnerList}
            name="tradingPartner"
            label="Trading Partner"
            value={salesUserData.tradingPartner}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"TradingPartner"}
            valueLabel2={"Description"}
            valueKey={"TradingPartner"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={reconciliationList}
            name="reconciliation"
            label="Reconciliation"
            value={salesUserData.reconciliation}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"ReconciliationAccount"}
            valueLabel2={"Description"}
            valueKey={"ReconciliationAccount"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={riskClassList}
            name="riskClass"
            label="Risk Class"
            value={salesUserData.riskClass}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"RiskClass"}
            valueLabel2={"Description"}
            valueKey={"RiskClass"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={checkRulesList}
            name="checkRule"
            label="Check Rule"
            value={salesUserData.checkRule}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"CheckRule"}
            valueLabel2={"Description"}
            valueKey={"CheckRule"}
            disabled={action !== "addinfo" ? true : false}
          />
          <TOADropdown
            dataList={currencyList}
            name="currency"
            label="Currency"
            value={salesUserData.currency}
            onChange={(e) => handleSalesInput(e)}
            valueLabel={"Currency"}
            valueLabel2={"Description"}
            valueKey={"Currency"}
            disabled={action !== "addinfo" ? true : false}
          />
        </div>
        <TOADropdown
          dataList={exchangeRateTypeList}
          className="w-full"
          name="exchangeRateType"
          label="Exchange Rate Type"
          value={salesUserData.exchangeRateType}
          onChange={(e) => handleSalesInput(e)}
          valueLabel={"ExchangeRateType"}
          valueLabel2={"Description"}
          valueKey={"ExchangeRateType"}
          disabled={action !== "addinfo" ? true : false}
        />
      </div>
    </div>
  );
}
