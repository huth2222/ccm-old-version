import { Button, Stack } from "@mui/material";
import DataGridTable from "../../../CommonComponent/DataGridTable";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditOffIcon from "@mui/icons-material/EditOff";
import { useGeneralInfoStore } from "../../../../Store/createUserStore";

const SalesManDashboard = () => {
  const navigate = useNavigate();

  const fetchJobLists = userDashboardStore((state) => state.fetchJobList);
  const getJobListFromStore = userDashboardStore((state) => state.jobList);
  const isDataLoading = userDashboardStore((state) => state.isLoading);
  const user = localStorage.getItem("userData");
  const userData = JSON.parse(user);
  const empId = userData.employeeId;
  const resetJobStoreData = userDashboardStore(
    (state) => state.resetJobStoreData
  );

  // const resetSavedPayloadS
  const resetCreateserStoreData = useGeneralInfoStore(
    (state) => state.resetSavedPayloadStoreData
  );

  const columns = [
    {
      field: "jobNumber",
      headerName: "Request ID",
      flex: 1,
      minWidth: 140,
      sortable: false,
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
      minWidth: 120,
      sortable: false,
    },
    {
      field: "channelName",
      headerName: "Channel",
      flex: 1,
      minWidth: 120,
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
      field: "taxId",
      headerName: "Tax ID",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => {
        if (row.jobType === "changeCustomer") {
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
        if (row.jobType === "changeCustomer") {
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
        return <div>{dayjs(row.createDate).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      field: "completedDate",
      headerName: "Complete Date",
      flex: 1,
      minWidth: 120,
      sortable: false,
      align: "center",
      // type: "date",
      renderCell: ({ row }) => {
        return (
          <div>
            {row.completedDate
              ? dayjs(row.completedDate).format("DD/MM/YYYY")
              : "-"}
          </div>
        );
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
            {row.jobType === "newCustomer" ? "New Customer" : row.jobType}
          </div>
        );
      },
    },
    {
      field: "isDraft",
      headerName: "DOC Status",
      flex: 1,
      minWidth: 280,
      sortable: false,
      // cellClassName: "text-green",
      // cellClassName: (row) => {
      //   return Object.keys(row?.status || {}).length !== 0
      //     ? row.status[empId]?.includes("Rejected")
      //       ? "text-red"
      //       : "text-black"
      //     : "text-black";
      // },
      renderCell: ({ row }) => {
        return <div>{row.isDraft ? "Draft" : row.status[empId]}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) => {
        // console.log(row.status[empId]);
        if (!row.isDraft) {
          return (
            <Stack direction="row" spacing={1}>
              {row.jobType === "newCustomer" ? (
                row.status[empId] === "Approved" ||
                row.status[empId] === "Completed" ||
                row.status[empId].includes("Waiting") ? (
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/edituser/view/1/${row._id}`)}
                    sx={{
                      backgroundColor: !row.status[empId].includes("Waiting")
                        ? "green"
                        : "gray",
                    }}
                  >
                    <VisibilityIcon />
                  </Button>
                ) : row.status[empId].includes("Cancelled") ||
                  row.status[empId].includes("Pending") ? (
                  <Button
                    sx={{ backgroundColor: "gray" }}
                    // color="gray"
                    variant="contained"
                    onClick={() => navigate(`/edituser/view/1/${row._id}`)}
                  >
                    <EditOffIcon />
                  </Button>
                ) : (
                  row.status[empId].includes("Rejected") && (
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() => navigate(`/edituser/addinfo/1/${row._id}`)}
                    >
                      <EditIcon />
                    </Button>
                  )
                )
              ) : row.status[empId] === "Approved" ||
                row.status[empId] === "Completed" ||
                row.status[empId].includes("Waiting") ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/change-request/status/${row._id}`)}
                  sx={{
                    backgroundColor: !row.status[empId].includes("Waiting")
                      ? "green"
                      : "gray",
                  }}
                  // color={!row.status[empId].includes("Waiting") && "success"}
                  // color="disabled"
                >
                  <VisibilityIcon />
                </Button>
              ) : row.status[empId].includes("Cancelled") ||
                row.status[empId].includes("Pending") ? (
                <Button
                  sx={{ backgroundColor: "gray" }}
                  // color="gray"
                  variant="contained"
                  onClick={() => navigate(`/change-request/status/${row._id}`)}
                >
                  <EditOffIcon />
                </Button>
              ) : (
                row.status[empId].includes("Rejected") && (
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => navigate(`/change-request/edit/${row._id}`)}
                  >
                    <EditIcon />
                  </Button>
                )
              )}
            </Stack>
          );
        } else {
          return row.jobType === "changeCustomer" ? (
            <Button
              variant="contained"
              disabled={row.isDraft ? false : true}
              onClick={() =>
                // navigate(`/edituser/addinfo/${row.draftIndex}/${row._id}`)
                navigate(`/change-request/edit/${row._id}`)
              }
            >
              <EditIcon />
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={row.isDraft ? false : true}
              onClick={() =>
                navigate(`/edituser/addinfo/${row.draftIndex}/${row._id}`)
              }
            >
              <EditIcon />
            </Button>
          );
        }
      },
    },
  ];

  const rows = getJobListFromStore;

  const menuItem = ["Completed", "Reject", "Cancelled"];

  const handleCreate = () => {
    resetJobStoreData();
    resetCreateserStoreData();
    navigate("/createuser/addinfo");
  };

  useEffect(() => {
    // fetchJobLists();
  }, []);
  // console.log(getJobListFromStore);

  return (
    <div>
      <NavHeaderDashboard
        headingText={"Create Customer Info."}
        menuItem={menuItem}
        handleClickCreateButton={handleCreate}
      />
      <DataGridTable
        autoHeight
        className="m-6"
        rows={rows.length > 0 ? rows : []}
        columns={columns}
        loading={isDataLoading}
        exportNotNeed={false}
        disableRowSelectionOnClick
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default SalesManDashboard;
