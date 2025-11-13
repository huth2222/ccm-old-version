import { useEffect, useState } from "react";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import MyDatePicker from "../../../CommonComponent/MyDatePicker";
import DataGridTable from "../../../CommonComponent/DataGridTable";
import dayjs from "dayjs";
import { getAxiosCall } from "../../../../Utility/HelperFunction";
import { MenuItem, TextField } from "@mui/material";
import XLSX from "xlsx";

const Report = () => {
  const [dateStart, setDateStart] = useState(dayjs().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [datareport, setDataReport] = useState([]);
  const [datamaster, setDataMaster] = useState([]);
  const [docType, setDocType] = useState("all");
  const [company, setCompany] = useState("all");

  const calculateDateDiff = (dateafter, datebefore) => {
    try {
      const date1 = new Date(datebefore);
      const date2 = new Date(dateafter);
      // Calculate the difference in milliseconds
      const diffInMilliseconds = date2 - date1;

      // Convert milliseconds into useful units
      const millisecondsPerSecond = 1000;
      const millisecondsPerMinute = millisecondsPerSecond * 60;
      const millisecondsPerHour = millisecondsPerMinute * 60;

      // Calculate the difference in hours, minutes, and seconds
      const hours = Math.floor(diffInMilliseconds / millisecondsPerHour);
      const minutes = Math.floor(
        (diffInMilliseconds % millisecondsPerHour) / millisecondsPerMinute
      );
      const seconds = Math.floor(
        (diffInMilliseconds % millisecondsPerMinute) / millisecondsPerSecond
      );

      return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds}`;
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "jobNumber",
      headerName: "Request ID",
      minWidth: 140,
    },
    {
      field: "companyName",
      headerName: "Company",
      minWidth: 120,
    },
    {
      field: "customerId",
      headerName: "Customer ID",
      minWidth: 150,
      renderCell: (row) => {
        if (row?.row?.customerId?.length > 0) {
          return <div>{row?.row?.customerId}</div>;
        } else {
          return <div>{row?.row?.verify?.customerId}</div>;
        }
      },
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      minWidth: 220,
      renderCell: (row) => {
        if (
          row?.row?.verify?.customerId?.length > 0 ||
          row?.row?.customerId?.length > 0
        ) {
          return (
            <div>{row?.row?.generalInfomation?.originalGeneral?.name[0]}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "channel",
      headerName: "Channel",
      minWidth: 110,
      renderCell: (row) => {
        return <div>{row?.row?.verify?.channel}</div>;
      },
    },
    {
      field: "jobType",
      headerName: "Doc type",
      minWidth: 150,
      renderCell: (row) => {
        if (row?.row?.jobType === "changeCustomer") {
          return <div>Change Customer</div>;
        } else {
          return <div>New Customer</div>;
        }
      },
    },
    {
      field: "requester",
      headerName: "Requester",
      minWidth: 200,
      renderCell: (row) => {
        return <div>{row?.row?.requesterUser?.name}</div>;
      },
    },
    {
      field: "requester_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        return (
          <div>{dayjs(row?.row?.createDate).format("DD/MM/YYYY HH:mm")}</div>
        );
      },
    },
    {
      field: "supervisor",
      headerName: "Supervisor",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "supervisor_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "supervisor_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "sgh",
      headerName: "SGH",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "sgh_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "sgh_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame1.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame2.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "div_head",
      headerName: "Div Head",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Div Head") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "div_head_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Div Head") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "div_head_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame1.push(item);
            } else if (item?.role === "Div Head") {
              dataSame2.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame3.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_doa",
      headerName: "CEO",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_doa_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_doa_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Div Head") {
              dataSame1.push(item);
            } else if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame2.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame3.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame4.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame4?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame4[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_officer",
      headerName: "AR officer",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_officer_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_officer_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        let dataSame5 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame1.push(item);
            } else if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame2.push(item);
            } else if (item?.role === "Div Head") {
              dataSame3.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame4.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame5.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame4?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame4[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame5?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame5[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_assistant_manager",
      headerName: "AR Assistant Manager",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Assistant Manager") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_assistant_manager_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Assistant Manager") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_assistant_manager_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        let dataSame5 = [];
        let dataSame6 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame1.push(item);
            } else if (item?.role === "Assistant Manager") {
              dataSame2.push(item);
            } else if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame3.push(item);
            } else if (item?.role === "Div Head") {
              dataSame4.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame5.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame6.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame4?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame4[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame5?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame5[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame6?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame6[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_manager",
      headerName: "AR Master",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "AR Master") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_manager_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "AR Master") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ar_manager_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        let dataSame5 = [];
        let dataSame6 = [];
        let dataSame7 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "Assistant Manager") {
              dataSame1.push(item);
            } else if (item?.role === "AR Master") {
              dataSame2.push(item);
            } else if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame3.push(item);
            } else if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame4.push(item);
            } else if (item?.role === "Div Head") {
              dataSame5.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame6.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame7.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame4?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame4[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame5?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame5[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame6?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame6[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame7?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame7[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "cfo",
      headerName: "CFO",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CFO") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "cfo_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CFO") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "cfo_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        let dataSame5 = [];
        let dataSame6 = [];
        let dataSame7 = [];
        let dataSame8 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "AR Master") {
              dataSame1.push(item);
            } else if (item?.role === "CFO") {
              dataSame2.push(item);
            } else if (item?.role === "Assistant Manager") {
              dataSame3.push(item);
            } else if (
              (item?.role === "Officer" || item?.role === "Supervisor") &&
              item?.userType === "AR"
            ) {
              dataSame4.push(item);
            } else if (item?.role === "CEO" && item?.userType === "DOA") {
              dataSame5.push(item);
            } else if (item?.role === "Div Head") {
              dataSame6.push(item);
            } else if (
              item?.role === "SGH" ||
              (item?.role === "Senior Manager" && item?.userType === "Sale")
            ) {
              dataSame7.push(item);
            } else if (
              (item?.role === "Supervisor" ||
                item?.role === "Senior Supervisor") &&
              item?.userType === "Sale"
            ) {
              dataSame8.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame3?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame3[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame4?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame4[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame5?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame5[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame6?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame6[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame7?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame7[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame8?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame8[0]?.datetime
              )}
            </div>
          );
        } else if (dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(dataSame2[0]?.datetime, row?.row?.createDate)}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_coapprove",
      headerName: "CEO",
      minWidth: 200,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CEO" && item?.userType === "Co Approve") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return <div>{dataSame[0]?.name}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_coapprove_date_time",
      headerName: "Date Time",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "CEO" && item?.userType === "Co Approve") {
              dataSame.push(item);
            }
          });
        }
        if (dataSame?.length > 0) {
          return (
            <div>{dayjs(dataSame[0]?.datetime).format("DD/MM/YYYY HH:mm")}</div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "ceo_coapprove_time_diff",
      headerName: "Timediff",
      minWidth: 140,
      renderCell: (row) => {
        let dataSame1 = [];
        let dataSame2 = [];
        if (row?.row?.datastep?.length > 0) {
          row?.row?.datastep?.map((item) => {
            if (item?.role === "AR Master") {
              dataSame1.push(item);
            } else if (
              item?.role === "CEO" &&
              item?.userType === "Co Approve"
            ) {
              dataSame2.push(item);
            }
          });
        }
        if (dataSame1?.length > 0 && dataSame2?.length > 0) {
          return (
            <div>
              {calculateDateDiff(
                dataSame2[0]?.datetime,
                dataSame1[0]?.datetime
              )}
            </div>
          );
        } else {
          return <div>{` `}</div>;
        }
      },
    },
  ];

  const formatDate = (data) => {
    try {
      if (data?.length > 0) {
        const newDate = data.split(".");
        return dayjs(newDate[2] + "-" + newDate[1] + "-" + newDate[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReport = async () => {
    try {
      setLoading(true);
      const resDataReport = await getAxiosCall(
        `job/report/?startDate=${dateStart}&endDate=${dateEnd}`
      );
      if (resDataReport?.data?.status_code === 200) {
        const rows = resDataReport?.data?.data.map((item) => {
          return { ...item, id: item._id };
        });
        setDataReport(rows);
        setDataMaster(rows);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const sortDataAll = async () => {
    try {
      if (docType !== "" && datamaster?.length > 0) {
        setLoading(true);
        let master_temp = [];
        if (datamaster?.length > 0) {
          master_temp = [...datamaster];
        }

        if (docType === "all") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            data_same.push(item);
          }
          master_temp = data_same;
        } else if (docType === "new") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            if (item?.jobType !== undefined && item?.jobType !== null) {
              if (item?.jobType === "newCustomer") {
                data_same.push(item);
              }
            }
          }
          master_temp = data_same;
        } else if (docType === "change") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            if (item?.jobType !== undefined && item?.jobType !== null) {
              if (item?.jobType === "changeCustomer") {
                data_same.push(item);
              }
            }
          }
          master_temp = data_same;
        }

        if (company === "all") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            data_same.push(item);
          }
          master_temp = data_same;
        } else if (company === "1100") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            if (
              item?.verify?.companyCode !== undefined &&
              item?.verify?.companyCode !== null
            ) {
              if (item?.verify?.companyCode === "1100") {
                data_same.push(item);
              }
            }
          }
          master_temp = data_same;
        } else if (company === "1200") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            if (
              item?.verify?.companyCode !== undefined &&
              item?.verify?.companyCode !== null
            ) {
              if (item?.verify?.companyCode === "1200") {
                data_same.push(item);
              }
            }
          }
          master_temp = data_same;
        } else if (company === "5100") {
          let data_same = [];
          // eslint-disable-next-line no-unused-vars
          for await (const [_, item] of master_temp.entries()) {
            if (
              item?.verify?.companyCode !== undefined &&
              item?.verify?.companyCode !== null
            ) {
              if (item?.verify?.companyCode === "5100") {
                data_same.push(item);
              }
            }
          }
          master_temp = data_same;
        }

        const uniqueData = master_temp.filter((obj, index, self) => {
          return (
            index ===
            self.findIndex(
              (item) => item?.id === obj?.id // Change 'name' to the desired property
            )
          );
        });
        setDataReport(uniqueData);
        setLoading(false);
      } else {
        setLoading(true);
        setDataReport(datamaster);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getReport();
  }, [dateStart, dateEnd]);

  useEffect(() => {
    sortDataAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, docType]);

  const clickExportFile = async () => {
    try {
      let data_new = [];
      // eslint-disable-next-line no-unused-vars
      for await (const [_, item] of datareport.entries()) {
        let dataSame1 = [];
        let dataSame2 = [];
        let dataSame3 = [];
        let dataSame4 = [];
        let dataSame5 = [];
        let dataSame6 = [];
        let dataSame7 = [];
        let dataSame8 = [];
        let dataSame9 = [];
        if (item?.datastep?.length > 0) {
          await item?.datastep?.map((x) => {
            if (
              (x?.role === "Supervisor" || x?.role === "Senior Supervisor") &&
              x?.userType === "Sale"
            ) {
              dataSame1.push(x);
            } else if (
              x?.role === "SGH" ||
              (x?.role === "Senior Manager" && x?.userType === "Sale")
            ) {
              dataSame2.push(x);
            } else if (x?.role === "Div Head") {
              dataSame3.push(x);
            } else if (x?.role === "CEO" && x?.userType === "DOA") {
              dataSame4.push(x);
            } else if (
              (x?.role === "Officer" || x?.role === "Supervisor") &&
              x?.userType === "AR"
            ) {
              dataSame5.push(x);
            } else if (x?.role === "Assistant Manager") {
              dataSame6.push(x);
            } else if (x?.role === "AR Master") {
              dataSame7.push(x);
            } else if (x?.role === "CFO") {
              dataSame8.push(x);
            } else if (x?.role === "CEO" && x?.userType === "Co Approve") {
              dataSame9.push(x);
            }
          });
        }

        data_new.push({
          "Request ID": item?.jobNumber,
          Company: item?.companyName,
          "Customer ID":
            item?.customerId?.length > 0
              ? item?.customerId
              : item?.verify?.customerId,
          "Customer Name":
            item?.verify?.customerId?.length > 0 || item?.customerId?.length
              ? item?.generalInfomation?.originalGeneral?.name[0]
              : "",
          Channel: item?.verify?.channel,
          "Doc type":
            item?.jobType === "changeCustomer"
              ? "Change Customer"
              : "New Customer",
          Requester: item?.requesterUser?.name,
          "Date Time (Requester )": dayjs(item?.createDate).format(
            "DD/MM/YYYY HH:mm"
          ),
          Supervisor: dataSame1?.length > 0 ? dataSame1[0]?.name : "",
          "Date Time (Supervisor)":
            dataSame1?.length > 0
              ? dayjs(dataSame1[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (Supervisor)":
            dataSame1?.length > 0
              ? calculateDateDiff(dataSame1[0]?.datetime, item?.createDate)
              : "",
          SGH: dataSame2?.length > 0 ? dataSame2[0]?.name : "",
          "Date Time (SGH)":
            dataSame2?.length > 0
              ? dayjs(dataSame2[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (SGH)":
            dataSame1?.length > 0 && dataSame2?.length > 0
              ? calculateDateDiff(
                  dataSame2[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame2?.length > 0
              ? calculateDateDiff(dataSame2[0]?.datetime, item?.createDate)
              : "",
          "Div Head": dataSame3?.length > 0 ? dataSame3[0]?.name : "",
          "Date Time (Div Head)":
            dataSame3?.length > 0
              ? dayjs(dataSame3[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (Div Head)":
            dataSame2?.length > 0 && dataSame3?.length > 0
              ? calculateDateDiff(
                  dataSame3[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame3?.length > 0
              ? calculateDateDiff(
                  dataSame3[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame3?.length > 0
              ? calculateDateDiff(dataSame3[0]?.datetime, item?.createDate)
              : "",
          "CEO DOA": dataSame4?.length > 0 ? dataSame4[0]?.name : "",
          "Date Time (CEO DOA)":
            dataSame4?.length > 0
              ? dayjs(dataSame4[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (CEO DOA)":
            dataSame3?.length > 0 && dataSame4?.length > 0
              ? calculateDateDiff(
                  dataSame4[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame4?.length > 0
              ? calculateDateDiff(
                  dataSame4[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame4?.length > 0
              ? calculateDateDiff(
                  dataSame4[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame4?.length > 0
              ? calculateDateDiff(dataSame4[0]?.datetime, item?.createDate)
              : "",
          "AR officer": dataSame5?.length > 0 ? dataSame5[0]?.name : "",
          "Date Time (AR officer)":
            dataSame5?.length > 0
              ? dayjs(dataSame5[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (AR officer)":
            dataSame4?.length > 0 && dataSame5?.length > 0
              ? calculateDateDiff(
                  dataSame5[0]?.datetime,
                  dataSame4[0]?.datetime
                )
              : dataSame3?.length > 0 && dataSame5?.length > 0
              ? calculateDateDiff(
                  dataSame5[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame5?.length > 0
              ? calculateDateDiff(
                  dataSame5[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame5?.length > 0
              ? calculateDateDiff(
                  dataSame5[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame5?.length > 0
              ? calculateDateDiff(dataSame5[0]?.datetime, item?.createDate)
              : "",
          "AR Assistant Manager":
            dataSame6?.length > 0 ? dataSame6[0]?.name : "",
          "Date Time (AR Assistant Manager)":
            dataSame6?.length > 0
              ? dayjs(dataSame6[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (AR Assistant Manager)":
            dataSame5?.length > 0 && dataSame6?.length > 0
              ? calculateDateDiff(
                  dataSame6[0]?.datetime,
                  dataSame5[0]?.datetime
                )
              : dataSame4?.length > 0 && dataSame6?.length > 0
              ? calculateDateDiff(
                  dataSame6[0]?.datetime,
                  dataSame4[0]?.datetime
                )
              : dataSame3?.length > 0 && dataSame6?.length > 0
              ? calculateDateDiff(
                  dataSame6[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame6?.length > 0
              ? calculateDateDiff(
                  dataSame6[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame6?.length > 0
              ? calculateDateDiff(
                  dataSame6[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame6?.length > 0
              ? calculateDateDiff(dataSame6[0]?.datetime, item?.createDate)
              : "",
          "AR Master": dataSame7?.length > 0 ? dataSame7[0]?.name : "",
          "Date Time (AR Master)":
            dataSame7?.length > 0
              ? dayjs(dataSame7[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (AR Master)":
            dataSame6?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame6[0]?.datetime
                )
              : dataSame5?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame5[0]?.datetime
                )
              : dataSame4?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame4[0]?.datetime
                )
              : dataSame3?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame7?.length > 0
              ? calculateDateDiff(
                  dataSame7[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame7?.length > 0
              ? calculateDateDiff(dataSame7[0]?.datetime, item?.createDate)
              : "",
          CFO: dataSame8?.length > 0 ? dataSame8[0]?.name : "",
          "Date Time (CFO)":
            dataSame8?.length > 0
              ? dayjs(dataSame8[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (CFO)":
            dataSame7?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame7[0]?.datetime
                )
              : dataSame6?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame6[0]?.datetime
                )
              : dataSame5?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame5[0]?.datetime
                )
              : dataSame4?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame4[0]?.datetime
                )
              : dataSame3?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame8?.length > 0
              ? calculateDateDiff(
                  dataSame8[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame8?.length > 0
              ? calculateDateDiff(dataSame8[0]?.datetime, item?.createDate)
              : "",
          CEO: dataSame9?.length > 0 ? dataSame9[0]?.name : "",
          "Date Time (CEO)":
            dataSame9?.length > 0
              ? dayjs(dataSame9[0]?.datetime).format("DD/MM/YYYY HH:mm")
              : "",
          "Timediff (CEO)":
            dataSame8?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame8[0]?.datetime
                )
              : dataSame7?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame7[0]?.datetime
                )
              : dataSame6?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame6[0]?.datetime
                )
              : dataSame5?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame5[0]?.datetime
                )
              : dataSame4?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame4[0]?.datetime
                )
              : dataSame3?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame3[0]?.datetime
                )
              : dataSame2?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame2[0]?.datetime
                )
              : dataSame1?.length > 0 && dataSame9?.length > 0
              ? calculateDateDiff(
                  dataSame9[0]?.datetime,
                  dataSame1[0]?.datetime
                )
              : dataSame9?.length > 0
              ? calculateDateDiff(dataSame9[0]?.datetime, item?.createDate)
              : "",
        });
      }
      const time_export = dayjs().format("DD-MM-YYYY-HMSS");
      const dataWS = XLSX.utils.json_to_sheet(data_new, {
        header: [
          "Request ID",
          "Company",
          "Customer ID",
          "Customer Name",
          "Channel",
          "Doc type",
          "Requester",
          "Date Time (Requester )",
          "Supervisor",
          "Date Time (Supervisor)",
          "Timediff (Supervisor)",
          "SGH",
          "Date Time (SGH)",
          "Timediff (SGH)",
          "Div Head",
          "Date Time (Div Head)",
          "Timediff (Div Head)",
          "CEO DOA",
          "Date Time (CEO DOA)",
          "Timediff (CEO DOA)",
          "AR officer",
          "Date Time (AR officer)",
          "Timediff (AR officer)",
          "AR Assistant Manager",
          "Date Time (AR Assistant Manager)",
          "Timediff (AR Assistant Manager)",
          "AR Master",
          "Date Time (AR Master)",
          "Timediff (AR Master)",
          "CFO",
          "Date Time (CFO)",
          "Timediff (CFO)",
          "CEO",
          "Date Time (CEO)",
          "Timediff (CEO)",
        ],
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, dataWS, "ReportCustomer");
      XLSX.writeFile(wb, `report_customer_${time_export}.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavHeaderDashboard headingText={"Report"} requireActionBar={false} />
      <div className="container-report-1">
        <MyDatePicker
          className={"w-48"}
          label={"Date Start"}
          name="dateStart"
          value={
            dateStart?.includes(".") ? formatDate(dateStart) : dayjs(dateStart)
          }
          onChange={(date) => setDateStart(dayjs(date).format("YYYY-MM-DD"))}
        />
        <MyDatePicker
          className={"w-48 ml-3"}
          label={"Date End"}
          name="dateEnd"
          value={dateEnd?.includes(".") ? formatDate(dateEnd) : dayjs(dateEnd)}
          onChange={(date) => setDateEnd(dayjs(date).format("YYYY-MM-DD"))}
        />
        <div style={{ marginLeft: 10 }} />
        <TextField
          className="w-40"
          size="small"
          select
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="1100">1100</MenuItem>
          <MenuItem value="1200">1200</MenuItem>
          <MenuItem value="5100">5100</MenuItem>
        </TextField>
        <div style={{ marginLeft: 10 }} />
        <TextField
          className="w-40"
          size="small"
          select
          label="Doc Type"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="new">New Customer</MenuItem>
          <MenuItem value="change">Change Customer</MenuItem>
        </TextField>
        <div className="container-report-2">
          <button
            className="container-report-3"
            onClick={clickExportFile}
            disabled={datareport?.length > 0 ? false : true}
          >
            Export Excel
          </button>
        </div>
      </div>
      <DataGridTable
        autoHeight
        className="m-6"
        rows={datareport}
        columns={columns}
        loading={loading}
        checkboxSelection={false}
      />
    </>
  );
};

export default Report;
