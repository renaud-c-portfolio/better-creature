const express = require('express'); 
const router = express.Router();

/*
const loginHandler = require('./handlers/loginHandler');
const createUser = require('./handlers/createUser');
const autoLoginHandler = require('./handlers/autoLoginHandler');
const logoutHandler = require('./handlers/logoutHandler');
const uploadEditPack = require('./handlers/uploadEditPack');
const getUserPacks = require('./handlers/getUserPacks');
const downloadBasicPacks = require('./handlers/downloadBasicPacks'); 
*/
router.use(express.json()); 
/*
router.post('/login', loginHandler);  

router.get('/logout', logoutHandler); 
router.get('/autologin', autoLoginHandler);  
router.post('/register', createUser); 
router.post('/uploadPack', uploadEditPack); 
router.get('/userPacks', getUserPacks); 
router.get('/basicPacks', downloadBasicPacks);  
//router.get('/teamPacks/:teamId', null); 

 

router.all("*", (req, res) => {
    res.status(404).json({
    status: 404,
    message: "wrong endpoint. point to another end",
    });
})*/

module.exports = router;