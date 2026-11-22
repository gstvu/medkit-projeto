let inventory = [
  { id: 1, name: 'Clonazepam', category: 'Medicamento', type: 'Controlados', qty: 50, minQty: 10, expiration: '2025-12-01', cooling: false, price: 15.50 },
  { id: 2, name: 'Dipirona', category: 'Medicamento', type: 'Regulares', qty: 5, minQty: 20, expiration: '2024-05-15', cooling: false, price: 2.00 },
  { id: 3, name: 'Noradrenalina', category: 'Anestésico', type: 'Restritos', qty: 15, minQty: 10, expiration: '2024-11-20', cooling: true, price: 45.00 },
  { id: 4, name: 'BCG', category: 'Vacina', type: 'Infantil', qty: 120, minQty: 50, expiration: '2026-01-10', cooling: true, price: 30.00 },
  { id: 5, name: 'Luvas de Procedimento', category: 'Equipamento', type: 'Proteção Individual e Biossegurança', qty: 0, minQty: 100, expiration: '', cooling: false, price: 25.00 }
];

function getAllItems() {
  return inventory;
}

function createItem(data) {
  const nextId = inventory.length > 0
    ? Math.max(...inventory.map(item => item.id)) + 1
    : 1;

  const newItem = {
    id: nextId,
    ...data
  };

  inventory.push(newItem);
  return newItem;
}

function updateItemById(id, updates) {
  const index = inventory.findIndex(item => item.id === id);
  if (index === -1) return null;

  inventory[index] = {
    ...inventory[index],
    ...updates
  };

  return inventory[index];
}

function deleteItemById(id) {
  const index = inventory.findIndex(item => item.id === id);
  if (index === -1) return null;

  const [deletedItem] = inventory.splice(index, 1);
  return deletedItem;
}

module.exports = {
  getAllItems,
  createItem,
  updateItemById,
  deleteItemById
};