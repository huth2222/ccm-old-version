const Job = require("../models/Job");
const User = require("../models/User");
const UserDOA = require("../models/UserDOA");
const UserHierarchy = require("../models/UserHierarchy");
const DataPaymentTerm = require("../models/DataPaymentTerm");
const DataPaymentTermCaptain = require("../models/DataPaymentTermCaptain");
const DataPaymentTermVietnam = require("../models/DataPaymentTermVietnam");
const sendEmail = require("../middlewares/mail");
const Customer = require("../models/Customer");

exports.submitCustomerId = async (req, res) => {
  const now = new Date();
  try {
    const jobId = req.params.jobId;
    const userId = req.user.employeeId;
    const jobData = req.body.data;

    const jobOriginal = await Job.findById(req.params.jobId);
    if (!jobOriginal) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!jobOriginal.isApproved) {
      return res.status(403).json({ message: "Forbidden Approved" });
    }

    if (!jobData.customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

    if (
      jobOriginal.pendingEmployeeId != userId &&
      req.user.role != "AR Master" &&
      req.user.role != "SUPER ADMIN"
    ) {
      return res.status(403).json({ message: "Forbidden User" });
    }

    let update = {
      $set: {
        customerId: jobData.customerId,
        isCompleted: true,
        isPending: false,
        completedDate: now,
      },
    };

    update.$set[`status.${jobOriginal.requesterEmployeeId}`] = `Completed`;
    update.$set[`status.${jobOriginal.pendingEmployeeId}`] = `Completed`;

    const job = await Job.findByIdAndUpdate(jobId, update, { new: true });
    const userCreator = await User.findOne({
      employeeId: jobOriginal.requesterEmployeeId,
    });
    if (!userCreator) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      // Create an email data object here
      const emailData = {
        type: "completeJob" + jobOriginal.jobType, // Modify this according to your email logic
        userCreator: userCreator,
        jobData: job,
        email: userCreator.email,
        date: now,
      };
      // Call the send function to send the email

      await sendEmail(emailData);

      // Return a response indicating success
      return res.json({
        status: "success",
        id: job._id,
      });
    } catch (emailError) {
      // Handle the email sending error
      console.error("Error sending reject email:", emailError);
      return res.status(500).json({
        error: "An error occurred while sending the email.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeFile = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const fileIndex = req.params.fileIndex;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.role != "SUPER ADMIN" && req.user.role != "AR Master") {
      if (job.requesterEmployeeId != req.user.employeeId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (job.uploadItems.length > fileIndex) {
      job.uploadItems.splice(fileIndex, 1);
    }

    const updatedJob = await job.save();
    return res.json({
      status: "success",
      data: updatedJob._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyTaxID = async (req, res) => {
  try {
    const query = {
      TaxNo3: req?.params?.taxId,
      CompanyCode: req?.params?.companyCode,
      BranchCode: req?.params?.branchCode,
    };
    const job = await Customer.find(query);
    if (job?.length > 0) {
      return res.status(400).json({ message: "Duplicate Job" });
    }
    return res.status(200).json({
      status: 200,
      message: "No Duplicate Job",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyTaxIDAndBranch = async (req, res) => {
  try {
    const query = {
      TaxNo3: req?.params?.taxId,
      BranchCode: req?.params?.branchCode,
    };
    const job = await Customer.find(query);
    if (job?.length > 0) {
      return res.status(200).json({
        status: "success",
        data: job,
      });
    } else {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllJobList = async (req, res) => {
  let filters = [];
  let filtersQuery = [];
  let find;
  let findQuery;
  let query;
  const userHierarchy = await UserHierarchy.findOne({
    requesterEmployeeId: req.user.employeeId,
  });
  let isRequester = false;
  if (userHierarchy) {
    isRequester = true;
  }
  if (["AR Master", "SUPER ADMIN"].includes(req.user.role)) {
    filters.push({});
  }

  if (req.user.role !== "SUPER ADMIN") {
    const employeeIdFilter = {
      $or: [
        { requesterEmployeeId: req.user.employeeId },
        { pendingEmployeeId: req.user.employeeId },
        { approvedList: req.user.employeeId },
        { approvedListCoApproval: req.user.employeeId },
      ],
    };
    filters.push(employeeIdFilter);

    if (req.user.role === "AR Master") {
      filters.push({ isDraft: false });
    }
  }

  if (req.query.searchText) {
    const searchTextFilter = {
      $or: [
        { taxId: { $regex: req.query.searchText } },
        { jobNumber: { $regex: req.query.searchText } },
        {
          "generalInfomation.originalGeneral.name": {
            $regex: req.query.searchText,
          },
        },
      ],
    };
    filtersQuery.push(searchTextFilter);
  }

  if (req.query.type != "all" && req.query.type != undefined) {
    if (req.query.type == "new") {
      filtersQuery.push({ jobType: "newCustomer" });
    }
    if (req.query.type == "change") {
      filtersQuery.push({ jobType: "changeCustomer" });
    }
  }

  if (req.query.createDate) {
    const startDate = new Date(req.query.createDate);
    startDate.setHours(0, 0, 0, 0);

    // Create a new date object for endDate
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    filtersQuery.push({
      createDate: { $gte: startDate, $lt: endDate },
    });
  }

  if (req.query.company) {
    filtersQuery.push({ "verify.companyCode": req.query.company });
  }

  if (req.query.channel) {
    filtersQuery.push({ "verify.channel": req.query.channel });
  }
  if (req.query.docstatus) {
    switch (req.query.docstatus) {
      case "Pending":
        if (req.user.role === "AR Master") {
          filtersQuery.push({ pendingEmployeeId: "AR Master" });
        } else {
          filtersQuery.push({ pendingEmployeeId: req.user.employeeId });
        }

        filtersQuery.push({ isCompleted: false });
        filtersQuery.push({ isRejected: false });
        filtersQuery.push({ isCancelled: false });
        break;
      case "Approved":
        filtersQuery.push({
          $or: [
            { approvedList: req.user.employeeId },
            { approvedListCoApproval: req.user.employeeId },
          ],
        });
        // filtersQuery.push({ "pendingEmployeeId": "AR Master" });

        break;
      case "Waiting":
        filtersQuery.push({ isPending: true });
        filtersQuery.push({ isCompleted: false });
        filtersQuery.push({ isRejected: false });
        filtersQuery.push({ isCancelled: false });
        break;
      case "Completed":
        filtersQuery.push({ isCompleted: true });
        break;
      case "Rejected":
        if (req.user.role === "AR Master") {
          filtersQuery.push({ isRejected: true });
        } else {
          if (isRequester) {
            filtersQuery.push({ isRejected: true });
          } else {
            filtersQuery.push({ rejectedById: req.user.employeeId });
          }
        }
        break;
      case "Cancelled":
        if (req.user.role === "AR Master") {
          filtersQuery.push({ isCancelled: true });
        } else {
          if (isRequester) {
            filtersQuery.push({ isCancelled: true });
          } else {
            filtersQuery.push({ cancelledById: req.user.employeeId });
          }
        }
        break;
    }
  }

  find = filters.length > 0 ? { $or: filters } : {};
  findQuery = filtersQuery.length > 0 ? { $and: filtersQuery } : {};
  query = {
    $and: [find, findQuery],
  };

  try {
    const allJobs = await Job.find(query).sort({ createDate: -1 });
    // if (!allJobs || allJobs.length === 0) {
    //     return res.status(404).json({ message: 'Job not found' });
    // }
    return res.json(allJobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReport = async (req, res) => {
  try {
    let startDate = new Date(req?.query?.startDate);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(req?.query?.endDate);
    endDate.setHours(23, 59, 59, 999);

    let allJobs = await Job.find({
      // jobNumber: "CC-20240418-1",
      isCompleted: true,
      createDate: { $gte: startDate, $lt: endDate },
    }).sort({ createDate: -1 });

    if (allJobs?.length > 0) {
      let cloneData = JSON.parse(JSON.stringify(allJobs));
      for (let job of cloneData) {
        let approveSequnceData = [];
        let no = 1;
        if (job?.approveSequnce?.length > 0) {
          for (let employeeId of job?.approveSequnce) {
            let user;
            let status;
            let datetime = "";
            let userType;

            if (job?.doaUserInJob.includes(employeeId)) {
              user = await UserDOA.findOne({ employeeId: employeeId });
              if (user) {
                status = job?.status[employeeId];
                datetime = job?.approvedDatetime[employeeId] || "";
                userType = "DOA";
              }
            } else {
              user = await User.findOne({ employeeId: employeeId });
              status = job?.status[employeeId];
              datetime = job?.approvedDatetime[employeeId] || "";
              userType = user?.userType;
            }

            if (status === "Rejected") {
              datetime = job?.rejectedDate;
            }

            if (status === "Cancelled") {
              datetime = job?.cancelledDate;
            }

            if (user) {
              approveSequnceData.push({
                no: no++,
                role: user.role,
                name: user.name,
                userType: userType,
                status: status,
                datetime: datetime,
              });
            }
          }
        }

        let userArMaster;
        if (job.isArMasterApproved) {
          userArMaster = await UserDOA.findOne({ employeeId: job.arMasterId });
        } else {
          userArMaster = {
            name: "AR Master",
          };
        }

        let arMasterStatus = "";

        if (job.isArMasterApproved && job.pendingEmployeeId == "AR Master") {
          arMasterStatus = "Approved";
        } else if (job.isRejected && job.pendingEmployeeId == "AR Master") {
          arMasterStatus = "Rejected";
        } else if (job.isCancelled && job.pendingEmployeeId == "AR Master") {
          arMasterStatus = "Rejected";
        } else {
          arMasterStatus = "Pending";
        }
        let datetime;

        datetime = job.approvedDatetime[userArMaster.employeeId]
          ? job.approvedDatetime[userArMaster.employeeId]
          : "";

        if (arMasterStatus == "Rejected") {
          datetime = job.rejectedDate;
        }

        if (arMasterStatus == "Cancelled") {
          datetime = job.cancelledDate;
        }

        approveSequnceData.push({
          no: no++,
          role: "AR Master",
          name: userArMaster.name, // Add other user properties as needed
          userType: "AR Master",
          status: arMasterStatus,
          datetime: datetime,
        });

        for (const employeeId of job.approveSequnceCoApprove) {
          let user;
          let status;
          let datetime;
          let userType;

          user = await UserDOA.findOne({ employeeId: employeeId });
          if (job.approveSequnceCoApprove.includes(employeeId)) {
            status = job.statusCoApproval[employeeId];
            datetime = job.approvedDatetimeCoApproval[employeeId]
              ? job.approvedDatetimeCoApproval[employeeId]
              : "";
            userType = "Co Approve";
          }

          if (status == "Rejected") {
            datetime = job.rejectedDate;
          }

          if (status == "Cancelled") {
            datetime = job.cancelledDate;
          }

          if (user) {
            approveSequnceData.push({
              no: no++,
              role: user.role,
              name: user.name, // Add other user properties as needed
              userType: userType,
              status: status,
              datetime: datetime,
            });
          }
        }

        job.datastep = approveSequnceData;
      }

      return res.status(200).json({
        status_code: 200,
        data: cloneData,
        message: "success",
      });
    } else {
      return res.status(400).json({
        status_code: 400,
        message: "error",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status_code: 400,
      message: "error",
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.isSave &&
      req.user.role != "AR Master" &&
      req.user.role != "SUPER ADMIN"
    ) {
      if (
        !job.accessList.includes(req.user.employeeId) &&
        !job.accessListCoApproval.includes(req.user.employeeId)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }
    } else {
      if (job.isDraft && !job.isRejected) {
        if (job.requesterEmployeeId !== req.user.employeeId) {
          return res.status(403).json({ message: "Forbidden c" });
        }
      }
    }

    // Initialize an empty object to store approveSequnceData
    const approveSequnceData = [];
    let no = 1;
    if (job.isSave) {
      for (const employeeId of job.approveSequnce) {
        let user;
        let status;
        let datetime = "";
        let userType;

        if (job.doaUserInJob.includes(employeeId)) {
          user = await UserDOA.findOne({ employeeId: employeeId });
          if (user) {
            status = job.status[employeeId];
            datetime = job.approvedDatetime[employeeId]
              ? job.approvedDatetime[employeeId]
              : "";
            userType = "DOA";
          }
        } else {
          user = await User.findOne({ employeeId: employeeId });
          status = job.status[employeeId];
          datetime = job.approvedDatetime[employeeId]
            ? job.approvedDatetime[employeeId]
            : "";
          userType = user?.userType;
        }

        if (status == "Rejected") {
          datetime = job.rejectedDate;
        }

        if (status == "Cancelled") {
          datetime = job.cancelledDate;
        }

        if (user) {
          approveSequnceData.push({
            no: no++,
            role: user.role,
            // level: user.level,
            name: user.name, // Add other user properties as needed
            userType: userType,
            status: status,
            datetime: datetime,
          });
        }
      }

      let userArMaster;
      if (job.isArMasterApproved) {
        userArMaster = await UserDOA.findOne({ employeeId: job.arMasterId });
      } else {
        userArMaster = {
          name: "AR Master",
        };
      }

      let arMasterStatus = "";

      if (job.isArMasterApproved && job.pendingEmployeeId == "AR Master") {
        arMasterStatus = "Approved";
      } else if (job.isRejected && job.pendingEmployeeId == "AR Master") {
        arMasterStatus = "Rejected";
      } else if (job.isCancelled && job.pendingEmployeeId == "AR Master") {
        arMasterStatus = "Rejected";
      } else {
        arMasterStatus = "Pending";
      }
      let datetime;

      datetime = job.approvedDatetime[userArMaster.employeeId]
        ? job.approvedDatetime[userArMaster.employeeId]
        : "";

      if (arMasterStatus == "Rejected") {
        datetime = job.rejectedDate;
      }

      if (arMasterStatus == "Cancelled") {
        datetime = job.cancelledDate;
      }

      approveSequnceData.push({
        no: no++,
        role: "AR Master",
        name: userArMaster.name, // Add other user properties as needed
        userType: "AR Master",
        status: arMasterStatus,
        datetime: datetime,
      });

      for (const employeeId of job.approveSequnceCoApprove) {
        let user;
        let status;
        let datetime;
        let userType;

        user = await UserDOA.findOne({ employeeId: employeeId });
        if (job.approveSequnceCoApprove.includes(employeeId)) {
          status = job.statusCoApproval[employeeId];
          datetime = job.approvedDatetimeCoApproval[employeeId]
            ? job.approvedDatetimeCoApproval[employeeId]
            : "";
          userType = "Co Approve";
        }

        if (status == "Rejected") {
          datetime = job.rejectedDate;
        }

        if (status == "Cancelled") {
          datetime = job.cancelledDate;
        }

        if (user) {
          approveSequnceData.push({
            no: no++,
            role: user.role,
            name: user.name, // Add other user properties as needed
            userType: userType,
            status: status,
            datetime: datetime,
          });
        }
      }
    }
    if (job.jobType !== "changeCustomer") {
      return res.json({
        status: "success",
        data: {
          job,
          approveSequnceData,
        },
      });
    }

    const customer = await Customer.findOne({
      Customer: job.verify.customerId,
      CompanyCode: job.verify.companyCode,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found for change data" });
    }

    return res.json({
      status: "success",
      data: {
        job,
        approveSequnceData,
        customer,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.rejectJob = async (req, res) => {
  const now = new Date();
  try {
    const jobId = req.params.jobId;
    const userId = req.user.employeeId;
    const jobData = req.body.data;
    const jobOriginal = await Job.findById(jobId);
    if (!jobOriginal) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobOriginal.isApproved) {
      return res.status(403).json({ message: "Forbidden Approved" });
    }

    if (jobOriginal.isRejected) {
      return res.status(403).json({ message: "Forbidden Rejected" });
    }

    if (jobOriginal.isCancelled) {
      return res.status(403).json({ message: "Forbidden Cancelled" });
    }

    if (
      req.user.role != "AR Master" &&
      jobOriginal.pendingEmployeeId != "AR Master"
    ) {
      if (
        jobOriginal.pendingEmployeeId != userId ||
        (!jobOriginal.accessList.includes(userId) &&
          !jobOriginal.accessListCoApproval.includes(userId))
      ) {
        return res.status(403).json({ message: "Forbidden a" });
      }
    }

    const userCreator = await User.findOne({
      employeeId: jobOriginal.requesterEmployeeId,
    });

    if (!userCreator) {
      return res.status(404).json({
        message: `Employee ID ${jobOriginal.requesterEmployeeId} was not found in the user table.`,
      });
    }

    const update = {
      $set: {
        isRejected: true,
        rejectedById: userId,
        rejectedDate: now,
        comment: jobData.comment,
        rejectTopics: jobData.rejectTopics,
      },
    };

    // Update the status for the current user using the $set operator
    if (jobOriginal.isArMasterApproved) {
      update.$set[`statusCoApproval.${userId}`] = "Rejected";
      update.$set["isArMasterApproved"] = false;
    } else {
      if (req.user.role == "AR Master") {
        update.$set[`status.${jobOriginal.pendingEmployeeId}`] = "Rejected";
      } else {
        update.$set[`status.${userId}`] = "Rejected";
      }
    }

    update.$set[`status.${jobOriginal.requesterEmployeeId}`] = `Rejected by ${
      req.user.role || req.user.doaTag
    }`;

    if (jobData.comment) {
      jobOriginal.actionLog.push({
        action: "reject",
        from: req.user,
        topic: jobData.rejectTopics,
        date: now,
        comment: jobData.comment,
      });
      update.$set["actionLog"] = jobOriginal.actionLog;
    }

    const job = await Job.findByIdAndUpdate(jobId, update, { new: true });

    // Send an email
    try {
      // Create an email data object here
      const emailData = {
        type: "rejectJob" + jobOriginal.jobType, // Modify this according to your email logic
        userCreator: userCreator,
        userReject: req.user,
        jobData: job,
        email: userCreator.email,
        date: now,
      };
      // Call the send function to send the email

      await sendEmail(emailData);

      // Return a response indicating success
      return res.json({
        status: "success",
        id: job._id,
      });
    } catch (emailError) {
      // Handle the email sending error
      console.error("Error sending reject email:", emailError);
      return res.status(500).json({
        error: "An error occurred while sending the email.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.cancelJob = async (req, res) => {
  const now = new Date();
  try {
    const jobId = req.params.jobId;
    const userId = req.user.employeeId;
    const jobData = req.body.data;
    const jobOriginal = await Job.findById(jobId);
    if (!jobOriginal) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobOriginal.isApproved) {
      return res.status(403).json({ message: "Forbidden Approved" });
    }

    if (jobOriginal.isRejected) {
      return res.status(403).json({ message: "Forbidden Rejected" });
    }

    if (jobOriginal.isCancelled) {
      return res.status(403).json({ message: "Forbidden Cancelled" });
    }

    if (
      req.user.role != "AR Master" &&
      jobOriginal.pendingEmployeeId != "AR Master"
    ) {
      if (
        jobOriginal.pendingEmployeeId != userId ||
        (!jobOriginal.accessList.includes(userId) &&
          !jobOriginal.accessListCoApproval.includes(userId))
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const userCreator = await User.findOne({
      employeeId: jobOriginal.requesterEmployeeId,
    });
    if (!userCreator) {
      return res.status(404).json({ message: "User not found" });
    }

    const update = {
      $set: {
        isCancelled: true,
        isPending: false,
        cancelledById: userId,
        cancelledDate: now,
        comment: jobData.comment,
        rejectTopics: jobData.rejectTopics,
      },
    };

    if (jobOriginal.isArMasterApproved) {
      update.$set[`statusCoApproval.${userId}`] = "Cancelled";
    } else {
      update.$set[`status.${userId}`] = "Cancelled";
    }

    // Update the status for the current user using the $set operator
    update.$set[
      `status.${jobOriginal.requesterEmployeeId}`
    ] = `Cancelled by ${req.user.role}`;

    if (jobData.comment) {
      jobOriginal.actionLog.push({
        action: "Cancel",
        from: req.user,
        topic: jobData.rejectTopics,
        date: now,
        comment: jobData.comment,
      });
      update.$set["actionLog"] = jobOriginal.actionLog;
    }

    const job = await Job.findByIdAndUpdate(jobId, update, { new: true });

    // Send an email
    try {
      // Create an email data object here
      const emailData = {
        type: "cancelJob" + jobOriginal.jobType, // Modify this according to your email logic
        userCreator: userCreator,
        userCancel: req.user,
        jobData: job,
        email: userCreator.email,
        date: now,
      };
      // Call the send function to send the email
      await sendEmail(emailData);

      // Return a response indicating success
      return res.json({
        status: "success",
        id: job._id,
      });
    } catch (emailError) {
      // Handle the email sending error
      console.error("Error sending cancel email:", emailError);
      return res.status(500).json({
        error: "An error occurred while sending the email.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.approveJob = async (req, res) => {
  const now = new Date();
  try {
    const jobId = req.params.jobId;
    const userId = req.user.employeeId;
    const jobData = req.body.data;

    const jobOriginal = await Job.findById(jobId);

    if (jobOriginal.isApproved) {
      return res.status(403).json({ message: "Forbidden Approved" });
    }

    if (jobOriginal.isRejected) {
      return res.status(403).json({ message: "Forbidden Rejected" });
    }

    if (jobOriginal.isCancelled) {
      return res.status(403).json({ message: "Forbidden Cancelled" });
    }

    if (!jobOriginal) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobOriginal.pendingEmployeeId != "AR Master") {
      if (
        jobOriginal.pendingEmployeeId != userId ||
        (!jobOriginal.accessList.includes(userId) &&
          !jobOriginal.accessListCoApproval.includes(userId))
      ) {
        return res.status(403).json({ message: "Forbidde User" });
      }
    } else {
      if (req.user.role != "AR Master") {
        return res.status(403).json({ message: "Forbidde Role" });
      }
    }

    if (jobOriginal.pendingEmployeeId == "AR Master") {
      if (jobData.isSkipCoApprover == undefined) {
        return res.status(404).json({ message: "data not found" });
      }
    }

    const userCreator = await User.findOne({
      employeeId: jobOriginal.requesterEmployeeId,
    });
    if (!userCreator) {
      return res.status(404).json({ message: "User not found" });
    }
    const originalPending = jobOriginal.pendingEmployeeId;
    const update = {
      $set: {},
    };

    let userNext;
    let orderNumber;
    let isCoApproval = false;
    let shouldSendEmailRPA = false;

    if (
      req.user.role == "AR Master" &&
      jobOriginal.pendingEmployeeId == "AR Master"
    ) {
      if (jobData.isSkipCoApprover) {
        if (jobOriginal.jobType == "newCustomer") {
          update.$set["isSkipCoApprover"] = true;
          update.$set["isWatingCustomerId"] = true;
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Waiting Customer Id`;
          update.$set["pendingEmployeeId"] = "AR Master";
          update.$set[`status.${originalPending}`] = `Pending Customer Id`;
          update.$set["approveFinishDate"] = now;
          update.$set["isApproved"] = true;
          shouldSendEmailRPA = true;
        } else {
          update.$set["isCompleted"] = true;
          update.$set["isPending"] = false;
          update.$set["completedDate"] = now;
          update.$set["isSkipCoApprover"] = true;
          // update.$set['isWatingCustomerId'] = true
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Completed`;
          update.$set["pendingEmployeeId"] = "AR Master";
          update.$set[`status.${originalPending}`] = `Completed`;
          update.$set["approveFinishDate"] = now;
          update.$set["isApproved"] = true;
        }
      } else {
        update.$set["coApproval"] = jobData.coApproval;
        const tempUserCoApproval = await Promise.all(
          jobData.coApproval.map(async (element) => {
            return await UserDOA.findOne({ doaTag: element });
          })
        );

        tempUserCoApproval.sort(
          (a, b) => a.doaRoleHierarchy - b.doaRoleHierarchy
        );

        const employeeIds = tempUserCoApproval.map((user) => user.employeeId);
        for (const employeeId of employeeIds) {
          update.$set[`statusCoApproval.${employeeId}`] = `Pending Co Approve`;
        }

        //set status to each employeeId in array to pending  update.$set[`status.${employeeId}`] = `Pending`;
        update.$set[`status.${employeeIds[0]}`] = `Pending Co Approve`;

        update.$set["approveSequnceCoApprove"] = employeeIds;
        update.$set["accessListCoApproval"] = employeeIds;

        update.$set[`status.${originalPending}`] = `Approved`;

        userNext = await UserDOA.findOne({ employeeId: employeeIds[0] });
        if (!userNext) {
          return res.status(404).json({ message: "User DOA not found" });
        }
        update.$set[
          `status.${jobOriginal.requesterEmployeeId}`
        ] = `Waiting for ${userNext.doaTag} Co approve`;

        update.$set["pendingEmployeeId"] = employeeIds[0];
      }
      update.$set["arMasterId"] = userId;
      update.$set["isArMasterApproved"] = true;
    } else {
      if (jobOriginal.isArMasterApproved) {
        orderNumber = jobOriginal.orderNumberCoApproval + 1;
        if (jobOriginal.approveSequnceCoApprove.length <= orderNumber) {
          update.$set[`status.${originalPending}`] = `Approved`;
          update.$set["pendingEmployeeId"] = "AR Master";
          update.$set["isWatingCustomerId"] = true;
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Waiting Customer Id`;
          update.$set[`status.AR Master`] = `Pending Customer Id`;
          update.$set[`statusCoApproval.${originalPending}`] = `Approved`;
          update.$set["isApproved"] = true;
          update.$set["approveFinishDate"] = now;
          if (jobOriginal.jobType == "newCustomer") {
            shouldSendEmailRPA = true;
          } else {
            shouldSendEmailRPA = false;
          }
        } else {
          update.$set["orderNumberCoApproval"] = orderNumber;
          jobOriginal.pendingEmployeeId =
            jobOriginal.approveSequnceCoApprove[orderNumber];
          userNext = await UserDOA.findOne({
            employeeId: jobOriginal.pendingEmployeeId,
          });
          if (!userNext) {
            return res.status(404).json({ message: "User not found" });
          }
          update.$set[`status.${originalPending}`] = `Approved`;
          update.$set[`statusCoApproval.${originalPending}`] = `Approved`;
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Waiting for ${userNext.doaTag} Co approve`;
          update.$set[`status.${userNext.employeeId}`] = `Pending Co Approve`;
          update.$set["pendingEmployeeId"] = jobOriginal.pendingEmployeeId;
        }
        isCoApproval = true;
      } else {
        orderNumber = jobOriginal.orderNumber + 1;
        if (jobOriginal.approveSequnce.length <= orderNumber) {
          jobOriginal.pendingEmployeeId = "AR Master";
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Pending for AR Master approve`;
          update.$set[`status.${originalPending}`] = `Approved`;
          update.$set["pendingEmployeeId"] = jobOriginal.pendingEmployeeId;
          userNext = await UserDOA.findOne({ isARMasterSendMail: true });
          if (!userNext) {
            return res.status(404).json({ message: "AR Master not found" });
          }
        } else {
          let nextUser;
          update.$set["orderNumber"] = orderNumber;
          jobOriginal.pendingEmployeeId =
            jobOriginal.approveSequnce[orderNumber];

          if (
            jobOriginal.doaUserInJob.includes(jobOriginal.pendingEmployeeId)
          ) {
            userNext = await UserDOA.findOne({
              employeeId: jobOriginal.pendingEmployeeId,
            });
            if (!userNext) {
              return res.status(404).json({ message: "User DOA not found" });
            }
            nextUser = userNext.doaTag;
          } else {
            userNext = await User.findOne({
              employeeId: jobOriginal.pendingEmployeeId,
            });
            if (!userNext) {
              return res.status(404).json({ message: "User not found" });
            }
            nextUser = userNext.userType + " " + userNext.role;
          }
          update.$set[`status.${originalPending}`] = `Approved`;
          update.$set[
            `status.${jobOriginal.requesterEmployeeId}`
          ] = `Waiting for ${nextUser} approve`;
          update.$set["pendingEmployeeId"] = jobOriginal.pendingEmployeeId;
        }
      }
    }

    if (jobData) {
      update.$set = { ...update.$set, ...jobData };
    }

    if (jobData.comment) {
      jobOriginal.actionLog.push({
        action: "approve",
        from: req.user,
        date: now,
        comment: jobData.comment,
      });
      update.$set["actionLog"] = jobOriginal.actionLog;
    }

    // Add the update to approvedDatetime
    const approvedDatetimeUpdate = {};
    approvedDatetimeUpdate[userId] = now;

    const approveUserDataLog = {};
    req.user.datetimeApprove = now;
    approveUserDataLog[userId] = req.user;

    if (isCoApproval) {
      update.$set["approveUserDataLogCoApproval"] = {
        ...jobOriginal.approveUserDataLogCoApproval,
        ...approveUserDataLog,
      };
      update.$set["approvedDatetimeCoApproval"] = {
        ...jobOriginal.approvedDatetimeCoApproval,
        ...approvedDatetimeUpdate,
      };
      update.$set["approvedListCoApproval"] =
        jobOriginal.approvedListCoApproval.concat(userId);
    } else {
      update.$set["approveUserDataLog"] = {
        ...jobOriginal.approveUserDataLog,
        ...approveUserDataLog,
      };
      update.$set["approvedDatetime"] = {
        ...jobOriginal.approvedDatetime,
        ...approvedDatetimeUpdate,
      };
      update.$set["approvedList"] = jobOriginal.approvedList.concat(userId);
    }

    const job = await Job.findByIdAndUpdate(jobId, update, { new: true });

    // Send an email
    try {
      // Create an email data object here
      const emailData = {
        type: "approveJob" + jobOriginal.jobType, // Modify this according to your email logic
        userCreator: userCreator,
        userApprove: req.user,
        jobData: job,
        email: userCreator.email,
        date: now,
      };
      // Call the send function to send the email

      const emailDataNew = {
        type: "approveJob" + jobOriginal.jobType, // Modify this according to your email logic
        userCreator: userCreator,
        userApprove: req.user,
        jobData: job,
        // email: "noreply_nintexrpa@toagroup.com",
        email: process.env.MAIL_RPA, //"nutcha_s@toagroup.com",
        date: now,
      };

      await sendEmail(emailData);

      if (shouldSendEmailRPA === true) {
        await sendEmail(emailDataNew);
      }
    } catch (emailError) {
      // Handle the email sending error
      console.error("Error sending approve email:", emailError);
      return res.status(500).json({
        error: "An error occurred while sending the email.",
      });
    }
    // Send an email

    if (userNext) {
      try {
        const emailDataNextApprove = {
          type: "pendingJob" + jobOriginal.jobType, // Modify this according to your email logic
          userNext: userNext,
          jobData: job,
          email: userNext.email,
        };

        const emailDataNextApproveNew = {
          type: "pendingJob" + jobOriginal.jobType, // Modify this according to your email logic
          userNext: userNext,
          jobData: job,
          // email: "noreply_nintexrpa@toagroup.com",
          email: process.env.MAIL_RPA, //"nutcha_s@toagroup.com",
        };

        // Call the send function to send the email
        await sendEmail(emailDataNextApprove);

        if (shouldSendEmailRPA === true) {
          await sendEmail(emailDataNextApproveNew);
        }

        // Return a response indicating success
        return res.json({
          status: "success",
          id: job._id,
        });
      } catch (emailError) {
        // Handle the email sending error
        console.error("Error sending next approve email:", emailError);
        return res.status(500).json({
          error: "An error occurred while sending the email.",
        });
      }
    } else {
      return res.json({
        status: "success",
        id: job._id,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.arSubmitUpdateJobById = async (req, res) => {
  const now = new Date();
  try {
    const jobId = req.params.jobId;
    const userId = req.user.employeeId;
    const jobData = req.body.data;
    const jobOriginal = await Job.findById(jobId);

    if (!jobOriginal) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      jobOriginal.pendingEmployeeId != userId &&
      req.user.role != "AR Master" &&
      req.user.role != "SUPER ADMIN"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !jobOriginal.accessList.includes(userId) &&
      req.user.role != "AR Master" &&
      req.user.role != "SUPER ADMIN"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role != "AR Master" && req.user.role != "SUPER ADMIN") {
      jobData.arUpdateDate = now;

      jobData.generalInfomation = {
        ...jobOriginal.generalInfomation,
        ...jobData.generalInfomation,
      };
    } else {
      jobData.arMasterUpdatedate = now;
    }

    const job = await Job.findByIdAndUpdate(jobId, jobData, { new: true });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({
      status: "success",
      data: job._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.filedownload = async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = `public/uploads/${filename}`;
    res.download(file);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.submitFirstDraftJob = async (req, res) => {
  return createJobWithFiles(req, res, true, false, false, true, true, false);
};
exports.submitFirstDraftJobChange = async (req, res, customer) => {
  return createJobWithFiles(req, res, true, false, false, true, true, customer);
};

exports.submitDraftJob = async (req, res) => {
  return createJobWithFiles(req, res, false, false, false, true, false, false);
};

exports.submitDraftJobChange = async (req, res) => {
  return createJobWithFiles(req, res, false, false, false, true, false, false);
};

exports.submitSaveJob = async (req, res) => {
  return createJobWithFiles(req, res, false, true, false, false, false, false);
};

exports.submitAgianDraftJob = async (req, res) => {
  return createJobWithFiles(req, res, false, false, true, true, false, false);
};

exports.submitAgianSaveJob = async (req, res) => {
  return createJobWithFiles(req, res, false, true, true, false, false, false);
};

async function createJobWithFiles(
  req,
  res,
  isCreating,
  isSave,
  isAgianSave,
  isDraft,
  isFirstDraft,
  customer
) {
  try {
    const now = new Date();
    const company = {
      1100: "TOA PAINT",
      1200: "CAPTAIN",
      5100: "TOA PAINT VIETNAM",
    };

    const channel = {
      10: "Traditional",
      20: "Modern Trade",
      30: "Project Sales",
      40: "Export",
      50: "B2B",
      60: "Others",
    };
    const doaRoleHierarchy = {
      "Dept Head": 1,
      SGH: 2,
      "Div Head": 3,
      SVP: 4,
      CFO: 5,
      FAD: 5,
      CEO: 6,
    };

    let jobData;
    if (!isCreating) {
      jobData = JSON.parse(req.body.data);
    } else {
      if (customer) {
        let taxId = customer.customer["TaxNo3"] || customer.customer["TaxNo1"];
        jobData = {
          jobType: "changeCustomer",
          verify: req.body,
          taxId: taxId,
          companyName: company[req.user.companyCode],
          channelName: channel[customer.customer["DistChan"]],
        };
      } else {
        jobData = req.body;
      }
    }
    jobData.requesterEmployeeId = req.user.employeeId;

    if (!jobData) {
      return res.status(400).json({ message: "Bad request" });
    }

    let job;

    let uploadItems;

    let jobOriginal;
    if (req.params?.jobId) {
      jobOriginal = await Job.findById(req.params.jobId);
    }

    if (isFirstDraft) {
      jobData.uploadItems = [];
    } else {
      if (jobOriginal?.uploadItems?.length > 1) {
        jobData.uploadItems = [jobOriginal.uploadItems[0]];
      } else {
        jobData.uploadItems = jobOriginal.uploadItems;
      }
    }

    if (req.files && req.files.length > 0) {
      jobData.uploadItems = [
        {
          originalname: req.files[0]?.originalname,
          filename: req.files[0]?.filename,
          url: `${process.env.SELF_URL}${process.env.URL_API_VER}${process.env.DOWNLOAD_URL}${req.files[0]?.filename}`,
        },
      ];
    }

    if (isSave) {
      const userHierarchy = await UserHierarchy.findOne({
        requesterEmployeeId: req.user.employeeId,
        salesDistrict:
          jobData.saleInfomation?.salesDistrict ||
          jobOriginal.verify?.salesDistrict ||
          jobData.verify?.salesDistrict,
      });

      if (!userHierarchy) {
        return res.status(404).json({
          message: "User Hierarchy not found",
          data: {
            requesterEmployeeId: req.user.employeeId,
            salesDistrict:
              jobData.saleInfomation?.salesDistrict ||
              jobOriginal.verify?.salesDistrict ||
              jobData.verify?.salesDistrict,
          },
        });
      }

      let firstCharNumber = "";

      const doaCondition = require("../datasets/doaCondition");

      var approverDoa = [];
      let checkDoaCondition;
      let needDOA = false;
      let DOACon = ["creditLimit", "priceList", "paymentTerm"];

      if (jobOriginal.jobType == "newCustomer") {
        checkDoaCondition = ["creditLimit", "priceList", "paymentTerm"];
        needDOA = true;
      } else if (jobOriginal.jobType == "changeCustomer") {
        checkDoaCondition = [];
        jobData.jobChange.forEach((element, index) => {
          if (DOACon.includes(element)) {
            needDOA = true;
            checkDoaCondition.push(element);
          }
        });
      }
      if (needDOA) {
        const doa =
          doaCondition.jobType[jobOriginal.jobType].companyCode[
            req.user.companyCode
          ].channel[jobOriginal.verify.channel || jobData.verify.channel];
        approverDoa = approverDoa.concat(doa);

        if (req?.user?.companyCode === "1100") {
          if (jobOriginal.jobType == "newCustomer") {
            if (
              (jobData?.saleInfomation?.priceList === "S" ||
                jobData?.saleInfomation?.priceList === "M" ||
                jobData?.saleInfomation?.priceList === "L") &&
              (jobOriginal?.verify?.channel === "20" ||
                jobOriginal?.verify?.channel === "30" ||
                jobOriginal?.verify?.channel === "40" ||
                jobOriginal?.verify?.channel === "50" ||
                jobOriginal?.verify?.channel === "60")
            ) {
              approverDoa = [];
            }
          }
        } else if (req?.user?.companyCode === "1200") {
          if (jobOriginal.jobType == "newCustomer") {
            if (
              jobData?.saleInfomation?.priceList === "S" ||
              jobData?.saleInfomation?.priceList === "M" ||
              jobData?.saleInfomation?.priceList === "L" ||
              jobData?.saleInfomation?.paymentTerm === "CCOD" ||
              jobData?.saleInfomation?.paymentTerm === "CCDD"
            ) {
              if (
                jobOriginal?.verify?.channel === "10" ||
                jobOriginal?.verify?.channel === "20"
              ) {
                approverDoa = ["SGH"];
              } else if (
                jobOriginal?.verify?.channel === "30" ||
                jobOriginal?.verify?.channel === "40" ||
                jobOriginal?.verify?.channel === "50" ||
                jobOriginal?.verify?.channel === "60"
              ) {
                approverDoa = [];
              }
            }
          } else if (jobOriginal.jobType == "changeCustomer") {
            if (
              jobData?.saleInfomation?.priceList === "S" ||
              jobData?.saleInfomation?.priceList === "M" ||
              jobData?.saleInfomation?.priceList === "L"
            ) {
              if (
                jobOriginal?.verify?.channel === "10" ||
                jobOriginal?.verify?.channel === "20"
              ) {
                approverDoa = ["SGH"];
              } else if (
                jobOriginal?.verify?.channel === "30" ||
                jobOriginal?.verify?.channel === "40" ||
                jobOriginal?.verify?.channel === "50" ||
                jobOriginal?.verify?.channel === "60"
              ) {
                approverDoa = [];
              }
            }
          }
        }

        let approveMultipleDoaPosition;
        const doaConditionResult =
          doaCondition.jobType[jobOriginal.jobType].companyCode[
            req.user.companyCode
          ].condition;

        //Credit Limit
        if (
          doaConditionResult.creditLimit &&
          checkDoaCondition.includes("creditLimit")
        ) {
          if (doaConditionResult.creditLimit.step == "multipleStep") {
            for (
              let i = 0;
              i < doaConditionResult.creditLimit.condition.length;
              i++
            ) {
              if (
                doaConditionResult.creditLimit.condition[i] == "lessThanOrEqual"
              ) {
                if (
                  parseInt(jobData.saleInfomation.creditLimit) <=
                  doaConditionResult.creditLimit.value[i]
                ) {
                  approveMultipleDoaPosition = i;
                }
              }
              if (doaConditionResult.creditLimit.condition[i] == "moreThan") {
                if (
                  parseInt(jobData.saleInfomation.creditLimit) >
                  doaConditionResult.creditLimit.value[i]
                ) {
                  approveMultipleDoaPosition = i;
                }
              }
            }

            for (
              let j = 0;
              j < doaConditionResult.creditLimit.condition.length;
              j++
            ) {
              if (j <= approveMultipleDoaPosition) {
                approverDoa.push(doaConditionResult.creditLimit.approval[j]);
              }
            }
          }

          if (doaConditionResult.creditLimit.step == "onlyOne") {
            if (doaConditionResult.creditLimit.condition == "lessThanOrEqual") {
              if (
                parseInt(jobData.saleInfomation.creditLimit) <=
                doaConditionResult.creditLimit.value
              ) {
                approverDoa.push(doaConditionResult.creditLimit.approval);
              }
              if (doaConditionResult.creditLimit.needCoApprover) {
                approverDoa.push(doaConditionResult.creditLimit.coApprover);
              }
            }

            if (doaConditionResult.creditLimit.condition == "moreThan") {
              if (
                parseInt(jobData.saleInfomation.creditLimit) >
                doaConditionResult.creditLimit.value
              ) {
                approverDoa.push(doaConditionResult.creditLimit.approval);
              }
              if (doaConditionResult.creditLimit.needCoApprover) {
                approverDoa.push(doaConditionResult.creditLimit.coApprover);
              }
            }
          }
        }
        //End of Credit Limit

        //Price list
        if (
          doaConditionResult.priceList &&
          checkDoaCondition.includes("priceList")
        ) {
          if (doaConditionResult.priceList.step == "onlyOne") {
            if (
              doaConditionResult.priceList.value ==
              jobData.saleInfomation.priceList
            ) {
              approverDoa.push(doaConditionResult.priceList.approval);
              if (doaConditionResult.priceList.needCoApprover) {
                approverDoa.push(doaConditionResult.priceList.coApprover);
              }
            }
          }
        }
        //End of Price list

        if (
          doaConditionResult.paymentTerm &&
          checkDoaCondition.includes("paymentTerm")
        ) {
          if (req.user.companyCode === 1100) {
            const paymentTerm = await DataPaymentTerm.findOne({
              PaymentTerm: jobData.saleInfomation.paymentTerm,
            });
            if (!paymentTerm) {
              return res
                .status(404)
                .json({ message: "Payment Term not found" });
            }
            if (doaConditionResult.paymentTerm.value == paymentTerm.DOA) {
              approverDoa.push(doaConditionResult.paymentTerm.approval);
              if (doaConditionResult.paymentTerm.needCoApprover) {
                approverDoa.push(doaConditionResult.paymentTerm.coApprover);
              }
            }
          } else if (req.user.companyCode === 1200) {
            const paymentTerm = await DataPaymentTermCaptain.findOne({
              PaymentTerm: jobData.saleInfomation.paymentTerm,
            });
            if (!paymentTerm) {
              return res
                .status(404)
                .json({ message: "Payment Term not found" });
            }
            if (doaConditionResult.paymentTerm.value == paymentTerm.DOA) {
              approverDoa.push(doaConditionResult.paymentTerm.approval);
              if (doaConditionResult.paymentTerm.needCoApprover) {
                approverDoa.push(doaConditionResult.paymentTerm.coApprover);
              }
            }
          } else if (req.user.companyCode === 5100) {
            const paymentTerm = await DataPaymentTermVietnam.findOne({
              PaymentTerm: jobData.saleInfomation.paymentTerm,
            });
            if (!paymentTerm) {
              return res
                .status(404)
                .json({ message: "Payment Term not found" });
            }
            if (doaConditionResult.paymentTerm.value == paymentTerm.DOA) {
              approverDoa.push(doaConditionResult.paymentTerm.approval);
              if (doaConditionResult.paymentTerm.needCoApprover) {
                approverDoa.push(doaConditionResult.paymentTerm.coApprover);
              }
            }
          }
        }

        const uniqueApprovers = new Set(approverDoa);
        const uniqueApproversArray = [...uniqueApprovers];

        // Sort the `uniqueApproversArray` array based on the `doaRoleHierarchy` object
        uniqueApproversArray.sort(
          (a, b) => doaRoleHierarchy[a] - doaRoleHierarchy[b]
        );
        if (!uniqueApproversArray) {
          return res.status(404).json({
            message: "Approver not found",
            uniqueApproversArray,
          });
        }
        /*
        const doaEmployeeIds = await Promise.all(
          uniqueApproversArray.map(async (approver, index) => {
            let doaUserFilter;
            if (approver == "CEO" || approver == "CFO") {
              doaUserFilter = { doaTag: approver };
            } else {
              doaUserFilter = { username: jobData[approver] };
            }
            const doaUser = await UserDOA.findOne(doaUserFilter);
            if (!doaUser) {
              return res.status(404).json({
                message: "User DOA not found",
                jobData,
                approver,
                doaUserFilter,
                uniqueApproversArray,
              });
            }
            return doaUser.employeeId;
          })
        );
        jobData.doaUserInJob = doaEmployeeIds;
        jobData.approveSequnce = [];
        if (doaEmployeeIds) {
          jobData.approveSequnce =
            jobData.approveSequnce.concat(doaEmployeeIds);
        }
      } else {
        jobData.approveSequnce = [];
      }
      */
        /******* */
        const doaEmployeeIds = [];

        for (const approver of uniqueApproversArray) {
          let doaUserFilter;
          if (approver === "CEO" || approver === "CFO") {
            doaUserFilter = { doaTag: approver };
          } else {
            doaUserFilter = { username: jobData[approver] };
          }

          const doaUser = await UserDOA.findOne(doaUserFilter);

          if (!doaUser) {
            // หยุด loop และส่ง response ออกทันที
            return res.status(404).json({
              message: "User DOA not found",
              jobData,
              approver,
              doaUserFilter,
              uniqueApproversArray,
            });
          }

          doaEmployeeIds.push(doaUser.employeeId);
        }

        jobData.doaUserInJob = doaEmployeeIds;
        jobData.approveSequnce = [];
        if (doaEmployeeIds) {
          jobData.approveSequnce =
            jobData.approveSequnce.concat(doaEmployeeIds);
        }

        /******* */

        let userHierarchyDataSet = [];
        if (userHierarchy.approverEmployeeId) {
          userHierarchyDataSet.push(userHierarchy.approverEmployeeId);
        }
        if (userHierarchy.approverEmployeeIdSecond) {
          userHierarchyDataSet.push(userHierarchy.approverEmployeeIdSecond);
        }

        //connect userHierarchy approval first and second and jobData.approveSequnce
        jobData.approveSequnce = Array.from(
          new Set(userHierarchyDataSet.concat(jobData.approveSequnce))
        );

        //AR push to approveSequnce
        jobData.approveSequnce.push(userHierarchy.reviewerEmployeeId);
        jobData.approveSequnce.push(userHierarchy.acknowledgeEmployeeId);
        //End AR push to approveSequnce

        //access list
        jobData.accessList = jobData.approveSequnce.slice(); // Make accessList equal to approveSequnce
        jobData.accessList.push(req.user.employeeId); // Push 111 inside accessList
        //End access list

        if (!isAgianSave && jobOriginal.jobNumber === undefined) {
          //Generate jobNumber
          if (jobOriginal.jobType == "newCustomer") {
            firstCharNumber = "CC";
          } else {
            firstCharNumber = "CH";
          }
          let runningNumber = 0;
          // Current date in YYYYmmdd format

          const currentDate = now.toISOString().slice(0, 10).replace(/-/g, "");

          const jobs = await Job.countDocuments({
            jobNumber: { $regex: `${firstCharNumber}-${currentDate}` },
            jobType: jobOriginal.jobType,
          });

          if (jobs > 0) {
            runningNumber = `${firstCharNumber}-${currentDate}-${JSON.stringify(
              parseInt(jobs) + 1
            )}`;
          } else {
            // No previous jobs found, start with running number 1
            runningNumber = `${firstCharNumber}-${currentDate}-1`;
          }

          // Construct the jobNumber with the updated running number and timestamp
          jobData.jobNumber = runningNumber;

          //End Generate jobNumber
        } else {
          jobData.jobNumber = jobOriginal.jobNumber;
        }

        //Set jobStatus
        userNext = await User.findOne({
          employeeId: jobData.approveSequnce[0],
        });
        let statusTextForRequester = `Waiting for ${userNext.userType} ${userNext.role} approve`;
        //End Set jobStatus

        // Set approval status each key is employeeId and value is status pending
        jobData.status = {};
        jobData.statusCoApproval = {};
        jobData.status = jobData.accessList.map((item) => ({
          [item]:
            req.user.employeeId === item ? statusTextForRequester : "Pending",
        }));

        jobData.status = Object.assign({}, ...jobData.status);
        jobData.pendingEmployeeId = jobData.approveSequnce[0];
        jobData.isPending = true;
        jobData.isRejected = false;
        jobData.rejectedById = "";
        jobData.orderNumber = 0;

        jobData.isDraft = false;
        jobData.isSave = true;
        jobData.saveDate = now;
        jobData.lastDraftDate = now;

        jobData.coApproval = [];
        jobData.isSkipCoApprover = false;
        jobData.isArMasterApproved = false;
        jobData.isWatingCustomerId = false;
        jobData.orderNumberCoApproval = 0;
        jobData.isApproved = false;

        jobData.approveUserDataLogCoApproval = {};
        jobData.approvedDatetimeCoApproval = {};
        jobData.approveUserDataLog = {};
        jobData.approvedDatetime = {};

        jobData.approvedListCoApproval = [];
        jobData.approvedList = [];
        jobData.approveSequnceCoApprove = [];
        jobData.arMasterId = "";

        jobData.requesterUser = req.user;
      } else {
        if (!isAgianSave) {
          jobData.isDraft = true;
          jobData.isSave = false;
          jobData.lastDraftDate = now;
        }
      }

      if (isCreating) {
        jobData.companyName = company[req.user.companyCode];
        jobData.channelName = jobData.channelName
          ? jobData.channelName
          : channel[jobData.verify.channel || req.body.channel];
        job = await Job.create(jobData);
      } else {
        job = await Job.findByIdAndUpdate(req.params.jobId, jobData, {
          new: true,
        });
      }

      if (isSave || isAgianSave) {
        // Send an email
        try {
          // Create an email data object here
          const emailData = {
            type: "pendingJob" + jobOriginal.jobType, // Modify this according to your email logic
            userNext: userNext, //Data for template
            jobData: job, //Data for template
            email: userNext.email,
          };
          // console.log(emailData)
          // Call the send function to send the email
          await sendEmail(emailData);

          // Return a response indicating success
          if (
            jobOriginal?.jobType == "changeCustomer" ||
            jobData.jobType == "changeCustomer"
          ) {
            return res.json({
              status: "success",
              id: job._id,
              jobData: job,
              // , ...customer
            });
          } else {
            return res.json({
              status: "success",
              id: job._id,
            });
          }
        } catch (emailError) {
          // Handle the email sending error
          console.error("Error sending email:", emailError);
          return res.status(500).json({
            error: "An error occurred while sending the email.",
          });
        }
      }

      if (customer) {
        return res.json({
          status: "success",
          id: job._id,
          jobData: jobData,
          ...customer,
        });
      } else {
        if (
          isDraft &&
          (jobOriginal?.jobType == "changeCustomer" ||
            jobData.jobType == "changeCustomer")
        ) {
          const customerResult = await Customer.findOne({
            Customer: jobData.verify.customerId,
            CompanyCode: jobData?.verify?.companyCode,
          });
          if (!customerResult) {
            return res
              .status(404)
              .json({ error: "Customer not found for change data" });
          }
          return res.json({
            status: "success",
            id: job._id,
            customerResult,
            jobData,
          });
        } else {
          return res.json({
            status: "success",
            id: job._id,
          });
        }
      }
    }
  } catch (error) {
    console.error(
      `Error ${
        isCreating ? "creating" : `updating ${req.params?.jobId}`
      } draft job:`,
      error
    );
    return res.status(500).json({
      error: `An error occurred while ${
        isCreating ? "creating" : "updating"
      } the job draft.`,
    });
  }
}

exports.submitUpdateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobData = req.body.data;
    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.billingAddress = jobData?.billingAddress;
    job.generalInfomation = jobData?.generalInfomation;
    job.jobChange = jobData?.jobChange;
    job.saleInfomation = jobData?.saleInfomation;
    job.verify = jobData?.verify;

    await job.save();

    return res.status(200).json({
      message: "Update Success.",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.submitCloseJob = async (req, res) => {
  try {
    const now = new Date();
    const jobId = req.params.jobId;
    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.isCompleted = true;
    job.isPending = false;
    job.isWatingCustomerId = false;
    job.status[job?.requesterEmployeeId] = "Completed";
    job.status["AR Master"] = "Completed";
    job.actionLog.push({
      action: "Completed",
      from: req.user,
      date: now,
      comment: "AR Master Close Work Sheet",
    });
    job.markModified("status");
    await job.save();

    return res.status(200).json({
      message: "Update Success.",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

exports.exportExcelJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    let name = "";
    if (job.jobType == "newCustomer") {
      name = job.verify?.taxId;
    } else {
      name = job.verify.customerId;
    }
    const exportPath = `export/${name}`;
    const zipPath = `zip/`;
    await createExportDirectory(exportPath);

    console.log("job.verify", job.verify);
    console.log("job.verify.customerId", job.verify.customerId);

    if (job.jobType == "newCustomer") {
      await processTemplate(
        1,
        job,
        exportPath,
        "Create New General & Company View"
      );
      await processTemplate(2, job, exportPath, "Create New Sale View");
      await processTemplate(3, job, exportPath, "Partner Function");
      await processTemplate(4, job, exportPath, "Credit Limit");
      await processTemplate(5, job, exportPath, "Create Contact Person");
      if (job.billingAddress?.billingAddressChoose != "sameAddress") {
        await processTemplate(
          6,
          job,
          exportPath,
          "Create Correspondence Recipient"
        );
      }
    } else {
      if (
        job.jobChange.includes("name") ||
        job.jobChange.includes("telephoneNo") ||
        job.jobChange.includes("email") ||
        job.jobChange.includes("paymentTerm") ||
        job.jobChange.includes("address")
      ) {
        await processTemplate(
          1,
          job,
          exportPath,
          "Create New General & Company View"
        );
      }
      if (
        job.jobChange.includes("priceList") ||
        job.jobChange.includes("paymentTerm")
      ) {
        await processTemplate(2, job, exportPath, "Create New Sale View");
      }
      if (job.jobChange.includes("creditLimit")) {
        await processTemplate(4, job, exportPath, "Credit Limit");
      }
      if (job.jobChange.includes("billingAddress")) {
        await processTemplate(
          6,
          job,
          exportPath,
          "Create Correspondence Recipient"
        );
      }
    }

    const zipFileName = `${name}.zip`;
    const zipFilePath = path.join(__dirname, "..", zipPath, zipFileName);
    // Check if the file exists
    await zipExportDirectory(exportPath, zipFilePath);

    if (!fs.existsSync(zipFilePath)) {
      console.error("File not found:", zipFilePath);
      return res.status(404).json({ message: "File not found" });
    }

    // Set a longer timeout (e.g., 5 minutes)
    req.setTimeout(300000); // 5 minutes in milliseconds

    // Pipe the file to the response for download
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error("Error downloading zip file:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        // Check if the client has disconnected before cleaning up
        if (!res.headersSent) {
          // Clean up: Remove the zip file after it's downloaded
          fs.unlink(zipFilePath, (unlinkError) => {
            if (unlinkError) {
              console.error("Error deleting zip file:", unlinkError);
            }
          });
        }
      }
    });

    // return res.json({
    //     message: 'Success'
    // });
  } catch (error) {
    console.error("Error exporting Excel:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function createExportDirectory(exportPath) {
  const directoryPath = path.join(__dirname, "..", exportPath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

async function processTemplate(templateNumber, job, exportPath, templateName) {
  const templateFilePath = path.join(
    __dirname,
    `../template/${templateNumber}.xlsx`
  );
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templateFilePath);
  const worksheet = workbook.getWorksheet(1);
  const rowNumber = "10";
  if (templateNumber == 1 && job.jobType == "changeCustomer") {
    worksheet.getCell(`B${rowNumber}`).value = "FLCU00";
    worksheet.getCell(`C${rowNumber}`).value = job.verify.customerId;
    worksheet.getCell(`D${rowNumber}`).value = "BP11";
    worksheet.getCell(`E${rowNumber}`).value = "2";

    worksheet.getCell(`AT${rowNumber}`).value = "X";
    worksheet.getCell(`BU${rowNumber}`).value = "Z001";
    worksheet.getCell(`EI${rowNumber}`).value = "02";
    worksheet.getCell(`EL${rowNumber}`).value = "X";
    worksheet.getCell(`EM${rowNumber}`).value = job.verify.companyCode;
    worksheet.getCell(`EO${rowNumber}`).value = "009";
    worksheet.getCell(`EP${rowNumber}`).value = "R1";
    worksheet.getCell(`ES${rowNumber}`).value = job.verify.companyCode;
    worksheet.getCell(`ET${rowNumber}`).value = "X";

    if (job.jobChange.includes("name")) {
      worksheet.getCell(`H${rowNumber}`).value =
        job.generalInfomation.originalGeneral.name[0];
      worksheet.getCell(`I${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[1];
      worksheet.getCell(`J${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[2];
      worksheet.getCell(`K${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[3];

      worksheet.getCell(`AX${rowNumber}`).value =
        job.generalInfomation.internationalVersionChoose == "differenceAddress"
          ? job.generalInfomation.internationalGeneral?.name[0]
          : job.generalInfomation.originalGeneral?.name[0];
      worksheet.getCell(`AY${rowNumber}`).value =
        job.generalInfomation.internationalVersionChoose == "differenceAddress"
          ? job.generalInfomation.internationalGeneral?.name[1]
          : job.generalInfomation.originalGeneral?.name[1];
      worksheet.getCell(`AZ${rowNumber}`).value =
        job.generalInfomation.internationalVersionChoose == "differenceAddress"
          ? job.generalInfomation.internationalGeneral?.name[2]
          : job.generalInfomation.originalGeneral?.name[2];
      worksheet.getCell(`BA${rowNumber}`).value =
        job.generalInfomation.internationalVersionChoose == "differenceAddress"
          ? job.generalInfomation.internationalGeneral?.name[3]
          : job.generalInfomation.originalGeneral?.name[3];
    }

    if (job.jobChange.includes("telephoneNo")) {
      worksheet.getCell(`AE${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.telephone;
    }
    if (job.jobChange.includes("email")) {
      worksheet.getCell(`AH${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.email;
      worksheet.getCell(`AI${rowNumber}`).value = job.generalInfomation
        .originalGeneral?.email
        ? job.verify.companyCode
        : "";
    }
    if (job.jobChange.includes("paymentTerm")) {
      worksheet.getCell(`ER${rowNumber}`).value =
        job.saleInfomation?.paymentTerm;
    }
  }

  if (templateNumber == 1 && job.jobType == "newCustomer") {
    const query = {
      TaxNo3: job.verify.taxId,
      BranchCode: job.verify.branchCode,
    };
    const customerCode = await Customer.find(query);

    //Key table
    worksheet.getCell(`B${rowNumber}`).value = "FLCU00";
    worksheet.getCell(`C${rowNumber}`).value =
      customerCode?.[0]?.Customer || "";

    worksheet.getCell(`D${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "BP11" : job.saleInfomation.bpGroup;
    // worksheet.getCell(`E${rowNumber}`).value =
    //   job.generalInfomation.generalType == "personal" ? "1" : "2";
    worksheet.getCell(`E${rowNumber}`).value = "2";

    //Address (Contact Person)
    // worksheet.getCell(`F${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`G${rowNumber}`).value = ""; //No Data

    //Address (Organization)
    worksheet.getCell(`H${rowNumber}`).value =
      job.generalInfomation.originalGeneral.name[0];
    worksheet.getCell(`I${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.name[1];
    worksheet.getCell(`J${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.name[2];
    worksheet.getCell(`K${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.name[3];
    worksheet.getCell(`L${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.originalSearchTerm_1;
    worksheet.getCell(`M${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // worksheet.getCell(`N${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`O${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`P${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`Q${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.addressLine1;
    worksheet.getCell(`R${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.street;
    worksheet.getCell(`S${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.subDistrict;
    worksheet.getCell(`T${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.district;
    worksheet.getCell(`U${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.city;
    worksheet.getCell(`V${rowNumber}`).value =
      job.verify.companyCode == "5100"
        ? ""
        : job.generalInfomation.originalGeneral?.postalCode;
    worksheet.getCell(`W${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.countryCode;
    worksheet.getCell(`X${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.region;
    worksheet.getCell(`Y${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.transportZoneCode;
    worksheet.getCell(`Z${rowNumber}`).value = job.saleInfomation?.language;
    worksheet.getCell(`AA${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.telephone;
    worksheet.getCell(`AB${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.extension;
    worksheet.getCell(`AC${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.telephoneSecond;
    worksheet.getCell(`AD${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.extensionSecond;
    worksheet.getCell(`AE${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.mobilePhone;
    worksheet.getCell(`AF${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.fax;
    // worksheet.getCell(`AG${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`AH${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.email;
    worksheet.getCell(`AI${rowNumber}`).value = job.generalInfomation
      .originalGeneral?.email
      ? job.verify.companyCode
      : "";
    worksheet.getCell(`AJ${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.emailSecond;
    worksheet.getCell(`AK${rowNumber}`).value = job.generalInfomation
      .originalGeneral?.emailSecond
      ? job.verify.companyCode
      : "";
    // worksheet.getCell(`AL${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AM${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AN${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AO${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AP${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AQ${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`AR${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.comment;
    worksheet.getCell(`AS${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.lineId;

    //International Version (Local Language)
    worksheet.getCell(`AT${rowNumber}`).value = "X";
    worksheet.getCell(`AU${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "T"
        : "V";
    // worksheet.getCell(`AV${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AW${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`AX${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.name[0]
        : job.generalInfomation.originalGeneral?.name[0];
    worksheet.getCell(`AY${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.name[1]
        : job.generalInfomation.originalGeneral?.name[1];
    worksheet.getCell(`AZ${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.name[2]
        : job.generalInfomation.originalGeneral?.name[2];
    worksheet.getCell(`BA${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.name[3]
        : job.generalInfomation.originalGeneral?.name[3];
    worksheet.getCell(`BB${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_1
        : job.generalInfomation.originalGeneral?.originalSearchTerm_1;
    worksheet.getCell(`BC${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_2
        : job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // worksheet.getCell(`BD${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`BE${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.addressLine1
        : job.generalInfomation.originalGeneral?.addressLine1;
    worksheet.getCell(`BF${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.street
        : job.generalInfomation.originalGeneral?.street;
    worksheet.getCell(`BG${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.subDistrict
        : job.generalInfomation.originalGeneral?.subDistrict;
    worksheet.getCell(`BH${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.district
        : job.generalInfomation.originalGeneral?.district;
    worksheet.getCell(`BI${rowNumber}`).value =
      job.generalInfomation.internationalVersionChoose == "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.city
        : job.generalInfomation.originalGeneral?.city;
    worksheet.getCell(`BJ${rowNumber}`).value =
      job.verify.companyCode == "5100"
        ? ""
        : job.generalInfomation.internationalVersionChoose ==
          "differenceAddress"
        ? job.generalInfomation.internationalGeneral?.postalCode
        : job.generalInfomation.originalGeneral?.postalCode;
    worksheet.getCell(`BK${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "VN" : job.saleInfomation?.country;

    //Identification
    // worksheet.getCell(`BL${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BM${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BN${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BO${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BP${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`BQ${rowNumber}`).value =
      job.generalInfomation.generalType == "personal" ? "X" : "";
    worksheet.getCell(`BR${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "TH3"
        : "VN1";
    worksheet.getCell(`BS${rowNumber}`).value = job.verify?.taxId;

    //Control (Company Code View)
    worksheet.getCell(`BT${rowNumber}`).value =
      job.verify.companyCode == "5100"
        ? ""
        : job.saleInfomation?.tradingPartner;

    //Control
    worksheet.getCell(`BU${rowNumber}`).value = "Z001";
    // worksheet.getCell(`BV${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BW${rowNumber}`).value = ""; //No Data

    //Payment Transaction
    //Bank 1
    if (job.saleInfomation?.bank[0]?.bankCode) {
      worksheet.getCell(`BX${rowNumber}`).value =
        job.saleInfomation?.bank[0]?.bankCode;
      worksheet.getCell(`BY${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`BZ${rowNumber}`).value =
        job.saleInfomation?.bank[0]?.bankBranch;
      worksheet.getCell(`CA${rowNumber}`).value =
        job.saleInfomation?.bank[0]?.bankAccount;
      // worksheet.getCell(`CB${rowNumber}`).value = ""; //No Data
      worksheet.getCell(`CC${rowNumber}`).value =
        job.saleInfomation?.bank[0]?.bankAccountName;
    }

    //Bank 2
    if (job.saleInfomation?.bank[1]?.bankCode) {
      worksheet.getCell(`CD${rowNumber}`).value =
        job.saleInfomation?.bank[1]?.bankCode;
      worksheet.getCell(`CE${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`CF${rowNumber}`).value =
        job.saleInfomation?.bank[1]?.bankBranch;
      worksheet.getCell(`CG${rowNumber}`).value =
        job.saleInfomation?.bank[1]?.bankAccount;
      // worksheet.getCell(`CH${rowNumber}`).value = ""; //No Data
      worksheet.getCell(`CI${rowNumber}`).value =
        job.saleInfomation?.bank[1]?.bankAccountName;
    }

    //Bank 3
    if (job.saleInfomation?.bank[2]?.bankCode) {
      worksheet.getCell(`CJ${rowNumber}`).value =
        job.saleInfomation?.bank[2]?.bankCode;
      worksheet.getCell(`CK${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`CL${rowNumber}`).value =
        job.saleInfomation?.bank[2]?.bankBranch;
      worksheet.getCell(`CM${rowNumber}`).value =
        job.saleInfomation?.bank[2]?.bankAccount;
      // worksheet.getCell(`CN${rowNumber}`).value = ""; //No Data
      worksheet.getCell(`CO${rowNumber}`).value =
        job.saleInfomation?.bank[2]?.bankAccountName;
    }

    //Bank 4
    if (job.saleInfomation?.bank[3]?.bankCode) {
      worksheet.getCell(`CP${rowNumber}`).value =
        job.saleInfomation?.bank[3]?.bankCode;
      worksheet.getCell(`CQ${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`CR${rowNumber}`).value =
        job.saleInfomation?.bank[3]?.bankBranch;
      worksheet.getCell(`CS${rowNumber}`).value =
        job.saleInfomation?.bank[3]?.bankAccount;
      // worksheet.getCell(`CT${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`CU${rowNumber}`).value =
        job.saleInfomation?.bank[3]?.bankAccountName;
    }

    //Bank 5
    if (job.saleInfomation?.bank[4]?.bankCode) {
      worksheet.getCell(`CV${rowNumber}`).value =
        job.saleInfomation?.bank[4]?.bankCode;
      worksheet.getCell(`CW${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`CX${rowNumber}`).value =
        job.saleInfomation?.bank[4]?.bankBranch;
      worksheet.getCell(`CY${rowNumber}`).value =
        job.saleInfomation?.bank[4]?.bankAccount;
      // worksheet.getCell(`CZ${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`DA${rowNumber}`).value =
        job.saleInfomation?.bank[4]?.bankAccountName;
    }

    //Bank 6
    if (job.saleInfomation?.bank[5]?.bankCode) {
      worksheet.getCell(`DB${rowNumber}`).value =
        job.saleInfomation?.bank[5]?.bankCode;
      worksheet.getCell(`DC${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`DD${rowNumber}`).value =
        job.saleInfomation?.bank[5]?.bankBranch;
      worksheet.getCell(`DE${rowNumber}`).value =
        job.saleInfomation?.bank[5]?.bankAccount;
      // worksheet.getCell(`DF${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`DG${rowNumber}`).value =
        job.saleInfomation?.bank[5]?.bankAccountName;
    }

    //Bank 7
    if (job.saleInfomation?.bank[6]?.bankCode) {
      worksheet.getCell(`DH${rowNumber}`).value =
        job.saleInfomation?.bank[6]?.bankCode;
      worksheet.getCell(`DI${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`DJ${rowNumber}`).value =
        job.saleInfomation?.bank[6]?.bankBranch;
      worksheet.getCell(`DK${rowNumber}`).value =
        job.saleInfomation?.bank[6]?.bankAccount;
      // worksheet.getCell(`DL${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`DM${rowNumber}`).value =
        job.saleInfomation?.bank[6]?.bankAccountName;
    }

    //Bank 8
    if (job.saleInfomation?.bank[7]?.bankCode) {
      worksheet.getCell(`DN${rowNumber}`).value =
        job.saleInfomation?.bank[7]?.bankCode;
      worksheet.getCell(`DO${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`DP${rowNumber}`).value =
        job.saleInfomation?.bank[7]?.bankBranch;
      worksheet.getCell(`DQ${rowNumber}`).value =
        job.saleInfomation?.bank[7]?.bankAccount;
      // worksheet.getCell(`DR${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`DS${rowNumber}`).value =
        job.saleInfomation?.bank[7]?.bankAccountName;
    }

    //Bank 9
    if (job.saleInfomation?.bank[8]?.bankCode) {
      worksheet.getCell(`DT${rowNumber}`).value =
        job.saleInfomation?.bank[8]?.bankCode;
      worksheet.getCell(`DU${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`DV${rowNumber}`).value =
        job.saleInfomation?.bank[8]?.bankBranch;
      worksheet.getCell(`DW${rowNumber}`).value =
        job.saleInfomation?.bank[8]?.bankAccount;
      // worksheet.getCell(`DX${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`DY${rowNumber}`).value =
        job.saleInfomation?.bank[8]?.bankAccountName;
    }

    //Bank 10
    if (job.saleInfomation?.bank[9]?.bankCode) {
      worksheet.getCell(`DZ${rowNumber}`).value =
        job.saleInfomation?.bank[9]?.bankCode;
      worksheet.getCell(`EA${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`EB${rowNumber}`).value =
        job.saleInfomation?.bank[9]?.bankBranch;
      worksheet.getCell(`EC${rowNumber}`).value =
        job.saleInfomation?.bank[9]?.bankAccount;
      // worksheet.getCell(`ED${rowNumber}`).val ue = ""; //No Data""; //No Data
      worksheet.getCell(`EE${rowNumber}`).value =
        job.saleInfomation?.bank[9]?.bankAccountName;
    }

    //Customer General Data`
    // worksheet.getCell(`EF${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`EG${rowNumber}`).value =
      job.verify.channel == "10" && job.verify.companyCode == "1100"
        ? "005"
        : "";

    //Additional Data (Company Code View)
    worksheet.getCell(`EH${rowNumber}`).value = job.saleInfomation?.attribute;
    worksheet.getCell(`EI${rowNumber}`).value = "02";

    // worksheet.getCell(`EJ${rowNumber}`).value = ""; //No Data

    //Extra (Company Code View)
    worksheet.getCell(`EK${rowNumber}`).value =
      job.saleInfomation?.classification;

    //For Extend Company code
    worksheet.getCell(`EL${rowNumber}`).value = "X";

    //Company Code View
    worksheet.getCell(`EM${rowNumber}`).value = job.verify.companyCode;

    //Customer:Account Management
    worksheet.getCell(`EN${rowNumber}`).value =
      job.saleInfomation?.reconciliation;
    worksheet.getCell(`EO${rowNumber}`).value = "009";
    worksheet.getCell(`EP${rowNumber}`).value = "R1";
    worksheet.getCell(`EQ${rowNumber}`).value = job.saleInfomation?.buyingGroup;

    //Customer:Payment transaction
    worksheet.getCell(`ER${rowNumber}`).value = job.saleInfomation?.paymentTerm;
    worksheet.getCell(`ES${rowNumber}`).value = job.verify.companyCode;
    worksheet.getCell(`ET${rowNumber}`).value = "X";
    // worksheet.getCell(`EU${rowNumber}`).value = ""; //No Data

    //Customer:Correspondence
    worksheet.getCell(`EV${rowNumber}`).value = job.verify.companyCode;
    // worksheet.getCell(`EW${rowNumber}`).value = ""; //No Data

    //Customer:Withholding Tax
    worksheet.getCell(`EX${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "Z1"
        : "";

    worksheet.getCell(`EY${rowNumber}`).value =
      job.saleInfomation?.withHoldingTaxCode;
    worksheet.getCell(`EZ${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "X"
        : "";
    worksheet.getCell(`FA${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? job.generalInfomation.generalType == "personal"
          ? "03"
          : "53"
        : "";
    worksheet.getCell(`FB${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? new Date(job.approveFinishDate)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, ".")
        : "";
    worksheet.getCell(`FC${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "" : "31.12.9999";
    worksheet.getCell(`FD${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "Z2"
        : "";
    // worksheet.getCell(`FE${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`FF${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "X"
        : "";
    worksheet.getCell(`FG${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? job.generalInfomation.generalType == "personal"
          ? "03"
          : "53"
        : "";
    worksheet.getCell(`FH${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? new Date(job.approveFinishDate)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, ".")
        : "";
    worksheet.getCell(`FI${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "" : "31.12.9999";
    worksheet.getCell(`FJ${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "Z3"
        : "";
    // worksheet.getCell(`FK${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`FL${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "X"
        : "";
    worksheet.getCell(`FM${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? job.generalInfomation.generalType == "personal"
          ? "03"
          : "53"
        : "";
    worksheet.getCell(`FN${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? new Date(job.approveFinishDate)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, ".")
        : "";
    worksheet.getCell(`FO${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "" : "31.12.9999";
    //Customer: Ctry-Spec.Enh.(Company Code View)
    worksheet.getCell(`FP${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "" : job.saleInfomation?.branchCode;
    worksheet.getCell(`FQ${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "" : job.saleInfomation?.description;

    // worksheet.getCell(`FR${rowNumber}`).value = "";
    // worksheet.getCell(`FS${rowNumber}`).value = "";
  }

  if (templateNumber == 2 && job.jobType == "changeCustomer") {
    worksheet.getCell(`B${rowNumber}`).value = job.verify.customerId;
    worksheet.getCell(`C${rowNumber}`).value = "FLCU01";
    worksheet.getCell(`D${rowNumber}`).value = job.verify?.companyCode;
    worksheet.getCell(`E${rowNumber}`).value = job.verify?.channel;
    worksheet.getCell(`F${rowNumber}`).value = "00";
    worksheet.getCell(`P${rowNumber}`).value = "1";
    if (job.jobChange.includes("priceList")) {
      worksheet.getCell(`Q${rowNumber}`).value =
        job.saleInfomation?.priceList != "No size"
          ? job.saleInfomation?.priceList
          : "";
    }
    if (job.jobChange.includes("paymentTerm")) {
      worksheet.getCell(`AA${rowNumber}`).value =
        job.saleInfomation?.paymentTerm;
    }
    worksheet.getCell(`AB${rowNumber}`).value = job.verify?.companyCode;
  }

  if (templateNumber == 2 && job.jobType == "newCustomer") {
    // worksheet.getCell(`B${rowNumber}`).value = "";
    worksheet.getCell(`C${rowNumber}`).value = "FLCU01";
    worksheet.getCell(`D${rowNumber}`).value = job.verify?.companyCode;
    worksheet.getCell(`E${rowNumber}`).value = job.verify?.channel;
    worksheet.getCell(`F${rowNumber}`).value = "00";
    worksheet.getCell(`G${rowNumber}`).value =
      job.saleInfomation?.salesDistrict;
    worksheet.getCell(`H${rowNumber}`).value =
      job.saleInfomation?.customerGroup;
    worksheet.getCell(`I${rowNumber}`).value = job.saleInfomation?.salesOffice;
    worksheet.getCell(`J${rowNumber}`).value = job.saleInfomation?.salesGroup;
    worksheet.getCell(`K${rowNumber}`).value = job.saleInfomation?.currency;
    worksheet.getCell(`L${rowNumber}`).value =
      job.saleInfomation?.exchangeRateType;
    // worksheet.getCell(`M${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`N${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`O${rowNumber}`).value = "" //No Data
    worksheet.getCell(`P${rowNumber}`).value = "1";
    worksheet.getCell(`Q${rowNumber}`).value =
      job.saleInfomation?.priceList != "No size"
        ? job.saleInfomation?.priceList
        : "";
    worksheet.getCell(`R${rowNumber}`).value = job.saleInfomation?.settlement
      ? "X"
      : "";
    worksheet.getCell(`S${rowNumber}`).value =
      job.saleInfomation?.deliveryPriority;
    // worksheet.getCell(`T${rowNumber}`).value = "" //No Data
    worksheet.getCell(`U${rowNumber}`).value =
      job.saleInfomation?.shippingCondition; //No Data
    // worksheet.getCell(`V${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`W${rowNumber}`).value = "" //No Data
    worksheet.getCell(`X${rowNumber}`).value = job.saleInfomation?.incoterms;
    worksheet.getCell(`Y${rowNumber}`).value = job.saleInfomation?.incoLocation;
    // worksheet.getCell(`Z${rowNumber}`).value = "" //No Data
    worksheet.getCell(`AA${rowNumber}`).value = job.saleInfomation?.paymentTerm;
    worksheet.getCell(`AB${rowNumber}`).value = job.verify?.companyCode;
    worksheet.getCell(`AC${rowNumber}`).value =
      job.saleInfomation?.accountAssignment;
    worksheet.getCell(`AD${rowNumber}`).value =
      job.saleInfomation?.taxClassification;
    // worksheet.getCell(`AE${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AF${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AG${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AH${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AI${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AJ${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AK${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AL${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AM${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AN${rowNumber}`).value = "" //No Data
    // worksheet.getCell(`AO${rowNumber}`).value = "" //No Data
  }

  if (templateNumber == 3 && job.jobType == "newCustomer") {
    //Sale Employee
    worksheet.getCell(`B${rowNumber}`).value = "A";
    worksheet.getCell(`C${rowNumber}`).value = "";
    worksheet.getCell(`D${rowNumber}`).value = "FLCU01";
    worksheet.getCell(`E${rowNumber}`).value = job.verify.companyCode;
    worksheet.getCell(`F${rowNumber}`).value = job.verify.channel;
    worksheet.getCell(`G${rowNumber}`).value = "00";
    worksheet.getCell(`H${rowNumber}`).value = "SE";
    worksheet.getCell(`I${rowNumber}`).value =
      job.saleInfomation?.saleEmployeeCode;
    // worksheet.getCell(`J${rowNumber}`).value = "" //No Data
    //AR Officer
    worksheet.getCell(`B11`).value = "A";
    worksheet.getCell(`C11`).value = "";
    worksheet.getCell(`D11`).value = "FLCU01";
    worksheet.getCell(`E11`).value = job.verify.companyCode;
    worksheet.getCell(`F11`).value = job.verify.channel;
    worksheet.getCell(`G11`).value = "00";
    worksheet.getCell(`H11`).value = "AC";
    worksheet.getCell(`I11`).value = job.saleInfomation?.arOfficerCode;
    // worksheet.getCell(`J11`).value = "" //No Data
    //Carrier
    worksheet.getCell(`B12`).value = job.saleInfomation?.carrierCode ? "A" : "";
    worksheet.getCell(`C12`).value = "";
    worksheet.getCell(`D12`).value = job.saleInfomation?.carrierCode
      ? "FLCU01"
      : "";
    worksheet.getCell(`E12`).value = job.saleInfomation?.carrierCode
      ? job.verify.companyCode
      : "";
    worksheet.getCell(`F12`).value = job.saleInfomation?.carrierCode
      ? job.verify.channel
      : "";
    worksheet.getCell(`G12`).value = job.saleInfomation?.carrierCode
      ? "00"
      : "";
    worksheet.getCell(`H12`).value = job.saleInfomation?.carrierCode
      ? "Z1"
      : "";
    worksheet.getCell(`I12`).value = job.saleInfomation?.carrierCode;
    // worksheet.getCell(`J12`).value = "" //No Data
    //Gypsum
    worksheet.getCell(`B13`).value = job.saleInfomation?.gypsumCode ? "A" : "";
    worksheet.getCell(`C13`).value = "";
    worksheet.getCell(`D13`).value = job.saleInfomation?.gypsumCode
      ? "FLCU01"
      : "";
    worksheet.getCell(`E13`).value = job.saleInfomation?.gypsumCode
      ? job.verify.companyCode
      : "";
    worksheet.getCell(`F13`).value = job.saleInfomation?.gypsumCode
      ? job.verify.channel
      : "";
    worksheet.getCell(`G13`).value = job.saleInfomation?.gypsumCode ? "00" : "";
    worksheet.getCell(`H13`).value = job.saleInfomation?.gypsumCode ? "Z3" : "";
    worksheet.getCell(`I13`).value = job.saleInfomation?.gypsumCode;
    // worksheet.getCell(`J13`).value = "" //No Data
    //Ceramic
    worksheet.getCell(`B14`).value = job.saleInfomation?.ceramicCode ? "A" : "";
    worksheet.getCell(`C14`).value = "";
    worksheet.getCell(`D14`).value = job.saleInfomation?.ceramicCode
      ? "FLCU01"
      : "";
    worksheet.getCell(`E14`).value = job.saleInfomation?.ceramicCode
      ? job.verify.companyCode
      : "";
    worksheet.getCell(`F14`).value = job.saleInfomation?.ceramicCode
      ? job.verify.channel
      : "";
    worksheet.getCell(`G14`).value = job.saleInfomation?.ceramicCode
      ? "00"
      : "";
    worksheet.getCell(`H14`).value = job.saleInfomation?.ceramicCode
      ? "Z7"
      : "";
    worksheet.getCell(`I14`).value = job.saleInfomation?.ceramicCode;
    // worksheet.getCell(`J13`).value = "" //No Data
    //BC
    worksheet.getCell(`B15`).value = job.saleInfomation?.billCollectorCode
      ? "A"
      : "";
    worksheet.getCell(`C15`).value = "";
    worksheet.getCell(`D15`).value = job.saleInfomation?.billCollectorCode
      ? "FLCU01"
      : "";
    worksheet.getCell(`E15`).value = job.saleInfomation?.billCollectorCode
      ? job.verify.companyCode
      : "";
    worksheet.getCell(`F15`).value = job.saleInfomation?.billCollectorCode
      ? job.verify.channel
      : "";
    worksheet.getCell(`G15`).value = job.saleInfomation?.billCollectorCode
      ? "00"
      : "";
    worksheet.getCell(`H15`).value = job.saleInfomation?.billCollectorCode
      ? "BC"
      : "";
    worksheet.getCell(`I15`).value = job.saleInfomation?.billCollectorCode;
    // worksheet.getCell(`J13`).value = "" //No Data
  }

  if (templateNumber == 4 && job.jobType == "changeCustomer") {
    worksheet.getCell(`B${rowNumber}`).value = "UKM000";
    worksheet.getCell(`C${rowNumber}`).value = job.verify.customerId;
    worksheet.getCell(`D${rowNumber}`).value = "B2B-NEW";
    worksheet.getCell(`G${rowNumber}`).value = job.verify.companyCode;
    worksheet.getCell(`I${rowNumber}`).value = "X";
    if (job.jobChange.includes("creditLimit")) {
      worksheet.getCell(`J${rowNumber}`).value =
        job.saleInfomation?.creditLimit;
    }
  }

  if (templateNumber == 4 && job.jobType == "newCustomer") {
    worksheet.getCell(`B${rowNumber}`).value = "UKM000";
    worksheet.getCell(`C${rowNumber}`).value = "";
    worksheet.getCell(`D${rowNumber}`).value = "B2B-NEW";
    worksheet.getCell(`E${rowNumber}`).value = job.saleInfomation?.riskClass;
    worksheet.getCell(`F${rowNumber}`).value = job.saleInfomation?.checkRule;
    worksheet.getCell(`G${rowNumber}`).value = job.verify.companyCode;
    // worksheet.getCell(`H${rowNumber}`).value = "" // No Data
    worksheet.getCell(`I${rowNumber}`).value = "X";
    worksheet.getCell(`J${rowNumber}`).value = job.saleInfomation?.creditLimit;
  }

  if (templateNumber == 5 && job.jobType == "newCustomer") {
    const checkArray = Array.isArray(job.authorizeDirector);

    //Key table
    worksheet.getCell(`B${rowNumber}`).value = "000000";
    // worksheet.getCell(`C${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`D${rowNumber}`).value = "BPC1";
    worksheet.getCell(`E${rowNumber}`).value = "1";

    //Address (Contact Person)
    worksheet.getCell(`F${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.firstName
        : job.authorizeDirector?.firstName;
    worksheet.getCell(`G${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.lastName
        : job.authorizeDirector?.lastName;

    //Address (Organization)
    // worksheet.getCell(`H${rowNumber}`).value = job.generalInfomation.originalGeneral.name[0];
    // worksheet.getCell(`I${rowNumber}`).value = job.generalInfomation.originalGeneral?.name[1];
    // worksheet.getCell(`J${rowNumber}`).value = job.generalInfomation.originalGeneral?.name[2];
    // worksheet.getCell(`K${rowNumber}`).value = job.generalInfomation.originalGeneral?.name[3];
    worksheet.getCell(`L${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.firstName
        : job.authorizeDirector?.firstName;
    // worksheet.getCell(`M${rowNumber}`).value = job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // worksheet.getCell(`N${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`O${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`P${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`Q${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.houseNo
        : job.authorizeDirector?.houseNo;
    worksheet.getCell(`R${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.companyStreet
        : job.authorizeDirector?.companyStreet;
    worksheet.getCell(`S${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.salesSubDistrict
        : job.authorizeDirector?.salesSubDistrict;
    worksheet.getCell(`T${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.salesDistrict
        : job.authorizeDirector?.salesDistrict;
    worksheet.getCell(`U${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.city
        : job.authorizeDirector?.city;
    worksheet.getCell(`V${rowNumber}`).value =
      job.verify.companyCode == "5100"
        ? ""
        : checkArray === true
        ? job.authorizeDirector[0]?.postalCode
        : job.authorizeDirector?.postalCode;
    worksheet.getCell(`W${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.countryCode
        : job.authorizeDirector?.countryCode;
    worksheet.getCell(`X${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.region
        : job.authorizeDirector?.region;
    worksheet.getCell(`Y${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.transportZoneCode
        : job.authorizeDirector?.transportZoneCode;
    worksheet.getCell(`Z${rowNumber}`).value = job.saleInfomation?.language;
    // worksheet.getCell(`AA${rowNumber}`).value = job.generalInfomation.originalGeneral?.telephone;
    // worksheet.getCell(`AB${rowNumber}`).value = job.generalInfomation.originalGeneral?.extension;
    // worksheet.getCell(`AC${rowNumber}`).value = job.generalInfomation.originalGeneral?.telephoneSecond;
    // worksheet.getCell(`AD${rowNumber}`).value = job.generalInfomation.originalGeneral?.extensionSecond;
    // worksheet.getCell(`AE${rowNumber}`).value = job.generalInfomation.originalGeneral?.mobilePhone;
    // worksheet.getCell(`AF${rowNumber}`).value = job.generalInfomation.originalGeneral?.fax;
    // // worksheet.getCell(`AG${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AH${rowNumber}`).value = job.generalInfomation.originalGeneral?.email;
    // worksheet.getCell(`AI${rowNumber}`).value = (job.generalInfomation.originalGeneral?.email) ? job.verify.companyCode : "";
    // worksheet.getCell(`AJ${rowNumber}`).value = job.generalInfomation.originalGeneral?.emailSecond;
    // worksheet.getCell(`AK${rowNumber}`).value = (job.generalInfomation.originalGeneral?.emailSecond) ? job.verify.companyCode : "";
    // // worksheet.getCell(`AL${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AM${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AN${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AO${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AP${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AQ${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AR${rowNumber}`).value = job.generalInfomation.originalGeneral?.comment;
    // worksheet.getCell(`AS${rowNumber}`).value = job.generalInfomation.originalGeneral?.lineId;

    // //International Version (Local Language)
    // worksheet.getCell(`AT${rowNumber}`).value = "X";
    // worksheet.getCell(`AU${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "T" : "V";
    // // worksheet.getCell(`AV${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AW${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AX${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[0] : job.generalInfomation.originalGeneral?.name[0];
    // worksheet.getCell(`AY${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[1] : job.generalInfomation.originalGeneral?.name[1];
    // worksheet.getCell(`AZ${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[2] : job.generalInfomation.originalGeneral?.name[2];
    // worksheet.getCell(`BA${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[3] : job.generalInfomation.originalGeneral?.name[3];
    // worksheet.getCell(`BB${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_1 : job.generalInfomation.originalGeneral?.originalSearchTerm_1;
    // worksheet.getCell(`BC${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_2 : job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // // worksheet.getCell(`BD${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BE${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.addressLine1 : job.generalInfomation.originalGeneral?.addressLine1;
    // worksheet.getCell(`BF${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.street : job.generalInfomation.originalGeneral?.street;
    // worksheet.getCell(`BG${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.subDistrict : job.generalInfomation.originalGeneral?.subDistrict;
    // worksheet.getCell(`BH${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.district : job.generalInfomation.originalGeneral?.district;
    // worksheet.getCell(`BI${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.city : job.generalInfomation.originalGeneral?.city;
    // worksheet.getCell(`BJ${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.postalCode : job.generalInfomation.originalGeneral?.postalCode;
    // worksheet.getCell(`BK${rowNumber}`).value = job.saleInfomation?.country;

    //Identification
    worksheet.getCell(`BL${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.gender
        : job.authorizeDirector?.gender;
    worksheet.getCell(`BM${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.dateOfBirth
        : job.authorizeDirector?.dateOfBirth;
    // worksheet.getCell(`BN${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BO${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BP${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`BQ${rowNumber}`).value = "X";
    worksheet.getCell(`BR${rowNumber}`).value =
      job.verify.companyCode == "5100" ? "VN1" : "TH3";
    worksheet.getCell(`BS${rowNumber}`).value =
      checkArray === true
        ? job.authorizeDirector[0]?.taxId
        : job.authorizeDirector?.taxId;

    //Control (Company Code View)
    // worksheet.getCell(`BT${rowNumber}`).value = job.saleInfomation?.tradingPartner;

    //Control
    worksheet.getCell(`BU${rowNumber}`).value = "Z001";
    // worksheet.getCell(`BV${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BW${rowNumber}`).value = ""; //No Data

    //Payment Transaction
    //Bank 1
    // if (job.saleInfomation?.bank[0]?.bankCode) {
    //     worksheet.getCell(`BX${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankCode;
    //     worksheet.getCell(`BY${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`BZ${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankBranch;
    //     worksheet.getCell(`CA${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankAccount;
    //     // worksheet.getCell(`CB${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CC${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankAccountName;
    // }

    // //Bank 2
    // if (job.saleInfomation?.bank[1]?.bankCode) {
    //     worksheet.getCell(`CD${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankCode;
    //     worksheet.getCell(`CE${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CF${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankBranch;
    //     worksheet.getCell(`CG${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankAccount;
    //     // worksheet.getCell(`CH${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CI${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankAccountName;
    // }

    // //Bank 3
    // if (job.saleInfomation?.bank[2]?.bankCode) {
    //     worksheet.getCell(`CJ${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankCode;
    //     worksheet.getCell(`CK${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CL${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankBranch;
    //     worksheet.getCell(`CM${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankAccount;
    //     // worksheet.getCell(`CN${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CO${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankAccountName;
    // }

    // //Bank 4
    // if (job.saleInfomation?.bank[3]?.bankCode) {
    //     worksheet.getCell(`CP${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankCode;
    //     worksheet.getCell(`CQ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CR${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankBranch;
    //     worksheet.getCell(`CS${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankAccount;
    //     // worksheet.getCell(`CT${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`CU${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankAccountName
    // }

    // //Bank 5
    // if (job.saleInfomation?.bank[4]?.bankCode) {
    //     worksheet.getCell(`CV${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankCode;
    //     worksheet.getCell(`CW${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CX${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankBranch;
    //     worksheet.getCell(`CY${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankAccount;
    //     // worksheet.getCell(`CZ${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DA${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankAccountName
    // }

    // //Bank 6
    // if (job.saleInfomation?.bank[5]?.bankCode) {
    //     worksheet.getCell(`DB${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankCode;
    //     worksheet.getCell(`DC${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DD${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankBranch;
    //     worksheet.getCell(`DE${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankAccount;
    //     // worksheet.getCell(`DF${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DG${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankAccountName
    // }

    // //Bank 7
    // if (job.saleInfomation?.bank[6]?.bankCode) {
    //     worksheet.getCell(`DH${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankCode;
    //     worksheet.getCell(`DI${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DJ${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankBranch;
    //     worksheet.getCell(`DK${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankAccount;
    //     // worksheet.getCell(`DL${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DM${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankAccountName
    // }

    // //Bank 8
    // if (job.saleInfomation?.bank[7]?.bankCode) {
    //     worksheet.getCell(`DN${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankCode;
    //     worksheet.getCell(`DO${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DP${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankBranch;
    //     worksheet.getCell(`DQ${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankAccount;
    //     // worksheet.getCell(`DR${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DS${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankAccountName
    // }

    // //Bank 9
    // if (job.saleInfomation?.bank[8]?.bankCode) {
    //     worksheet.getCell(`DT${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankCode;
    //     worksheet.getCell(`DU${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DV${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankBranch;
    //     worksheet.getCell(`DW${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankAccount;
    //     // worksheet.getCell(`DX${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DY${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankAccountName
    // }

    // //Bank 10
    // if (job.saleInfomation?.bank[9]?.bankCode) {
    //     worksheet.getCell(`DZ${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankCode;
    //     worksheet.getCell(`EA${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`EB${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankBranch;
    //     worksheet.getCell(`EC${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankAccount;
    //     // worksheet.getCell(`ED${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`EE${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankAccountName
    // }

    // //Customer General Data`
    // // worksheet.getCell(`EF${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`EG${rowNumber}`).value = (job.verify.channel == "10") ? "005" : "";

    // //Additional Data (Company Code View)
    // worksheet.getCell(`EH${rowNumber}`).value = job.saleInfomation?.attribute;
    // worksheet.getCell(`EI${rowNumber}`).value = "02"

    // // worksheet.getCell(`EJ${rowNumber}`).value = ""; //No Data

    // //Extra (Company Code View)
    // worksheet.getCell(`EK${rowNumber}`).value = job.saleInfomation?.arOfficerCode;

    // //For Extend Company code
    // worksheet.getCell(`EL${rowNumber}`).value = "X";

    // //Company Code View
    // worksheet.getCell(`EM${rowNumber}`).value = job.verify.companyCode;

    // //Customer:Account Management
    // worksheet.getCell(`EN${rowNumber}`).value = job.saleInfomation?.reconciliation;
    // worksheet.getCell(`EO${rowNumber}`).value = "009";
    // worksheet.getCell(`EP${rowNumber}`).value = "R1";
    // worksheet.getCell(`EQ${rowNumber}`).value = job.saleInfomation?.buyingGroup;

    // //Customer:Payment transaction
    // worksheet.getCell(`ER${rowNumber}`).value = job.saleInfomation?.paymentTerm;
    // worksheet.getCell(`ES${rowNumber}`).value = job.verify.companyCode;
    // worksheet.getCell(`ET${rowNumber}`).value = "X";
    // // worksheet.getCell(`EU${rowNumber}`).value = ""; //No Data

    // //Customer:Correspondence
    // worksheet.getCell(`EV${rowNumber}`).value = job.verify.companyCode;
    // // worksheet.getCell(`EW${rowNumber}`).value = ""; //No Data

    // //Customer:Withholding Tax
    // worksheet.getCell(`EX${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "Z1" : "";

    // worksheet.getCell(`EY${rowNumber}`).value = job.saleInfomation?.withHoldingTaxCode
    // worksheet.getCell(`EZ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FA${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FB${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FC${rowNumber}`).value = "31.12.9999"
    // worksheet.getCell(`FD${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "22" : "";
    // // worksheet.getCell(`FE${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`FF${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FG${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FH${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FI${rowNumber}`).value = "31.12.9999"
    // worksheet.getCell(`FJ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "Z3" : "";
    // // worksheet.getCell(`FK${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`FL${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FM${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FN${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FO${rowNumber}`).value = "31.12.9999"
    // //Customer: Ctry-Spec.Enh.(Company Code View)
    // worksheet.getCell(`FP${rowNumber}`).value = job.saleInfomation?.branchCode;
    // worksheet.getCell(`FQ${rowNumber}`).value = job.saleInfomation?.description;

    // worksheet.getCell(`FR${rowNumber}`).value = "";
    // worksheet.getCell(`FS${rowNumber}`).value = "";
  }

  if (templateNumber == 6 && job.jobType == "changeCustomer") {
    worksheet.getCell(`B${rowNumber}`).value = "000000";
    worksheet.getCell(`C${rowNumber}`).value = job.verify.customerId;
    worksheet.getCell(`D${rowNumber}`).value = "Change";
    worksheet.getCell(`E${rowNumber}`).value = "0";
    worksheet.getCell(`BU${rowNumber}`).value = "Z002";
    if (job.jobChange.includes("billingAddress")) {
      if (job.billingAddress?.billingAddressChoose == "sameAddress") {
        worksheet.getCell(`H${rowNumber}`).value =
          job.generalInfomation.originalGeneral.name[0];
        worksheet.getCell(`I${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.name[1];
        worksheet.getCell(`J${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.name[2];
        worksheet.getCell(`K${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.name[3];

        worksheet.getCell(`Q${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.addressLine1;
        worksheet.getCell(`R${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.street;
        worksheet.getCell(`S${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.subDistrict;
        worksheet.getCell(`T${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.district;
        worksheet.getCell(`U${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.city;
        worksheet.getCell(`V${rowNumber}`).value =
          job.verify.companyCode == "5100"
            ? ""
            : job.generalInfomation.originalGeneral?.postalCode;
        worksheet.getCell(`W${rowNumber}`).value =
          job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
            ? "TH"
            : "VN";
        worksheet.getCell(`X${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.region;
        worksheet.getCell(`Y${rowNumber}`).value =
          job.generalInfomation.originalGeneral?.transportZoneCode;
      } else {
        worksheet.getCell(`H${rowNumber}`).value = job.billingAddress?.name[0];
        worksheet.getCell(`I${rowNumber}`).value = job.billingAddress?.name[1];
        worksheet.getCell(`J${rowNumber}`).value = job.billingAddress?.name[2];
        worksheet.getCell(`K${rowNumber}`).value = job.billingAddress?.name[3];

        worksheet.getCell(`Q${rowNumber}`).value =
          job.billingAddress?.addressLine1;
        worksheet.getCell(`R${rowNumber}`).value = job.billingAddress?.street;
        worksheet.getCell(`S${rowNumber}`).value =
          job.billingAddress?.subDistrict;
        worksheet.getCell(`T${rowNumber}`).value = job.billingAddress?.district;
        worksheet.getCell(`U${rowNumber}`).value = job.billingAddress?.city;
        worksheet.getCell(`V${rowNumber}`).value =
          job.verify.companyCode == "5100"
            ? ""
            : job.billingAddress?.postalCode;
        worksheet.getCell(`W${rowNumber}`).value =
          job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
            ? "TH"
            : "VN";
        worksheet.getCell(`X${rowNumber}`).value = job.billingAddress?.region;
        worksheet.getCell(`Y${rowNumber}`).value =
          job.billingAddress?.transportZoneCode;
      }
    }
  }

  if (templateNumber == 6 && job.jobType == "newCustomer") {
    //Key table
    worksheet.getCell(`B${rowNumber}`).value = "000000";
    // worksheet.getCell(`C${rowNumber}`).value = ""; //No Data
    worksheet.getCell(`D${rowNumber}`).value = "BPC1";
    worksheet.getCell(`E${rowNumber}`).value = "2";

    //Address (Contact Person)
    // worksheet.getCell(`F${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`G${rowNumber}`).value = ""; //No Data

    //Address (Organization)

    worksheet.getCell(`L${rowNumber}`).value =
      job.generalInfomation.originalGeneral?.originalSearchTerm_1;
    // worksheet.getCell(`M${rowNumber}`).value = job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // worksheet.getCell(`N${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`O${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`P${rowNumber}`).value = ""; //No Data
    if (job.billingAddress?.billingAddressChoose == "sameAddress") {
      worksheet.getCell(`H${rowNumber}`).value =
        job.generalInfomation.originalGeneral.name[0];
      worksheet.getCell(`I${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[1];
      worksheet.getCell(`J${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[2];
      worksheet.getCell(`K${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.name[3];

      worksheet.getCell(`Q${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.addressLine1;
      worksheet.getCell(`R${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.street;
      worksheet.getCell(`S${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.subDistrict;
      worksheet.getCell(`T${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.district;
      worksheet.getCell(`U${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.city;
      worksheet.getCell(`V${rowNumber}`).value =
        job.verify.companyCode == "5100"
          ? ""
          : job.generalInfomation.originalGeneral?.postalCode;
      worksheet.getCell(`W${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`X${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.region;
      worksheet.getCell(`Y${rowNumber}`).value =
        job.generalInfomation.originalGeneral?.transportZoneCode;
    } else {
      worksheet.getCell(`H${rowNumber}`).value = job.billingAddress?.name[0];
      worksheet.getCell(`I${rowNumber}`).value = job.billingAddress?.name[1];
      worksheet.getCell(`J${rowNumber}`).value = job.billingAddress?.name[2];
      worksheet.getCell(`K${rowNumber}`).value = job.billingAddress?.name[3];

      worksheet.getCell(`Q${rowNumber}`).value =
        job.billingAddress?.addressLine1;
      worksheet.getCell(`R${rowNumber}`).value = job.billingAddress?.street;
      worksheet.getCell(`S${rowNumber}`).value =
        job.billingAddress?.subDistrict;
      worksheet.getCell(`T${rowNumber}`).value = job.billingAddress?.district;
      worksheet.getCell(`U${rowNumber}`).value = job.billingAddress?.city;
      worksheet.getCell(`V${rowNumber}`).value =
        job.verify.companyCode == "5100" ? "" : job.billingAddress?.postalCode;
      worksheet.getCell(`W${rowNumber}`).value =
        job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
          ? "TH"
          : "VN";
      worksheet.getCell(`X${rowNumber}`).value = job.billingAddress?.region;
      worksheet.getCell(`Y${rowNumber}`).value =
        job.billingAddress?.transportZoneCode;
    }

    worksheet.getCell(`Z${rowNumber}`).value = job.saleInfomation?.language;
    // worksheet.getCell(`AA${rowNumber}`).value = job.generalInfomation.originalGeneral?.telephone;
    // worksheet.getCell(`AB${rowNumber}`).value = job.generalInfomation.originalGeneral?.extension;
    // worksheet.getCell(`AC${rowNumber}`).value = job.generalInfomation.originalGeneral?.telephoneSecond;
    // worksheet.getCell(`AD${rowNumber}`).value = job.generalInfomation.originalGeneral?.extensionSecond;
    // worksheet.getCell(`AE${rowNumber}`).value = job.generalInfomation.originalGeneral?.mobilePhone;
    // worksheet.getCell(`AF${rowNumber}`).value = job.generalInfomation.originalGeneral?.fax;
    // // worksheet.getCell(`AG${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AH${rowNumber}`).value = job.generalInfomation.originalGeneral?.email;
    // worksheet.getCell(`AI${rowNumber}`).value = (job.generalInfomation.originalGeneral?.email) ? job.verify.companyCode : "";
    // worksheet.getCell(`AJ${rowNumber}`).value = job.generalInfomation.originalGeneral?.emailSecond;
    // worksheet.getCell(`AK${rowNumber}`).value = (job.generalInfomation.originalGeneral?.emailSecond) ? job.verify.companyCode : "";
    // // worksheet.getCell(`AL${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AM${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AN${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AO${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AP${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AQ${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AR${rowNumber}`).value = job.generalInfomation.originalGeneral?.comment;
    // worksheet.getCell(`AS${rowNumber}`).value = job.generalInfomation.originalGeneral?.lineId;

    // //International Version (Local Language)
    // worksheet.getCell(`AT${rowNumber}`).value = "X";
    // worksheet.getCell(`AU${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "T" : "V";
    // // worksheet.getCell(`AV${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`AW${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`AX${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[0] : job.generalInfomation.originalGeneral?.name[0];
    // worksheet.getCell(`AY${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[1] : job.generalInfomation.originalGeneral?.name[1];
    // worksheet.getCell(`AZ${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[2] : job.generalInfomation.originalGeneral?.name[2];
    // worksheet.getCell(`BA${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.name[3] : job.generalInfomation.originalGeneral?.name[3];
    // worksheet.getCell(`BB${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_1 : job.generalInfomation.originalGeneral?.originalSearchTerm_1;
    // worksheet.getCell(`BC${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.internationalSearchTerm_2 : job.generalInfomation.originalGeneral?.originalSearchTerm_2;
    // // worksheet.getCell(`BD${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BE${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.addressLine1 : job.generalInfomation.originalGeneral?.addressLine1;
    // worksheet.getCell(`BF${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.street : job.generalInfomation.originalGeneral?.street;
    // worksheet.getCell(`BG${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.subDistrict : job.generalInfomation.originalGeneral?.subDistrict;
    // worksheet.getCell(`BH${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.district : job.generalInfomation.originalGeneral?.district;
    // worksheet.getCell(`BI${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.city : job.generalInfomation.originalGeneral?.city;
    // worksheet.getCell(`BJ${rowNumber}`).value = (job.generalInfomation.internationalVersionChoose == "differenceAddress") ? job.generalInfomation.internationalGeneral?.postalCode : job.generalInfomation.originalGeneral?.postalCode;
    worksheet.getCell(`BK${rowNumber}`).value =
      job.verify.companyCode == "1100" || job.verify.companyCode == "1200"
        ? "TH"
        : "VN";

    // //Identification
    // // worksheet.getCell(`BL${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`BM${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`BN${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`BO${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`BP${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`BQ${rowNumber}`).value = (job.generalInfomation.generalType == "personal") ? "X" : "";
    // worksheet.getCell(`BR${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH3" : "VN1";
    // worksheet.getCell(`BS${rowNumber}`).value = job.verify?.taxId;

    // //Control (Company Code View)
    // worksheet.getCell(`BT${rowNumber}`).value = job.saleInfomation?.tradingPartner;

    //Control
    worksheet.getCell(`BU${rowNumber}`).value = "Z002";
    // // worksheet.getCell(`BV${rowNumber}`).value = ""; //No Data
    // // worksheet.getCell(`BW${rowNumber}`).value = ""; //No Data

    // //Payment Transaction
    // //Bank 1
    // if (job.saleInfomation?.bank[0]?.bankCode) {
    //     worksheet.getCell(`BX${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankCode;
    //     worksheet.getCell(`BY${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`BZ${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankBranch;
    //     worksheet.getCell(`CA${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankAccount;
    //     // worksheet.getCell(`CB${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CC${rowNumber}`).value = job.saleInfomation?.bank[0]?.bankAccountName;
    // }

    // //Bank 2
    // if (job.saleInfomation?.bank[1]?.bankCode) {
    //     worksheet.getCell(`CD${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankCode;
    //     worksheet.getCell(`CE${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CF${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankBranch;
    //     worksheet.getCell(`CG${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankAccount;
    //     // worksheet.getCell(`CH${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CI${rowNumber}`).value = job.saleInfomation?.bank[1]?.bankAccountName;
    // }

    // //Bank 3
    // if (job.saleInfomation?.bank[2]?.bankCode) {
    //     worksheet.getCell(`CJ${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankCode;
    //     worksheet.getCell(`CK${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CL${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankBranch;
    //     worksheet.getCell(`CM${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankAccount;
    //     // worksheet.getCell(`CN${rowNumber}`).value = ""; //No Data
    //     worksheet.getCell(`CO${rowNumber}`).value = job.saleInfomation?.bank[2]?.bankAccountName;
    // }

    // //Bank 4
    // if (job.saleInfomation?.bank[3]?.bankCode) {
    //     worksheet.getCell(`CP${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankCode;
    //     worksheet.getCell(`CQ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CR${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankBranch;
    //     worksheet.getCell(`CS${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankAccount;
    //     // worksheet.getCell(`CT${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`CU${rowNumber}`).value = job.saleInfomation?.bank[3]?.bankAccountName
    // }

    // //Bank 5
    // if (job.saleInfomation?.bank[4]?.bankCode) {
    //     worksheet.getCell(`CV${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankCode;
    //     worksheet.getCell(`CW${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`CX${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankBranch;
    //     worksheet.getCell(`CY${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankAccount;
    //     // worksheet.getCell(`CZ${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DA${rowNumber}`).value = job.saleInfomation?.bank[4]?.bankAccountName
    // }

    // //Bank 6
    // if (job.saleInfomation?.bank[5]?.bankCode) {
    //     worksheet.getCell(`DB${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankCode;
    //     worksheet.getCell(`DC${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DD${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankBranch;
    //     worksheet.getCell(`DE${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankAccount;
    //     // worksheet.getCell(`DF${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DG${rowNumber}`).value = job.saleInfomation?.bank[5]?.bankAccountName
    // }

    // //Bank 7
    // if (job.saleInfomation?.bank[6]?.bankCode) {
    //     worksheet.getCell(`DH${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankCode;
    //     worksheet.getCell(`DI${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DJ${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankBranch;
    //     worksheet.getCell(`DK${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankAccount;
    //     // worksheet.getCell(`DL${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DM${rowNumber}`).value = job.saleInfomation?.bank[6]?.bankAccountName
    // }

    // //Bank 8
    // if (job.saleInfomation?.bank[7]?.bankCode) {
    //     worksheet.getCell(`DN${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankCode;
    //     worksheet.getCell(`DO${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DP${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankBranch;
    //     worksheet.getCell(`DQ${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankAccount;
    //     // worksheet.getCell(`DR${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DS${rowNumber}`).value = job.saleInfomation?.bank[7]?.bankAccountName
    // }

    // //Bank 9
    // if (job.saleInfomation?.bank[8]?.bankCode) {
    //     worksheet.getCell(`DT${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankCode;
    //     worksheet.getCell(`DU${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`DV${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankBranch;
    //     worksheet.getCell(`DW${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankAccount;
    //     // worksheet.getCell(`DX${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`DY${rowNumber}`).value = job.saleInfomation?.bank[8]?.bankAccountName
    // }

    // //Bank 10
    // if (job.saleInfomation?.bank[9]?.bankCode) {
    //     worksheet.getCell(`DZ${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankCode;
    //     worksheet.getCell(`EA${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "TH" : "5100";
    //     worksheet.getCell(`EB${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankBranch;
    //     worksheet.getCell(`EC${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankAccount;
    //     // worksheet.getCell(`ED${rowNumber}`).val ue = ""; //No Data""; //No Data
    //     worksheet.getCell(`EE${rowNumber}`).value = job.saleInfomation?.bank[9]?.bankAccountName
    // }

    // //Customer General Data`
    // // worksheet.getCell(`EF${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`EG${rowNumber}`).value = (job.verify.channel == "10") ? "005" : "";

    // //Additional Data (Company Code View)
    // worksheet.getCell(`EH${rowNumber}`).value = job.saleInfomation?.attribute;
    // worksheet.getCell(`EI${rowNumber}`).value = "02"

    // // worksheet.getCell(`EJ${rowNumber}`).value = ""; //No Data

    // //Extra (Company Code View)
    // worksheet.getCell(`EK${rowNumber}`).value = job.saleInfomation?.arOfficerCode;

    // //For Extend Company code
    // worksheet.getCell(`EL${rowNumber}`).value = "X";

    // //Company Code View
    // worksheet.getCell(`EM${rowNumber}`).value = job.verify.companyCode;

    // //Customer:Account Management
    // worksheet.getCell(`EN${rowNumber}`).value = job.saleInfomation?.reconciliation;
    // worksheet.getCell(`EO${rowNumber}`).value = "009";
    // worksheet.getCell(`EP${rowNumber}`).value = "R1";
    // worksheet.getCell(`EQ${rowNumber}`).value = job.saleInfomation?.buyingGroup;

    // //Customer:Payment transaction
    // worksheet.getCell(`ER${rowNumber}`).value = job.saleInfomation?.paymentTerm;
    // worksheet.getCell(`ES${rowNumber}`).value = job.verify.companyCode;
    // worksheet.getCell(`ET${rowNumber}`).value = "X";
    // // worksheet.getCell(`EU${rowNumber}`).value = ""; //No Data

    // //Customer:Correspondence
    // worksheet.getCell(`EV${rowNumber}`).value = job.verify.companyCode;
    // // worksheet.getCell(`EW${rowNumber}`).value = ""; //No Data

    // //Customer:Withholding Tax
    // worksheet.getCell(`EX${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "Z1" : "";

    // worksheet.getCell(`EY${rowNumber}`).value = job.saleInfomation?.withHoldingTaxCode
    // worksheet.getCell(`EZ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FA${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FB${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date(job.approveFinishDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FC${rowNumber}`).value = "31.12.9999"
    // worksheet.getCell(`FD${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "22" : "";
    // // worksheet.getCell(`FE${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`FF${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FG${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FH${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date(job.approveFinishDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FI${rowNumber}`).value = "31.12.9999"
    // worksheet.getCell(`FJ${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "Z3" : "";
    // // worksheet.getCell(`FK${rowNumber}`).value = ""; //No Data
    // worksheet.getCell(`FL${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? "X" : "";
    // worksheet.getCell(`FM${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? (job.generalInfomation.generalType == "personal") ? "03" : "53" : "";
    // worksheet.getCell(`FN${rowNumber}`).value = (job.verify.companyCode == "1100" || job.verify.companyCode == "1200") ? new Date(job.approveFinishDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : "";
    // worksheet.getCell(`FO${rowNumber}`).value = "31.12.9999"
    // //Customer: Ctry-Spec.Enh.(Company Code View)
    // worksheet.getCell(`FP${rowNumber}`).value = job.saleInfomation?.branchCode;
    // worksheet.getCell(`FQ${rowNumber}`).value = job.saleInfomation?.description;

    // // worksheet.getCell(`FR${rowNumber}`).value = "";
    // // worksheet.getCell(`FS${rowNumber}`).value = "";
  }

  const outputFileName = `${templateNumber}.${templateName}.xlsx`;
  const outputPath = path.join(__dirname, "..", exportPath, outputFileName);

  await workbook.xlsx.writeFile(outputPath);
}

async function zipExportDirectory(sourceDir, zipFilePath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
