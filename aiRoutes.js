const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');
const {
  freeModel,
  premiumModel,
  purgeCache
} = require('../controllers/aiController');

// Sab logged-in users access kar saktay hain
router.get('/free-model', protect, freeModel);

// Sirf Premium_User aur Admin
router.post('/premium-model', protect, restrictTo('Premium_User', 'Admin'), premiumModel);

// Sirf Admin
router.delete('/purge-cache', protect, restrictTo('Admin'), purgeCache);

module.exports = router;