import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.clear();
    navigate("/");
  };

  const handleDashboard = () => {
    setAnchorEl(null);
    navigate("/user");
  };

  const handleUsers = () => {
    setAnchorEl(null);
    if (path === "/user-management") {
      navigate("/user");
    } else {
      navigate("/user-management");
    }
  };

  const path = location.pathname;
  const role = localStorage.getItem("role");
  // console.log(role);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 42, height: 42 }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {path === "/user-management" ? (
          <MenuItem onClick={handleUsers}>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            Customer Master
          </MenuItem>
        ) : (
          <div>
            <MenuItem onClick={handleDashboard}>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            {role === "AR Master" && (
              <>
                <MenuItem onClick={handleUsers}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                  </ListItemIcon>
                  User Management
                </MenuItem>
                <MenuItem onClick={() => navigate("/possiblentries")}>
                  <ListItemIcon>
                    <FormatListNumberedIcon fontSize="small" />
                  </ListItemIcon>
                  Upload Possible Entries
                </MenuItem>
                <MenuItem onClick={() => navigate("/report")}>
                  <ListItemIcon>
                    <AssessmentIcon fontSize="small" />
                  </ListItemIcon>
                  Report
                </MenuItem>
              </>
            )}
          </div>
        )}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
