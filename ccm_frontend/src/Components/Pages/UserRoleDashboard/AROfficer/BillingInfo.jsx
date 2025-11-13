import {
  // Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  // InputLabel,
  // MenuItem,
  Radio,
  RadioGroup,
  // Select,
  // TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  fetchDataList,
  // useBillingStore,
  // useUserDataStore,
} from "../../../../Store/createUserStore";
import TextInputDisabled from "../../../CommonComponent/TextInputDisabled";
import TOADropdown from "../../../CommonComponent/TOADropdown";

export default function BillingInfo({ jobDataFromStore }) {
  // const transPortList = fetchDataList((state) => state.transportZoneList);
  // const updateBillingDataStore = useBillingStore(
  //   (state) => state.updateBillingAddressDataState
  // );
  // const billingStoreData = useBillingStore((state) => state.billingAddress);
  // const isSubmit = useUserDataStore((state) => state.isSubmited);
  const regionList = fetchDataList((state) => state.dataRegion);

  // const [nameList, setNameList] = useState([{ name: "", isValid: false }]);
  // const addMoreName = () => {
  //   setNameList([...nameList, { name: "", isValid: false }]);
  // };

  const extractedData = jobDataFromStore?.billingAddress;

  const [billingData, setBillingData] = useState({
    billingAddressChoose: "sameAddress",
    countryCode: "",
    country: "",
    postalCode: "",
    city: "",
    district: "",
    subDistrict: "",
    addressLine1: "",
    street: "",
    region: "",
    transportZoneCode: "",
    transportZone: "",
    name: [],
  });

  useEffect(() => {
    setBillingData({ ...billingData, ...extractedData });
  }, [extractedData]);

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
            6. Billing Address
          </p>
        </div>
        <div className="w-2/5">
          <p className="mb-4 text-xl">Please fill the information.</p>
          <FormControl component="fieldset">
            <FormLabel
              className="mt-4"
              id="addressType"
              style={{ color: "red" }}
            >
              Please Select
            </FormLabel>
            <RadioGroup
              aria-label="addressType"
              name="billingAddressChoose"
              row
              aria-labelledby="addressType"
              className="mb-4"
              value={billingData.billingAddressChoose}
            >
              <FormControlLabel
                value="sameAddress"
                control={<Radio color="success" />}
                label="Same Address"
                disabled
              />
              <FormControlLabel
                value="differenceAddress"
                control={<Radio color="success" />}
                label="Different Address"
                disabled
              />
            </RadioGroup>
          </FormControl>
          {billingData.billingAddressChoose !== "sameAddress" && (
            <div>
              <div className="mt-4">
                {billingData.name.map((item, index) => {
                  return (
                    <div key={index} className="full flex">
                      <TextInputDisabled
                        className="p-8 w-full"
                        style={{ marginBottom: "1rem" }}
                        size="small"
                        placeholder="Please fill company's name (max 35 digits)."
                        id="name"
                        name="name"
                        value={item}
                        label="Name"
                        autoComplete="off"
                        inputProps={{ maxLength: 35 }}
                      />
                    </div>
                  );
                })}
              </div>
              <TextInputDisabled
                className="p-8 w-full"
                size="small"
                placeholder="Enter Your House No."
                id="houseNO"
                name="addressLine1"
                label="Address/House No"
                value={billingData.addressLine1}
                autoComplete="off"
                inputProps={{ maxLength: 40 }}
              />

              <TextInputDisabled
                className="p-8 w-full"
                size="small"
                placeholder="Street"
                id="street"
                name="street"
                label="Street Name"
                value={billingData.street}
                autoComplete="off"
                style={{ marginTop: "1rem" }}
                inputProps={{ maxLength: 40 }}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <TextInputDisabled
                  className="w-full"
                  id="country-select"
                  size="small"
                  label="Select Country"
                  name="country"
                  value={billingData.country}
                />
                <TextInputDisabled
                  className="p-8"
                  size="small"
                  placeholder="Postal Code or Zip Code"
                  id="postalCode"
                  name="postalCode"
                  label="Postal Code"
                  value={billingData.postalCode}
                  autoComplete="off"
                  inputProps={{ maxLength: 10 }}
                />
                <TextInputDisabled
                  className="p-8"
                  size="small"
                  placeholder="City"
                  id="city"
                  name="city"
                  label="City"
                  value={billingData.city}
                  autoComplete="off"
                  inputProps={{ maxLength: 10 }}
                />
                <TextInputDisabled
                  id="district-select"
                  size="small"
                  label="Select District "
                  name="district"
                  value={billingData.district}
                  // defaultValue=""
                  autoComplete="off"
                  inputProps={{ maxLength: 40 }}
                />
                <TextInputDisabled
                  id="subdistrict-select"
                  size="small"
                  label="Select Sub District"
                  name="subDistrict"
                  value={billingData.subDistrict}
                  autoComplete="off"
                  inputProps={{ maxLength: 40 }}
                />
              </div>

              <TOADropdown
                dataList={regionList}
                name="region"
                label="Select Region"
                value={billingData.region}
                onChange={(e) => handleSalesInput(e)}
                valueLabel={"Description"}
                valueKey={"Region"}
                disabled={true}
                style={{ marginTop: "1rem" }}
                // className="mt-4 w-full"
              />

              <TextInputDisabled
                required={true}
                id="transportZone-select"
                size="small"
                className="w-full"
                label="Transportation Zone"
                name="transport"
                value={`${billingData.transportZone}-${billingData.transportZoneCode}`}
                // defaultValue=""
                style={{ marginTop: "1rem" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
