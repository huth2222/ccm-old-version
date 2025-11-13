const Customer = require("../models/Customer");
exports.index = async (req, res, next) => {
  try {
    const { dist_chan } = req.body;

    if (dist_chan === undefined) {
      const customer = await Customer.find({});
      if (customer) {
        return res.status(200).json({
          data: customer,
          status_code: 200,
        });
      } else {
        return res.status(400).json({
          status_code: 400,
          message: "Error. Please try again.!",
        });
      }
    } else if (
      dist_chan === "10" ||
      dist_chan === "20" ||
      dist_chan === "30" ||
      dist_chan === "40" ||
      dist_chan === "50" ||
      dist_chan === "60"
    ) {
      const customer = await Customer.find({ DistChan: dist_chan });
      if (customer) {
        return res.status(200).json({
          data: customer,
          status_code: 200,
        });
      } else {
        return res.status(400).json({
          status_code: 400,
          message: "Error. Please try again.!",
        });
      }
    } else {
      return res.status(400).json({
        status_code: 400,
        message: "No data found",
      });
    }
  } catch (error) {
    next(error);
  }
};
