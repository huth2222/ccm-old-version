import { Button, Stack } from "@mui/material";
import DataGridTable from "../../../CommonComponent/DataGridTable";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import dayjs from "dayjs";
import { fetchDataList } from "../../../../Store/createUserStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditOffIcon from "@mui/icons-material/EditOff";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { getAxiosCall } from "../../../../Utility/HelperFunction";
import Loader from "../../Loader";
import AlertDialog from "../../../CommonComponent/AlertDialog";
import { toast } from "react-toastify";
// import JSZip from "jszip";

const MasterDashboard = ({ role }) => {
  const navigate = useNavigate();

  const fetchJobLists = userDashboardStore((state) => state.fetchJobList);
  const getJobListFromStore = userDashboardStore((state) => state.jobList);
  const isDataLoading = userDashboardStore((state) => state.isLoading);
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const user = localStorage.getItem("userData");
  const userData = JSON.parse(user);
  const empId = userData.employeeId;

  const handleExport = async (row) => {
    const jobId = row?._id;
    const apiurl = `job/exportExcelJob/${jobId}`;

    const response = await fetch(apiurl, {
      method: "GET",
      headers: {
        responseType: "blob",
      },
    });
    const data = response;
    // console.log(data);

    // console.log(data.url.substring(data.url.indexOf("/", 7) + 1));
    const url = data.url.substring(data.url.indexOf("/", 7) + 1);

    const parts = data.url.split("/");
    parts[2] = ROOT_HOST;
    const updatedURL = parts.join("/");

    // console.log(updatedURL);

    const fileName = row?.jobNumber;
    const fileUrl = updatedURL;
    // const fileUrl = ROOT_API + url;

    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    a.click();
  };

  const columns = [
    {
      field: "jobNumber",
      headerName: "Request ID",
      flex: 1,
      minWidth: 140,
      sortable: false,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minwidth: 300,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        if (
          row &&
          row.generalInfomation &&
          row.generalInfomation.originalGeneral &&
          row.generalInfomation.originalGeneral.name
        ) {
          return <div>{row.generalInfomation.originalGeneral.name[0]}</div>;
        } else {
          return <div>{` `}</div>;
        }
      },
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
      minWidth: 120,
      sortable: false,
      //   renderCell: ({ row }) => {
      //     return <div>{row?.generalInfomation?.originalGeneral?.name[0]}</div>;
      //   },
    },
    {
      field: "channelName",
      headerName: "Channel",
      flex: 1,
      minWidth: 120,
      sortable: false,
      //   renderCell: ({ row }) => {
      //     return <div>{row?.generalInfomation?.originalGeneral?.name[0]}</div>;
      //   },
    },
    {
      field: "taxId",
      headerName: "Tax ID",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        if (row?.jobType === "changeCustomer") {
          return <div>{row?.taxId}</div>;
        } else {
          return <div>{row?.verify?.taxId}</div>;
        }
      },
    },
    {
      field: "customerId",
      headerName: "Customer ID",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        if (row?.jobType === "changeCustomer") {
          return <div>{row?.verify?.customerId}</div>;
        } else {
          return <div>{row?.customerId}</div>;
        }
      },
    },
    {
      field: "createDate",
      headerName: "Create Date",
      flex: 1,
      minWidth: 120,
      sortable: false,
      // type: "date",
      renderCell: ({ row }) => {
        return <div>{dayjs(row?.createDate).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      field: "jobType",
      headerName: "DOC Type",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <div>
            {row?.jobType === "newCustomer" ? "New Customer" : row?.jobType}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "DOC Status",
      flex: 1,
      minWidth: 220,
      sortable: false,
      cellClassName: (row) => {
        return row?.status
          ? row?.status[row.requesterEmployeeId]?.includes("Rejected")
            ? "text-red"
            : "text-black"
          : "text-black";
      },
      renderCell: ({ row }) => {
        return (
          <div>
            {row?.isDraft ? "Draft" : row?.status[row?.requesterEmployeeId]}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Stack direction="row" spacing={1}>
            {row?.status ? (
              row?.status[row.requesterEmployeeId].includes("Completed") ||
              row?.status[row.requesterEmployeeId] === "Waiting Customer Id" ? (
                row?.jobType === "changeCustomer" ? (
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/change-request/status/${row?._id}`)
                    }
                    color={`${
                      row?.status[row?.requesterEmployeeId].includes(
                        "Completed"
                      )
                        ? "success"
                        : "primary"
                    }`}
                  >
                    <VisibilityIcon />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/arm/view/${row?._id}`)}
                    color={`${
                      row?.status[row?.requesterEmployeeId].includes(
                        "Completed"
                      )
                        ? "success"
                        : "primary"
                    }`}
                  >
                    <VisibilityIcon />
                  </Button>
                )
              ) : row?.status[row?.requesterEmployeeId].includes("Cancelled") ||
                row?.status[row?.requesterEmployeeId].includes("Rejected") ? (
                row?.jobType === "changeCustomer" ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() =>
                      navigate(`/change-request/status/${row?._id}`)
                    }
                  >
                    <VisibilityIcon />
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => navigate(`/arm/status/${row?._id}`)}
                  >
                    <VisibilityIcon />
                  </Button>
                )
              ) : row?.status[row?.requesterEmployeeId] ===
                "Pending for AR Master approve" ? (
                row?.jobType === "changeCustomer" ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate(`/change-request/view/${row?._id}`)} // 1
                  >
                    <EditIcon />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate(`/arm/addinfo/${row?._id}`)} // 1
                  >
                    <EditIcon />
                  </Button>
                )
              ) : row?.jobType === "changeCustomer" ? (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "gray" }}
                  onClick={() => navigate(`/change-request/status/${row?._id}`)}
                >
                  <EditOffIcon />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "gray" }}
                  onClick={() => navigate(`/aro/view/${row?._id}`)}
                >
                  <EditOffIcon />
                </Button>
              )
            ) : (
              "-"
            )}
          </Stack>
        );
      },
    },
    {
      field: "exports",
      headerName: "Export",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Stack direction="row" spacing={1}>
            {row?.status ? (
              // row.status["AR Master"] === "Completed" ? (
              row?.isCompleted || row?.isWatingCustomerId ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleExport(row)}
                >
                  <FileDownloadIcon />
                </Button>
              ) : (
                <Button disabled variant="contained">
                  <FileDownloadOffIcon />
                </Button>
              )
            ) : (
              "-"
            )}
          </Stack>
        );
      },
    },
  ];

  const rows = getJobListFromStore;

  const menuItem = ["Approve", "In Process", "Reject"];
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [didSendForUpdate, setDidSendForUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const toastSuccessClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = async () => {
    setDidSendForUpdate(true);
    // alert("please wait...");
    const sendRequest = await getAxiosCall("admin/importCustomerDailyManual");
    if (sendRequest?.status === 200) {
      toast.success(sendRequest?.data?.message, toastSuccessClasses);
      setDidSendForUpdate(false);
      setOpen(false);
    } else {
      setDidSendForUpdate(false);
    }
    // console.log(sendRequest);
  };

  // useEffect(() => {
  // fetchJobLists();
  // fetchDropDownData(userData.companyCode);
  // }, []);
  // console.log("..........", { getJobListFromStore });

  const handleUpdateDatabase = () => {
    setOpen(true);
  };

  return (
    <div>
      {didSendForUpdate ? (
        <Loader />
      ) : (
        <>
          <NavHeaderDashboard
            headingText={`Create/Change Customer Info-${role}`}
            menuItem={menuItem}
            createButton={false}
            needUpdateButton={true}
            onClickUpdate={handleUpdateDatabase}
          />
          <DataGridTable
            autoHeight
            className="m-6"
            rows={rows}
            columns={columns}
            loading={isDataLoading}
            exportNotNeed={false}
            disableRowSelectionOnClick
            getRowId={(row) => row?._id}
          />
          <AlertDialog
            handleClose={handleClose}
            open={open}
            handleSend={handleSend}
          />
        </>
      )}
    </div>
  );
};

export default MasterDashboard;
