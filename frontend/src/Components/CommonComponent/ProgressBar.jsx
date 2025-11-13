import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import CommentBox from "./CommentBox";
import { userDashboardStore } from "../../Store/jobDashboard";
import dayjs from "dayjs";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#5ae4a7", // Progress Line Color
      backgroundImage: "linear-gradient(314deg, #808080 30%, #5ae4a7 74%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#5ae4a7",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "gray",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "gray",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.step.includes("Pending") && {
    backgroundColor: "gray", // inactive icon color
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(!ownerState.step.includes("Pending") && {
    backgroundColor: `${
      ownerState.step === "Rejected"
        ? "orange"
        : ownerState.step === "Cancelled"
        ? "red"
        : ownerState.step === "Approved" && "#5ae4a7"
    }`,
  }),
  // ...(ownerState.completed && {
  //   // backgroundColor: "tomato", //icon color.
  //   backgroundColor: `${
  //     ownerState.step === "Rejected" ? "orange" : "#5ae4a7"
  //   }`, //icon color.
  // }),
}));

function ColorlibStepIcon(props, total, step) {
  const { active, completed, className } = props;

  function createIndexObject(length) {
    const indexObject = {};
    for (let i = 0; i < length; i++) {
      indexObject[i] = i;
    }
    return indexObject;
  }

  const number = total;
  const icons = createIndexObject(number);

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active, step }}
      className={className}
      colorStep={step}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
  error: PropTypes.step,
};

// eslint-disable-next-line react/prop-types
export default function ProgressBar({
  activeStepLabel = 1,
  isCommentBoxVisible,
  getJobData,
}) {
  const initialStepData = [
    {
      no: 1,
      role: "Senior Supervisor",
      status: "Pending",
    },
    {
      no: 2,
      role: "Senior Manager",
      status: "Pending",
    },
    {
      no: 3,
      role: "SGH",
      status: "Pending",
    },
    {
      no: 4,
      role: "Div Head",
      status: "Pending",
    },
    {
      no: 5,
      role: "CEO",
      status: "Pending",
    },
    {
      no: 6,
      role: "Officer",
      status: "Pending",
    },
    {
      no: 7,
      role: "Assistant Manager",
      status: "Pending",
    },
    {
      no: 8,
      role: "AR Master",
      status: "Pending",
    },
  ];
  const approveSequenceData = userDashboardStore(
    (state) => state.approveSequenceData
  );

  function findIndicesBeforeRejectOrCancel(array) {
    const rejectOrCancelIndex = array.findIndex(
      (item) =>
        item.status === "Rejected" ||
        item.status === "Cancelled" ||
        item.status === "Pending"
    );
    if (rejectOrCancelIndex === -1) {
      return array.map((_, index) => index);
    }
    return Array.from({ length: rejectOrCancelIndex }, (_, index) => index);
  }

  const activeLength = findIndicesBeforeRejectOrCancel(approveSequenceData);

  const stepperDataList =
    Array.isArray(approveSequenceData) && approveSequenceData.length > 0
      ? approveSequenceData
      : initialStepData;

  return (
    <>
      <Stack sx={{ width: "100%", margin: "3rem 0 3rem 0" }} spacing={4}>
        <Stepper
          alternativeLabel={true}
          activeStep={activeLength.length + 1}
          connector={<ColorlibConnector />}
        >
          <Step>
            <StepLabel
              StepIconComponent={(props) =>
                ColorlibStepIcon(props, stepperDataList?.length + 2, "Approved")
              }
            >
              Create
              {getJobData?.requesterUser?.name && (
                <p className="font-semibold">
                  {getJobData?.requesterUser?.name}
                </p>
              )}
              {stepperDataList[0]?.datetime && (
                <p className="normal">
                  {dayjs(getJobData?.createDate).format("lll")}
                </p>
              )}
            </StepLabel>
          </Step>
          {stepperDataList.map((step) => (
            <Step key={step.no}>
              <StepLabel
                StepIconComponent={(props) =>
                  ColorlibStepIcon(
                    props,
                    stepperDataList?.length + 2,
                    step.status
                  )
                }
              >
                {step?.role && <p>{step?.role}</p>}
                {step?.name && <p className="font-semibold">{step?.name}</p>}
                {step?.datetime && (
                  <p className="normal">
                    {dayjs(step?.datetime).format("lll")}
                  </p>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      {isCommentBoxVisible && <CommentBox />}
    </>
  );
}
