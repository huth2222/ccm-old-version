import { DataGrid } from "@mui/x-data-grid";
import NavHeader from "../../../../CommonComponent/NavHeader";
import DataGridTable from "../../../../CommonComponent/DataGridTable";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAxiosCall,
  putAxiosCall,
} from "../../../../../Utility/HelperFunction";
import { toast } from "react-toastify";

function UserActivationRequestList() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStaus, setUserStaus] = useState("Active");
  const [searchWord, setSearchWord] = useState("");

  const toastClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const filterUser = (id) => {
    const freshUsers = userList.filter((user) => {
      return user._id !== id;
    });
    // console.log(freshUsers);
    setUserList(freshUsers);
  };

  const handleApproveUser = async (id) => {
    const sendRequestForActivation = await putAxiosCall(
      `activate-user/reject/${id}`,
      {}
    );
    if (
      sendRequestForActivation?.data?.status === "success" &&
      sendRequestForActivation?.status === 200
    ) {
      toast.success("User Approved Successfully.", toastClasses);
      filterUser(id);
    }
  };

  const handleRejectUser = async (id) => {
    const sendRequestForReject = await putAxiosCall(
      `activate-user/approve/${id}`,
      {}
    );
    if (
      sendRequestForReject?.data?.status === "success" &&
      sendRequestForReject?.status === 200
    ) {
      toast.success("User Rejected Successfully.", toastClasses);
      filterUser(id);
    }
  };

  const handleActiveUsers = async (id) => {
    // console.log(id);
    const sendRequestForActive = await putAxiosCall(`users/active/${id}`, {});
    // console.log(sendRequestForActive);
    if (sendRequestForActive?.status === 200) {
      toast.success("User Activated Successfully.", toastClasses);
      filterUser(id);
    }
  };

  const handleInActiveUsers = async (id) => {
    const sendRequestForInActive = await putAxiosCall(
      `users/inactive/${id}`,
      {}
    );
    if (sendRequestForInActive?.status === 200) {
      toast.success("User InActive Successfully.", toastClasses);
      filterUser(id);
    }
  };

  const columns = [
    { field: "employeeId", headerName: "Employee Id", width: 150 },
    { field: "email", headerName: "Email", width: 170 },
    { field: "companyCode", headerName: "Company", width: 130 },
    { field: "distChannel", headerName: "Channel", width: 100 },
    { field: "userType", headerName: "User Type", width: 150 },
    { field: "role", headerName: "Position", width: 150 },
    { field: "level", headerName: "Level", width: 130 },
    { field: "salesGroup", headerName: "Sales Group", width: 150 },
    { field: "salesDistrict", headerName: "Sales District", width: 150 },
    {
      field: "id",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (row) => {
        if (userStaus === "Approved") {
          return (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                handleInActiveUsers(row.id);
              }}
            >
              Inactive
            </Button>
          );
        } else if (userStaus === "Rejected") {
          return (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                handleActiveUsers(row.id);
              }}
            >
              Active
            </Button>
          );
        } else if (userStaus === "Active") {
          return (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleApproveUser(row.id);
                }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  handleRejectUser(row.id);
                }}
              >
                Reject
              </Button>
            </Stack>
          );
        }
        // return ( ;
        // );
      },
    },
  ];

  const rows = userList.map((item) => {
    return { ...item, id: item._id };
  });

  const getUserData = async (endpoint) => {
    const request = await getAxiosCall(endpoint);
    setIsLoading(true);
    if (request.status === 200) {
      setUserList(request.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData("activate-user");
  }, []);

  const menuItem = ["Approved", "Rejected"];

  const handleSelectUser = async (e) => {
    const { value } = e.target;
    setUserStaus(value);
    // console.log(value);

    // if (value === "Approved") {
    //   const requestData = await getAxiosCall(
    //     "users/approvedList?searchText=all"
    //   );
    //   // console.log(requestData);
    //   const data = requestData.data;
    //   requestData.status === 200 && setUserList(data);
    // } else if (value === "Rejected") {
    //   const requestData = await getAxiosCall(
    //     "users/rejectedList?searchText=all"
    //   );
    //   // console.log(requestData);
    //   const data = requestData.data;
    //   requestData.status === 200 && setUserList(data);
    // } else if (value === "Active") {
    //   getUserData("activate-user?searchText=all");
    // }
  };

  const filterUsers = async (type, searchtext) => {
    setIsLoading(true);
    if (type === "Approved") {
      const sendRequest = await getAxiosCall(
        `users/approvedList?searchText=${searchtext}`
      );
      // sendRequest.status === 200 && setUserList(data);
      if (sendRequest.status === 200) {
        const data = sendRequest.data;
        setUserList(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setUserList([]);
      }
      // console.log(sendRequest);
    } else if (type === "Rejected") {
      const sendRequest = await getAxiosCall(
        `users/rejectedList?searchText=${searchtext}`
      );
      if (sendRequest.status === 200) {
        const data = sendRequest.data;
        setUserList(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setUserList([]);
      }
      // const data = sendRequest.data;
      // sendRequest.status === 200 && setUserList(data);
    } else if (type === "Active") {
      const sendRequest = await getUserData(
        `activate-user?searchText=${searchtext}`
      );

      if (sendRequest.status === 200) {
        const data = sendRequest.data;
        setUserList(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setUserList([]);
      }
    }
  };

  useEffect(() => {
    // Debouncing effect
    const getData = setTimeout(() => {
      filterUsers(userStaus, searchWord);
    }, 800);

    return () => clearTimeout(getData);
  }, [searchWord, userStaus]);

  return (
    <>
      <NavHeader
        headingText={"User Activation Request List"}
        menuItem={menuItem}
        fromDate={false}
        toDate={false}
        createButton={false}
        handleDropDownSelect={handleSelectUser}
        setSearchWord={setSearchWord}
        searchText={searchWord}
      />
      <DataGridTable
        className="m-6"
        rows={rows}
        columns={columns}
        loading={isLoading}
        exportNotNeed={true}
      />
    </>
  );
}

export default UserActivationRequestList;
