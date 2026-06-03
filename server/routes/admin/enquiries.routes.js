const express = require('express');
const router = express.Router();
const enquiriesController = require('../../controllers/admin/enquiries.controller');
const { verifyToken } = require('../../middleware/auth'); // ensure RBAC is checked in verifyToken or an additional middleware

// Apply authentication middleware to all admin routes
router.use(verifyToken);

// CRUD Routes for Admin Enquiries
router.get('/', enquiriesController.getAllEnquiries);
router.get('/:id', enquiriesController.getEnquiryById);
router.post('/', enquiriesController.createEnquiry);
router.put('/:id', enquiriesController.updateEnquiry);
router.delete('/:id', enquiriesController.deleteEnquiry);

module.exports = router;
