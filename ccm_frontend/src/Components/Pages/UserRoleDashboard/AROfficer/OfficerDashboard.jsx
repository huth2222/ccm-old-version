import { Button, Stack } from "@mui/material";
import DataGridTable from "../../../CommonComponent/DataGridTable";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import dayjs from "dayjs";
import { fetchDataList } from "../../../../Store/createUserStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditOffIcon from "@mui/icons-material/EditOff";

const OfficerDashboard = ({ role }) => {
  const navigate = useNavigate();

  const fetchJobLists = userDashboardStore((state) => state.fetchJobList);
  const getJobListFromStore = userDashboardStore((state) => state.jobList);
  const isDataLoading = userDashboardStore((state) => state.isLoading);
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const user = localStorage.getItem("userData");
  const userData = JSON.parse(user);
  const empId = userData.employeeId;

  const columns = [
    {
      field: "jobNumber",
      headerName: "Request ID",
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 300,
      sortable: false,
      renderCell: ({ row }) => {
        if (
          row &&
          row?.generalInfomation &&
          row?.generalInfomation.originalGeneral &&
          row?.generalInfomation.originalGeneral.name
        ) {
          return <div>{row?.generalInfomation.originalGeneral.name[0]}</div>;
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
      field: "isDraft",
      headerName: "DOC Status",
      flex: 1,
      minWidth: 120,
      sortable: false,
      cellClassName: (row) => {
        return row?.status
          ? row?.status?.[empId]?.includes("Rejected")
            ? "text-red"
            : "text-black"
          : "text-black";
      },
      renderCell: ({ row }) => {
        return <div>{row?.isDraft ? "Draft" : row?.status?.[empId]}</div>;
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
            {/* {row?.jobType === "newCustomer"} */}
            {row?.jobType === "newCustomer" ? (
              row?.status?.[empId] === "Approved" ||
              row?.status?.[empId] === "Completed" ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/aro/view/${row?._id}`)}
                  color="success"
                >
                  <VisibilityIcon />
                </Button>
              ) : row?.status?.[empId] === "Cancelled" ||
                row?.status?.[empId] === "Rejected" ? (
                <Button
                  sx={{ backgroundColor: "gray" }}
                  variant="contained"
                  onClick={() => navigate(`/aro/status/${row?._id}`)}
                >
                  <EditOffIcon />
                </Button>
              ) : (
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => navigate(`/aro/addinfo/${row?._id}`)}
                >
                  <EditIcon />
                </Button>
              )
            ) : row?.status?.[empId] === "Approved" ||
              row?.status?.[empId] === "Completed" ? (
              <Button
                variant="contained"
                onClick={() => navigate(`/change-request/status/${row?._id}`)}
                color="success"
              >
                <VisibilityIcon />
              </Button>
            ) : row?.status?.[empId] === "Cancelled" ||
              row?.status?.[empId] === "Rejected" ? (
              <Button
                sx={{ backgroundColor: "gray" }}
                variant="contained"
                onClick={() => navigate(`/change-request/status/${row?._id}`)}
              >
                <EditOffIcon />
              </Button>
            ) : (
              <Button
                color="success"
                variant="contained"
                onClick={() => navigate(`/change-request/view/${row?._id}`)}
              >
                <EditIcon />
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  const rows = getJobListFromStore;

  const menuItem = ["Approve", "In Process", "Reject"];

  useEffect(() => {
    // fetchJobLists();
    fetchDropDownData(userData.companyCode);
  }, []);
  // console.log(getJobListFromStore);

  return (
    <div>
      <NavHeaderDashboard
        headingText={`Create/Change Customer Info-${role}.`}
        menuItem={menuItem}
        createButton={false}
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
    </div>
  );
};

export default OfficerDashboard;
