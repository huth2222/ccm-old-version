const mongoose = require("mongoose");

// Define the Job schema
const jobSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    default: Date.now,
  },
  lastDraftDate: {
    type: Date,
  },
  isSave: {
    type: Boolean,
    default: false,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  saveDate: {
    type: Date,
  },
  approveFinishDate: {
    type: Date,
    default: "",
  },
  jobNumber: {
    type: String,
  },
  jobType: {
    type: String,
    required: true,
  },
  verify: {
    type: Object,
    required: true,
  },
  generalInfomation: {
    type: Object,
    default: null,
  },
  saleInfomation: {
    type: Object,
    default: null,
  },
  authorizeDirector: {
    type: Array,
    default: null,
  },
  billingAddress: {
    type: Object,
    default: null,
  },
  requesterEmployeeId: {
    type: String,
  },
  approveSequnce: {
    type: Array,
  },
  approveSequnceCoApprove: {
    type: Array,
  },
  approvedList: {
    type: Array,
    default: [],
  },
  approvedListCoApproval: {
    type: Array,
    default: [],
  },
  pendingEmployeeId: {
    type: String,
    default: "",
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  rejectedById: {
    type: String,
    default: "",
  },
  rejectedDate: {
    type: Date,
  },
  cancelledDate: {
    type: Date,
  },
  cancelledById: {
    type: String,
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
  accessList: {
    type: Array,
    default: [],
  },
  accessListCoApproval: {
    type: Array,
    default: [],
  },
  uploadItems: {
    type: Array,
    default: [],
  },
  approvedDatetime: {
    type: Object,
    default: {},
  },
  approvedDatetimeCoApproval: {
    type: Object,
    default: {},
  },
  rejectTopics: {
    type: Array,
    default: [],
  },
  isSkipCoApprover: {
    type: Boolean,
    default: false,
  },
  coApproval: {
    type: Array,
    default: [],
  },
  status: {
    type: Object,
    default: {},
  },
  orderNumber: {
    type: Number,
    default: 0,
  },
  orderNumberCoApproval: {
    type: Number,
    default: 0,
  },
  approveUserDataLog: {
    type: Object,
    default: {},
  },
  approveUserDataLogCoApproval: {
    type: Object,
    default: {},
  },
  companyName: {
    type: String,
    default: "",
  },
  channelName: {
    type: String,
    default: "",
  },
  draftIndex: {
    type: Number,
    default: 0,
  },
  arUpdateDate: {
    type: Date,
    default: null,
  },
  arMasterUpdatedate: {
    type: Date,
    default: null,
  },
  actionLog: {
    type: Array,
    default: [],
  },
  changeData: {
    type: Object,
    default: {},
  },
  doaUserInJob: {
    type: Array,
    default: [],
  },
  isArMasterApproved: {
    type: Boolean,
    default: false,
  },
  statusCoApproval: {
    type: Object,
    default: {},
  },
  isWatingCustomerId: {
    type: Boolean,
    default: false,
  },
  arMasterId: {
    type: String,
    default: "",
  },
  customerId: {
    type: String,
    default: "",
  },
  completedDate: {
    type: Date,
    default: null,
  },
  requesterUser: {
    type: Object,
    default: {},
  },
  jobChange: {
    type: Array,
    default: [],
  },
  taxId: {
    type: String,
    default: "",
  },
});

// Create an index on the 'email' field for faster queries
// jobSchema.index({ email: 1 });
jobSchema.index({ jobNumber: "text" });
// Create the Job model based on the schema
const Job = mongoose.model("Job", jobSchema);

// Export the Job model
module.exports = Job;
