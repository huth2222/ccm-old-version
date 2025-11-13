const express = require("express");
const router = express.Router();

/* http://localhost:3000/api/v1 */
router.get("/", function (req, res, next) {
  res.status(200).json({
    status_code: 200,
    version: "1.0.0",
  });
});

module.exports = router;
