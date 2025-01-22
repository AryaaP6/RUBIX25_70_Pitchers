const express = require('express');
const router = express.Router();

//imports here
const hostRoutes = require("./hostRoutes");
const donorRoutes = require("./donorRoutes");

//code here
router.use("/host", hostRoutes);
router.use("/donor", donorRoutes);
router.get("/health-check", (req,res)=>{
  res.json("Server Health: OK");
})

module.exports = router;