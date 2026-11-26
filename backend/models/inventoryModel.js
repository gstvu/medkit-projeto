const db = require('../config/db');

// Busca todos os itens cadastrados na tabela item_estoque do MySQL
async function getAllItems() {
  const [rows] = await db.query('SELECT * FROM item_estoque ORDER BY id ASC');
  return rows;
}

// Insere um novo item no banco de dados e retorna o registro criado
async function createItem(data) {
  const {
    name,
    category,
    type,
    qty,
    minQty,
    expiration,
    cooling,
    generic,
    price
  } = data;

  // MySQL exige NULL (e não string vazia '') para colunas do tipo DATE sem valor
  const expirationDate = expiration && String(expiration).trim() !== '' ? expiration : null;

  const [result] = await db.query(
    `INSERT INTO item_estoque 
      (name, category, type, qty, minQty, expiration, cooling, generic, price) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      category,
      type,
      qty,
      minQty,
      expirationDate,
      cooling ? 1 : 0,
      generic ? 1 : 0,
      price
    ]
  );

  const [rows] = await db.query('SELECT * FROM item_estoque WHERE id = ?', [result.insertId]);
  return rows[0];
}

// Atualiza um item existente pelo ID e retorna o registro atualizado
async function updateItemById(id, updates) {
  const [existingRows] = await db.query('SELECT * FROM item_estoque WHERE id = ?', [id]);
  if (existingRows.length === 0) return null;

  const current = existingRows[0];

  const updatedData = {
    name: updates.name !== undefined ? updates.name : current.name,
    category: updates.category !== undefined ? updates.category : current.category,
    type: updates.type !== undefined ? updates.type : current.type,
    qty: updates.qty !== undefined ? updates.qty : current.qty,
    minQty: updates.minQty !== undefined ? updates.minQty : current.minQty,
    expiration: updates.expiration !== undefined
      ? (updates.expiration && String(updates.expiration).trim() !== '' ? updates.expiration : null)
      : current.expiration,
    cooling: updates.cooling !== undefined ? (updates.cooling ? 1 : 0) : current.cooling,
    generic: updates.generic !== undefined ? (updates.generic ? 1 : 0) : current.generic,
    price: updates.price !== undefined ? updates.price : current.price
  };

  await db.query(
    `UPDATE item_estoque 
     SET name = ?, category = ?, type = ?, qty = ?, minQty = ?, expiration = ?, cooling = ?, generic = ?, price = ?
     WHERE id = ?`,
    [
      updatedData.name,
      updatedData.category,
      updatedData.type,
      updatedData.qty,
      updatedData.minQty,
      updatedData.expiration,
      updatedData.cooling,
      updatedData.generic,
      updatedData.price,
      id
    ]
  );

  const [rows] = await db.query('SELECT * FROM item_estoque WHERE id = ?', [id]);
  return rows[0];
}

// Remove um item do banco de dados pelo ID e retorna o item excluído
async function deleteItemById(id) {
  const [existingRows] = await db.query('SELECT * FROM item_estoque WHERE id = ?', [id]);
  if (existingRows.length === 0) return null;

  await db.query('DELETE FROM item_estoque WHERE id = ?', [id]);
  return existingRows[0];
}

module.exports = {
  getAllItems,
  createItem,
  updateItemById,
  deleteItemById
};