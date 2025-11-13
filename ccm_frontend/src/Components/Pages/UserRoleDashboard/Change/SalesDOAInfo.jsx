import { memo, useEffect, useState } from "react";
import { commaFormatter } from "../../../../Utility/Constant";
import { postAxiosCall } from "../../../../Utility/HelperFunction";
import InputText from "../../../CommonComponent/InputText";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import { fetchDataList } from "../../../../Store/createUserStore";
import { changeUserStore } from "../../../../Store/changeUserStore";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import { useNavigate, useParams } from "react-router-dom";

function SalesDOAInfo({ jobChangeList, setSalesDOAdata, isSubmit }) {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { action } = useParams();
  const dataPriceList = fetchDataList((state) => state.dataPriceList);
  const paymentsList = fetchDataList((state) => state.paymentTermList);
  const changeSelectedData = changeUserStore(
    (state) => state.selectedChangeOption
  );
  const getJobData = userDashboardStore((state) => state.job);

  const changeCustomerData = userDashboardStore(
    (state) => state.changeCustomerData
  );
  const creditLimitFromStore = changeCustomerData.CrLimit;

  const { creditLimit, paymentTerm, priceList } = changeSelectedData;

  const [salesUserData, setSalesUserData] = useState({
    paymentTerm: "",
    creditLimit: "",
    priceList: "",
  });

  const [mocksaleinfomation, setMockSaleInfomation] = useState({
    paymentTerm: "",
    creditLimit: "",
    priceList: "",
  });

  const handleDoaData = (e) => {
    const { name, value } = e.target;
    if (name === "creditLimit") {
      const removeComma = value.replace(/\,/g, "");
      const copiedData = {
        ...salesUserData,
        [name]: removeComma,
      };
      setSalesUserData(copiedData);
    } else {
      const copiedData = {
        ...salesUserData,
        [name]: value,
      };
      setSalesUserData(copiedData);
    }
  };

  useEffect(() => {
    setSalesDOAdata(salesUserData);
  }, [salesUserData]);

  const getCustomerByID = async () => {
    try {
      const sendRequest = await postAxiosCall("customers/customerbyid", {
        customerId: getJobData?.verify?.customerId,
        companyCode: getJobData?.verify?.companyCode,
      });
      setMockSaleInfomation({
        paymentTerm:
          sendRequest?.data?.PaymentTerm?.length > 0
            ? sendRequest?.data?.PaymentTerm
            : "",
        creditLimit:
          sendRequest?.data?.CrLimit?.length > 0
            ? sendRequest?.data?.CrLimit
            : "",
        priceList:
          sendRequest?.data?.PriceList?.length > 0
            ? sendRequest?.data?.PriceList
            : "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (action !== "add" && Object.entries(getJobData).length > 0) {
      const saleInformation = getJobData?.saleInfomation;
      saleInformation && setSalesUserData(saleInformation);
    }
  }, [getJobData]);

  useEffect(() => {
    getCustomerByID();
  }, []);

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
          Sales Information
        </p>
      </div>
      <div className="w-2/5">
        <p className="mb-4 text-xl">DOA</p>
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          {(creditLimit || jobChangeList.includes("creditLimit")) && (
            <>
              <InputText
                className="p-8"
                name="creditLimit"
                label="Credit Limit"
                value={
                  creditLimitFromStore
                    ? commaFormatter(changeCustomerData?.CrLimit?.trimStart())
                    : commaFormatter(
                        mocksaleinfomation?.creditLimit?.trimStart()
                      )
                }
                disabled={true}
              />
              <InputText
                required={true}
                className="p-8"
                name="creditLimit"
                label="Credit Limit"
                value={
                  salesUserData?.creditLimit
                    ? commaFormatter(salesUserData?.creditLimit)
                    : ""
                }
                wordLength={19}
                error={isSubmit && !salesUserData.creditLimit ? true : false}
                onChange={(e) => handleDoaData(e)}
                disabled={
                  action === "view" || action === "status" ? true : false
                }
              />
            </>
          )}
          {(priceList || jobChangeList.includes("priceList")) && (
            <>
              <InputText
                className="p-8"
                name="priceList"
                label="Price List"
                value={`${
                  mocksaleinfomation?.priceList === undefined ||
                  mocksaleinfomation?.priceList === ""
                    ? ""
                    : mocksaleinfomation?.priceList !== "No size"
                    ? `Size ${mocksaleinfomation?.priceList}`
                    : mocksaleinfomation?.priceList
                }`}
                disabled={true}
              />

              <TOADropdown
                dataList={dataPriceList}
                name="priceList"
                label="Price List"
                value={salesUserData.priceList}
                onChange={(e) => handleDoaData(e)}
                valueLabel={"Description"}
                valueKey={"PriceList"}
                error={isSubmit && !salesUserData.priceList ? true : false}
                disabled={
                  action === "view" || action === "status" ? true : false
                }
                required={true}
              />
            </>
          )}

          {(paymentTerm || jobChangeList.includes("paymentTerm")) && (
            <>
              <InputText
                className="p-8"
                name="paymentTerm"
                label={"Payment Term"}
                value={
                  changeCustomerData?.PaymentTerm ??
                  mocksaleinfomation?.paymentTerm
                }
                disabled={true}
              />
              <TOADropdown
                name="paymentTerm"
                label={"Payment Term"}
                dataList={paymentsList}
                value={salesUserData.paymentTerm}
                onChange={(e) => handleDoaData(e)}
                valueLabel={"PaymentTerm"}
                valueKey={"PaymentTerm"}
                error={isSubmit && !salesUserData.paymentTerm ? true : false}
                disabled={
                  action === "view" || action === "status" ? true : false
                }
                required={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SalesDOAInfo);
