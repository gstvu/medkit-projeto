const inventoryModel = require('../models/inventoryModel');

function listItems(req, res) {
  const items = inventoryModel.getAllItems();
  return res.json(items);
}

function storeItem(req, res) {
  const { name, category, type, qty, minQty, expiration, cooling, price } = req.body;

  if (!name || !category || qty === undefined) {
    return res.status(400).json({
      error: 'Os campos "name", "category" e "qty" são obrigatórios.'
    });
  }

  const parsedQty = Number(qty);
  if (Number.isNaN(parsedQty) || parsedQty < 0) {
    return res.status(400).json({
      error: 'O campo "qty" deve ser um número maior ou igual a 0.'
    });
  }

  const created = inventoryModel.createItem({
    name: String(name).trim(),
    category: String(category).trim(),
    type: type ? String(type).trim() : '',
    qty: parsedQty,
    minQty: minQty !== undefined && !Number.isNaN(Number(minQty)) ? Number(minQty) : 10,
    expiration: expiration || '',
    cooling: Boolean(cooling),
    price: price !== undefined && !Number.isNaN(Number(price)) ? Number(price) : 0
  });

  return res.status(201).json(created);
}

function updateItem(req, res) {
  const id = Number(req.params.id);
  const { name, category, type, qty, minQty, expiration, cooling, price } = req.body;

  if (qty !== undefined && (Number.isNaN(Number(qty)) || Number(qty) < 0)) {
    return res.status(400).json({
      error: 'O campo "qty" deve ser um número maior ou igual a 0.'
    });
  }

  const updates = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (category !== undefined) updates.category = String(category).trim();
  if (type !== undefined) updates.type = String(type).trim();
  if (qty !== undefined) updates.qty = Number(qty);
  if (minQty !== undefined && !Number.isNaN(Number(minQty))) updates.minQty = Number(minQty);
  if (expiration !== undefined) updates.expiration = expiration;
  if (cooling !== undefined) updates.cooling = Boolean(cooling);
  if (price !== undefined && !Number.isNaN(Number(price))) updates.price = Number(price);

  const updated = inventoryModel.updateItemById(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Item não encontrado no estoque.' });
  }

  return res.json(updated);
}

function removeItem(req, res) {
  const id = Number(req.params.id);
  const deleted = inventoryModel.deleteItemById(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Item não encontrado no estoque.' });
  }

  return res.json({
    message: 'Item removido com sucesso.',
    item: deleted
  });
}

module.exports = {
  listItems,
  storeItem,
  updateItem,
  removeItem
};