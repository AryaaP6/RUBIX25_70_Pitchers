const express = require('express');
const router = express.Router();
const AuthHelper = require('../helper/JWTAuthHelper');
const TryCatch = require('../helper/TryCatch');
const Messages = require('../constants/Message');
const donorController = require('../controllers/donorController');

//imports here

//code here

//Entity - Donor --start
//Authentication - Donor
router.post('/register', new TryCatch(donorController.apiRegister).tryCatchGlobe());
router.post('/login', new TryCatch(donorController.apiLogin).tryCatchGlobe());

//CRUD Operations - Donor
router.post('/does-email-exists', AuthHelper.verifyToken, new TryCatch(donorController.doesEmailExist).tryCatchGlobe());
router.get('/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(donorController.getById).tryCatchGlobe());
router.get('/get-by-email/:email', AuthHelper.verifyToken, new TryCatch(donorController.getByEmail).tryCatchGlobe());
router.get('/get-all', AuthHelper.verifyToken, new TryCatch(donorController.getAllDonors).tryCatchGlobe());
router.delete('/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(donorController.deleteById).tryCatchGlobe());
router.post("/update-by-id/:id", AuthHelper.verifyToken, new TryCatch(donorController.updateById).tryCatchGlobe());
router.post("/update-by-email/:email", new TryCatch(donorController.updateByEmail).tryCatchGlobe());
//Entity - Donor - End

module.exports = router;