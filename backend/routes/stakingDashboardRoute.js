const express = require("express");
const {
    topStakers,
} = require("../controllers/stakingDashboardController");

const router = express.Router();

router.route("/top-stakers").get(topStakers);

module.exports = router;
