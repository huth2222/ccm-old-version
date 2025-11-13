import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { makeStyles } from "@mui/styles";
// import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { userDashboardStore } from "../../Store/jobDashboard";
import { comment } from "postcss";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
// import { deepOrange, deepPurple } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
  chatButton: {
    // position: "static",
    // top: 16,
    // right: 16,
  },
  chatCard: {
    position: "absolute",
    top: "4rem",
    right: "6rem",
    width: 400, // Adjust card width as needed
    display: "none",
    backgroundColor: "#fff",
    zIndex: 2,
    border: "1px solid rgb(249 115 22)",
  },
  showChatCard: {
    display: "block",
  },
}));

const chatButton = {
  position: "absolute",
  top: "1.4rem",
  right: "6rem",
  zIndex: 1, // Ensure the button is on top
};

const closeIcon = {
  position: "absolute",
  bottom: "22px",
  right: "-11px",
  zIndex: 1, // Ensure the button is on top
};

const CommentBox = () => {
  const getJobData = userDashboardStore((state) => state.job);

  const classes = useStyles();
  const [isChatOpen, setChatOpen] = useState(false);
  const [commentData, setCommentData] = useState([]);

  const toggleChatCard = () => {
    setChatOpen(!isChatOpen);
  };

  const extractCommentData = getJobData.actionLog;

  useEffect(() => {
    const data = Array.isArray(extractCommentData);
    data && setCommentData(data ? extractCommentData : []);
  }, [extractCommentData]);

  return (
    <div className="w-64">
      <Button
        variant="contained"
        color="warning"
        // className={classes.chatButton}
        startIcon={<ChatIcon />}
        onClick={toggleChatCard}
        sx={chatButton}
      >
        Comment History
      </Button>
      <Card
        className={`${classes.chatCard} ${
          isChatOpen ? classes.showChatCard : ""
        } shadow-2xl`}
        style={{
          height: `${commentData.length > 0 ? "400px" : "160px"}`,
          overflow: "auto",
        }}
      >
        <CardContent sx={{ paddingTop: "0px" }}>
          <div
            className="sticky top-0 h-16"
            style={{ backgroundColor: "#fff", zIndex: 1 }}
          >
            <p className="pt-2 text-orange500 text-2xl tracking-wide font-semibold text-center border-botttom">
              Comment History
            </p>
            <IconButton
              sx={closeIcon}
              aria-label="close"
              title="close popup"
              onClick={toggleChatCard}
            >
              <CloseIcon sx={{ fontSize: "larger" }} />
            </IconButton>
          </div>
          {commentData.length > 0 ? (
            commentData.map((item) => {
              return (
                <div
                  className="rounded p-1 m-3 drop-shadow-lg flex "
                  style={{ border: "", backgroundColor: "#efefef" }}
                  key={item?.from?._id}
                >
                  <div className="p-2 w-3/6">
                    <div className="">
                      <Avatar
                        sx={{ width: 30, height: 30, bgcolor: "#673ab7" }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </div>
                    <p className="font-bold hyphens-auto font-serif">
                      {item.from.name}
                    </p>
                    <Typography
                      style={{
                        color: `${
                          item.action.includes("approve") ? "green" : "red"
                        }`,
                      }}
                    >
                      Status - {item.action}
                    </Typography>
                  </div>
                  <div className="w-3/6">
                    {item.action !== "approve" && (
                      <Typography>Topic</Typography>
                    )}
                    <Typography
                      sx={{ fontSize: "14px" }}
                      className="break-normal hyphens-auto font-serif"
                    >
                      {item.comment}
                    </Typography>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center hover:italic items-center mt-3">
              <p className="text-xl">No Comments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentBox;
