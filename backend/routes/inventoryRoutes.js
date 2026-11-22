const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.listItems);
router.post('/', inventoryController.storeItem);
router.put('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.removeItem);

module.exports = router;