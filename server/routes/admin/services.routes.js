const express = require('express');
const router = express.Router();
const servicesController = require('../../controllers/admin/services.controller');
const { verifyToken } = require('../../middleware/auth'); // ensure RBAC is checked in verifyToken or an additional middleware

// Apply authentication middleware to all admin routes
router.use(verifyToken);

// CRUD Routes for Admin Services
router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;
