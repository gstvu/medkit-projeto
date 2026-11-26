const inventoryModel = require('../models/inventoryModel');

// GET /api/estoque - Lista todos os itens do banco de dados
async function listItems(req, res) {
  try {
    const items = await inventoryModel.getAllItems();
    return res.json(items);
  } catch (error) {
    console.error('Erro ao listar itens do estoque:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar itens no banco de dados.' });
  }
}

// POST /api/estoque - Cadastra um novo item no banco de dados
async function storeItem(req, res) {
  try {
    const { name, category, type, qty, minQty, expiration, cooling, generic, price } = req.body;

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

    const created = await inventoryModel.createItem({
      name: String(name).trim(),
      category: String(category).trim(),
      type: type ? String(type).trim() : '',
      qty: parsedQty,
      minQty: minQty !== undefined && !Number.isNaN(Number(minQty)) ? Number(minQty) : 10,
      expiration: expiration || null,
      cooling: Boolean(cooling),
      generic: Boolean(generic),
      price: price !== undefined && !Number.isNaN(Number(price)) ? Number(price) : 0
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar item no banco de dados.' });
  }
}

// PUT /api/estoque/:id - Atualiza um item existente
async function updateItem(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, category, type, qty, minQty, expiration, cooling, generic, price } = req.body;

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
    if (expiration !== undefined) updates.expiration = expiration || null;
    if (cooling !== undefined) updates.cooling = Boolean(cooling);
    if (generic !== undefined) updates.generic = Boolean(generic);
    if (price !== undefined && !Number.isNaN(Number(price))) updates.price = Number(price);

    const updated = await inventoryModel.updateItemById(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Item não encontrado no estoque.' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar item no banco de dados.' });
  }
}

// DELETE /api/estoque/:id - Remove um item do estoque
async function removeItem(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = await inventoryModel.deleteItemById(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Item não encontrado no estoque.' });
    }

    return res.json({
      message: 'Item removido com sucesso.',
      item: deleted
    });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir item no banco de dados.' });
  }
}

module.exports = {
  listItems,
  storeItem,
  updateItem,
  removeItem
};