const nodemailer = require("nodemailer");
const emailBuilder = require("../controllers/emailController");

const transporter = nodemailer.createTransport({
  host: "toa365.mail.protection.outlook.com",
  port: 25,
  secure: false,
});

function convertDateFormat(inputDateStr) {
  // Parse the input date string
  const inputDate = new Date(inputDateStr);

  // Check if the date is valid
  if (isNaN(inputDate.getTime())) {
    return "Invalid date";
  }

  // Extract the components of the date
  const day = String(inputDate.getDate()).padStart(2, "0");
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const year = inputDate.getFullYear();
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getSeconds()).padStart(2, "0");

  // Format the date in the desired output format
  const outputDateStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return outputDateStr;
}

const send = async (req, res, next) => {
  const {
    type,
    email,
    userReject,
    jobData,
    userCreator,
    userApprove,
    userNext,
    date,
    userCancel,
    mailTopicMissing,
  } = req;

  const emailContent = {
    customerMissingField: {
      body: `<p>Dear Relevant Team,</p>
                <p>An issue has been identified in the data obtained from the CSV file within the create customer master system. There are potential errors or missing information.</p>
                <p>${mailTopicMissing}</p>
                <p>Kindly review and re-transfer the data promptly to ensure accuracy.</p>
                <p>For any inquiries or assistance, please contact our support team at Digital Platfrom</p>
                <p>Thank you for your prompt attention.</p>
            `,
      subject:
        "CCM - Customer Master Template has founded error, please check the template",
    },
    activeRequest: {
      body: `<p>Have one new request activate</p>
                <p>Please check this out: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>`,
      subject: "CCM - Have one new request activate",
    },
    approvedRequest: {
      body: `<p>Your Account has been approved</p>
                <p>Please check this out: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>`,
      subject: "CCM - Your Account has been approved",
    },
    rejectedRequest: {
      body: `<p>Your Account has been rejected</p>
                <p>Please check this out: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>`,
      subject: "CCM - Your Account has been rejected",
    },
    completeJobnewCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong>Complete by AR Master</p>
            <p><strong>Approver Position:</strong> AR Master</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>New Customer ID:</strong> ${jobData?.customerId}</p>
            <p><strong>Tax ID:</strong> ${jobData?.verify.taxId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Create New Customer-Document ID ${jobData?.jobNumber} has been completed`,
    },
    completeJobchangeCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong>Complete by AR Master</p>
            <p><strong>Approver Position:</strong> AR Master</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Customer ID:</strong> ${jobData?.customerId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Change Customer-Document ID ${jobData?.jobNumber} has been completed`,
    },
    pendingJobnewCustomer: {
      body: `
            <p><strong>Dear ${userNext?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Waiting by Approver's  ${
              userNext?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userNext?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Tax ID:</strong> ${jobData?.verify.taxId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Create New Customer-Document ID ${jobData?.jobNumber} has been waiting for your approval`,
    },
    pendingJobchangeCustomer: {
      body: `
            <p><strong>Dear ${userNext?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Waiting by Approver's  ${
              userNext?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userNext?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Tax ID:</strong> ${jobData?.verify.taxId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Change Customer-Document ID ${jobData?.jobNumber} has been waiting for your approval`,
    },
    rejectJobnewCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Rejected by Approver's  ${
              userReject?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userReject?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Customer Id:</strong> ${jobData?.verify.customerId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Create New Customer-Document ID ${jobData?.jobNumber} has been rejected`,
    },
    rejectJobchangeCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Rejected by Approver's  ${
              userReject?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userReject?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Customer Id:</strong> ${jobData?.verify.customerId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Change Customer-Document ID ${jobData?.jobNumber} has been rejected`,
    },
    cancelJobnewCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Cancelled by Approver's  ${
              userCancel?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userCancel?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Tax ID:</strong> ${jobData?.verify.taxId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Create New Customer-Document ID ${jobData?.jobNumber} has been cancelled`,
    },
    cancelJobchangeCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Cancelled by Approver's  ${
              userCancel?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userCancel?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Customer Id:</strong> ${jobData?.verify.customerId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Change Customer-Document ID ${jobData?.jobNumber} has been cancelled`,
    },
    approveJobnewCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Approved by Approver's  ${
              userApprove?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userApprove?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Tax ID:</strong> ${jobData?.verify.taxId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Create New Customer-Document ID ${jobData?.jobNumber} has been approved Position ${userApprove?.role}`,
    },
    approveJobchangeCustomer: {
      body: `
            <p><strong>Dear ${userCreator?.name},</strong></p>
            <p><strong>Document ID:</strong> ${jobData?.jobNumber}</p>
            <p><strong>Create Date:</strong> ${convertDateFormat(
              jobData?.createDate
            )}</p>
            <p><strong>Created By:</strong> ${jobData?.requesterUser.name}</p>
            <p><strong>Document Status:</strong> Approved by Approver's  ${
              userApprove?.name
            }</p>
            <p><strong>Approver Position:</strong> ${userApprove?.role}</p>
            <p><strong>Customer Name:</strong> ${jobData?.generalInfomation.originalGeneral.name.join(
              " "
            )}</p>
            <p><strong>Customer Id:</strong> ${jobData?.verify.customerId}</p>
            <p><strong>Company:</strong> ${jobData?.verify.companyCode} ${
        jobData?.companyName
      }</p>
            <p><strong>Channel:</strong> ${jobData?.verify.channel} ${
        jobData?.channelName
      }</p>
            <p><strong>Comment:</strong>${jobData?.comment}</p>
            <p><strong>Click the link to see more detail:</strong> <a href="${
              process.env.FRONTEND_URL
            }" class="link">${process.env.FRONTEND_URL}</a></p>
            `,
      subject: `Change Customer-Document ID ${jobData?.jobNumber} has been approved`,
    },
  };

  if (type in emailContent) {
    const { body, subject } = emailContent[type];
    const toEmail = email;

    const sendDetail = {
      from: process.env.EMAIL_ADDRESS,
      to: type == "customerMissingField" ? toEmail.join(", ") : toEmail,
      subject: subject,
      html: body,
    };

    try {
      const info = await transporter.sendMail(sendDetail);
      await emailBuilder.create_a_email_func({
        from_email: process.env.EMAIL_ADDRESS,
        type: type,
        status: "success",
        detail: info,
        sendDetail: sendDetail,
      });
    } catch (err) {
      await emailBuilder.create_a_email_func({
        from_email: process.env.EMAIL_ADDRESS,
        type: type,
        status: "error",
        detail: err,
        sendDetail: sendDetail,
      });
    }

    // if (type === "completeJobnewCustomer") {
    //   const sendNewDetail = {
    //     from: process.env.EMAIL_ADDRESS,
    //     // to: "nutcha_s@toagroup.com",
    //     to: "noreply_nintexrpa@toagroup.com",
    //     subject: subject,
    //     html: body,
    //   };

    //   try {
    //     const info = await transporter.sendMail(sendNewDetail);
    //     await emailBuilder.create_a_email_func({
    //       from_email: process.env.EMAIL_ADDRESS,
    //       type: type,
    //       status: "success",
    //       detail: info,
    //       sendDetail: sendNewDetail,
    //     });
    //   } catch (err) {
    //     await emailBuilder.create_a_email_func({
    //       from_email: process.env.EMAIL_ADDRESS,
    //       type: type,
    //       status: "error",
    //       detail: err,
    //       sendDetail: sendNewDetail,
    //     });
    //   }
    // }
  }
};

module.exports = send;
