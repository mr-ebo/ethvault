const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const stakingDashboardAbi = require("../../lib/abis/stakingDashboard.json");
const {ethers} = require("ethers");

const STAKING_DASHBOARD_ADDRESS = "0xd33e9676463597AfFF5bB829796836631F4e2f1f";

exports.topStakers = asyncErrorHandler(async (req, res) => {
    const n = parseInt(req.query.n) || 10;
    const provider = ethers.getDefaultProvider(process.env.ETHERS_PROVIDER_URL);
    const contract = new ethers.Contract(
        STAKING_DASHBOARD_ADDRESS,
        stakingDashboardAbi,
        provider
    );
    const {stakerAddresses, stakedAmounts, percentageOfTotal} = await contract.getLeaderboard(n);
    const rankings = stakerAddresses.map((address, i) => ({
        address,
        amount: Number(ethers.formatEther(stakedAmounts[i])),
        percentage: Number(percentageOfTotal[i]) / 100,
    }));

    res.json({success: true, rankings});
});