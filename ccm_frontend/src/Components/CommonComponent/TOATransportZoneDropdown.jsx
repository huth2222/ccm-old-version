import React, { useState, useEffect } from "react";

import { fetchDataList } from "../../Store/createUserStore";
import CustomAutocomplete from "./CustomAutocomplete";
import { getObjectByValue } from "../../Utility/Constant";
import { useParams } from "react-router-dom";
import CustomeAutoCompleteForObjectData from "./CustomeAutoCompleteForObjectData";

function TOATransportZoneDropdown({
  getTransportData,
  zoneCodeValue,
  isEditable = false,
  isSubmit = false,
  needZoneCode = false,
  error = false,
  disabled = false,
  ...props
}) {
  //   const [postalCode, setPostalCode] = useState("");
  const { action } = useParams();
  const path = location.pathname;

  const [transportCodes, settransportCodes] = useState("");
  const [selectedTransportObj, setSelectedTransportObj] = useState("");

  const transportationZoneList = fetchDataList(
    (state) => state.transportZoneList
  );
  //   console.log(selectedTransportObj);

  const handleTransportCodeChange = (event) => {
    const { name, value } = event.target;
    const transportId = value?._id;
    // console.log(value, transportId);

    settransportCodes(value);
    const getTransportObj = getObjectByValue(
      transportationZoneList,
      "_id",
      transportId
    );
    // setSelectedTransportObj(getTransportObj);
    getTransportData(getTransportObj);
  };
  // console.log(selectedTransportObj);

  const setTransportObjectOnEdit = (zoneCode) => {
    if (
      Array.isArray(transportationZoneList) &&
      transportationZoneList.length > 0
    ) {
      const getTransportObj = getObjectByValue(
        transportationZoneList,
        "TransportationZone",
        zoneCode
      );

      setSelectedTransportObj(getTransportObj);
      settransportCodes(getTransportObj._id);
    }
  };

  const getOptionLabel = (option) => {
    // console.log(option);
    return `${option.TransportationZone} - ${option.Description}`; // Replace 'firstKey' and 'secondKey' with your actual keys
  };

  useEffect(() => {
    isEditable && zoneCodeValue && setTransportObjectOnEdit(zoneCodeValue);
  }, [zoneCodeValue, transportationZoneList]);

  return (
    <>
      <CustomeAutoCompleteForObjectData
        options={
          Array.isArray(transportationZoneList) &&
          transportationZoneList.length > 0
            ? transportationZoneList
            : ["Loading..."]
        }
        required={true}
        error={error}
        label="Select Transport Zone"
        name={"transportationZone"}
        value={selectedTransportObj}
        onChange={(e) => handleTransportCodeChange(e)}
        placeholder="Search or Select"
        getOptionLabel={(option) => getOptionLabel(option)}
        isMulti={false}
        size={"small"}
        disabled={disabled}
      />
    </>
  );
}

export default TOATransportZoneDropdown;
