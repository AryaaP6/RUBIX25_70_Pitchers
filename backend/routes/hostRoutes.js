const express = require('express');
const router = express.Router();
const AuthHelper = require('../helper/JWTAuthHelper');
const TryCatch = require('../helper/TryCatch');
const Messages = require('../constants/Message');
const hostController = require('../controllers/hostController');

//imports here

//code here

//Entity - Host --start
//Authentication - Host
router.post('/register', new TryCatch(hostController.apiRegister).tryCatchGlobe());
router.post('/login', new TryCatch(hostController.apiLogin).tryCatchGlobe());

//CRUD Operations - Host
router.post('/does-email-exists', AuthHelper.verifyToken, new TryCatch(hostController.doesEmailExist).tryCatchGlobe());
router.get('/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(hostController.getById).tryCatchGlobe());
router.get('/get-by-email/:email', AuthHelper.verifyToken, new TryCatch(hostController.getByEmail).tryCatchGlobe());
router.get('/get-all', AuthHelper.verifyToken, new TryCatch(hostController.getAllHosts).tryCatchGlobe());
router.delete('/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(hostController.deleteById).tryCatchGlobe());
router.post("/update-by-id/:id", AuthHelper.verifyToken, new TryCatch(hostController.updateById).tryCatchGlobe());
router.post("/update-by-email/:email", new TryCatch(hostController.updateByEmail).tryCatchGlobe());
//Entity - Host - End

module.exports = router;