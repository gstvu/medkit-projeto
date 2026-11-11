// ==========================================
// DADOS MOCKADOS (Simulando o Banco de Dados)
// DICA DE INTEGRAÇÃO: O back-end fornecerá estes dados via uma rota GET (ex: /api/estoque)
// ==========================================
let inventory = [
    { id: 1, name: 'Clonazepam', category: 'Medicamento', type: 'Controlados', qty: 50, minQty: 10, expiration: '2025-12-01', cooling: false, price: 15.50 },
    { id: 2, name: 'Dipirona', category: 'Medicamento', type: 'Regulares', qty: 5, minQty: 20, expiration: '2024-05-15', cooling: false, price: 2.00 }, // Estoque baixo e quase vencendo
    { id: 3, name: 'Noradrenalina', category: 'Anestésico', type: 'Restritos', qty: 15, minQty: 10, expiration: '2024-11-20', cooling: true, price: 45.00 },
    { id: 4, name: 'BCG', category: 'Vacina', type: 'Infantil', qty: 120, minQty: 50, expiration: '2026-01-10', cooling: true, price: 30.00 },
    { id: 5, name: 'Luvas de Procedimento', category: 'Equipamento', type: 'Proteção Individual e Biossegurança', qty: 0, minQty: 100, expiration: '', cooling: false, price: 25.00 }, // Faltando
];

// ==========================================
// MAPEAMENTO DE CATEGORIAS (Baseado nas imagens da Planilha)
// ==========================================
const subcategoriesMap = {
    'Medicamento': ['Controlados', 'Regulares', 'Uso Supervisionado'],
    'Anestésico': ['Restritos', 'Regulares'],
    'Vacina': ['Infantil', 'Adulto'],
    'Equipamento': [
        'Proteção Individual e Biossegurança',
        'Acesso Venoso e Infusão',
        'Cuidados Respiratórios e Ventilação',
        'Curativos e Cuidados com Feridas',
        'Sondagem, Drenagem e Eliminação',
        'Materiais Cirúrgicos e de Campo Operatório'
    ]
};

// Função que atualiza as opções do <select> de Subtipos dependendo da Categoria escolhida
function updateSubcategories(selectedType = null) {
    const categorySelect = document.getElementById('item-category');
    const typeInput = document.getElementById('item-type');
    const typeOptions = document.getElementById('type-options');
    const selectedCategory = categorySelect.value;
    
    // Limpa as opções atuais
    if(typeOptions) typeOptions.innerHTML = '';
    
    // Muda o texto do título (label) para ficar super claro e intuitivo para o usuário!
    const labelType = document.getElementById('label-item-type');
    if(labelType) {
        if(selectedCategory === 'Medicamento') labelType.innerText = 'Controle do Medicamento *';
        else if(selectedCategory === 'Anestésico') labelType.innerText = 'Classificação do Anestésico *';
        else if(selectedCategory === 'Vacina') labelType.innerText = 'Público Alvo da Vacina *';
        else if(selectedCategory === 'Equipamento') labelType.innerText = 'Tipo / Área do Equipamento *';
        else labelType.innerText = 'Subcategoria *';
    }

    // Pega a lista correspondente no mapeamento ou deixa vazio
    const options = subcategoriesMap[selectedCategory] || [];
    
    if(typeOptions) {
        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt;
            typeOptions.appendChild(optionEl);
        });
    }

    // Se for modo edição, preenche o campo. Se não, limpa para o usuário digitar.
    if(typeInput) {
        if (typeof selectedType === 'string') {
            typeInput.value = selectedType;
        } else {
            typeInput.value = '';
        }
    }
}

// Lógica de Vencimento
const hoje = new Date();
const trintaDias = new Date();
trintaDias.setDate(hoje.getDate() + 30);

function checkStatus(item) {
    let statuses = [];
    if (item.qty === 0) statuses.push({ label: 'Em Falta', color: 'bg-red-100 text-red-700' });
    else if (item.qty <= item.minQty) statuses.push({ label: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-700' });
    
    if (item.expiration) {
        const expDate = new Date(item.expiration);
        if (expDate < hoje) statuses.push({ label: 'Vencido', color: 'bg-red-600 text-white' });
        else if (expDate <= trintaDias) statuses.push({ label: 'Vence em < 30 dias', color: 'bg-orange-100 text-orange-700' });
    }

    if (statuses.length === 0) statuses.push({ label: 'Normal', color: 'bg-green-100 text-green-700' });
    return statuses;
}

// ==========================================
// CONTROLE DE TELAS (Navegação)
// ==========================================
function handleLogin(event) {
    event.preventDefault();
    // DICA DE INTEGRAÇÃO COM BACK-END:
    // Aqui vocês farão um POST para '/api/login' passando os dados do form.
    // fetch('/api/login', { method: 'POST', body: ... })
    
    document.getElementById('login-view').classList.add('hidden-view');
    document.getElementById('sidebar').classList.remove('hidden-view');
    document.getElementById('main-content').classList.remove('hidden-view');
    
    // Inicia na Dashboard
    updateDashboard();
    switchTab('dashboard');
}

function handleLogout() {
    document.getElementById('login-view').classList.remove('hidden-view');
    document.getElementById('sidebar').classList.add('hidden-view');
    document.getElementById('main-content').classList.add('hidden-view');
    document.getElementById('login-form').reset();
}

function switchTab(tabId) {
    // Esconde tudo
    document.getElementById('view-dashboard').classList.add('hidden-view');
    document.getElementById('view-inventory').classList.add('hidden-view');
    
    // Reseta botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-medred-600', 'bg-red-50');
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    });

    // Mostra o ativo
    if (tabId === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden-view');
        document.getElementById('btn-dashboard').classList.add('text-medred-600', 'bg-red-50');
        document.getElementById('btn-dashboard').classList.remove('text-gray-600');
        document.getElementById('page-title').innerText = 'Dashboard';
        updateDashboard();
    } else if (tabId === 'inventory') {
        document.getElementById('view-inventory').classList.remove('hidden-view');
        document.getElementById('btn-inventory').classList.add('text-medred-600', 'bg-red-50');
        document.getElementById('btn-inventory').classList.remove('text-gray-600');
        document.getElementById('page-title').innerText = 'Estoque Geral';
        renderInventory();
    }
}

// ==========================================
// LÓGICA DO DASHBOARD
// ==========================================
function updateDashboard() {
    const total = inventory.length;
    const lowStock = inventory.filter(i => i.qty <= i.minQty).length;
    const expiring = inventory.filter(i => {
        if(!i.expiration) return false;
        const d = new Date(i.expiration);
        return d <= trintaDias;
    }).length;

    document.getElementById('dash-total').innerText = total;
    document.getElementById('dash-low').innerText = lowStock;
    document.getElementById('dash-expiring').innerText = expiring;

    // Preencher tabela de alertas
    const tbody = document.getElementById('alerts-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = '';
    
    let alertItems = inventory.filter(i => checkStatus(i).some(s => s.label !== 'Normal'));
    
    if (alertItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-gray-500">Nenhum alerta no momento.</td></tr>`;
    } else {
        alertItems.forEach(item => {
            let statuses = checkStatus(item).filter(s => s.label !== 'Normal');
            let statusTags = statuses.map(s => `<span class="text-xs font-semibold px-2 py-1 rounded-full ${s.color}">${s.label}</span>`).join(' ');
            
            let tr = document.createElement('tr');
            tr.className = "border-b border-gray-100 last:border-0";
            tr.innerHTML = `
                <td class="py-3 px-4 font-medium text-gray-800">${item.name}</td>
                <td class="py-3 px-4">${statusTags}</td>
                <td class="py-3 px-4">
                    <button onclick="switchTab('inventory')" class="text-medred-500 hover:text-medred-700 text-sm font-medium">Ver no estoque</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// ==========================================
// LÓGICA DO ESTOQUE (Tabela, Filtros e PESQUISA)
// ==========================================

// Listener que exibe o filtro de subcategoria quando uma Categoria Principal é selecionada
const filterCategory = document.getElementById('filter-category');
if(filterCategory) {
    filterCategory.addEventListener('change', function() {
        const cat = this.value;
        const subFilter = document.getElementById('filter-subcategory');
        
        if (cat === 'all') {
            subFilter.classList.add('hidden-view'); // Esconde se for "Todas Categorias"
            subFilter.value = 'all';
        } else {
            subFilter.classList.remove('hidden-view'); // Mostra se uma categoria específica for escolhida
            subFilter.innerHTML = '<option value="all">Todos os Tipos</option>';
            const options = subcategoriesMap[cat] || [];
            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt;
                el.textContent = opt;
                subFilter.appendChild(el);
            });
        }
    });
}

function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = '';

    // Lê os valores de todos os campos de filtro e pesquisa
    const searchFilter = document.getElementById('search-item') ? document.getElementById('search-item').value.toLowerCase() : '';
    const catFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    const subFilter = document.getElementById('filter-subcategory') ? document.getElementById('filter-subcategory').value : 'all';

    let filtered = inventory.filter(item => {
        // Verifica a pesquisa por texto (Nome do item)
        let passSearch = searchFilter === '' || item.name.toLowerCase().includes(searchFilter);
        
        let passCat = catFilter === 'all' || item.category === catFilter;
        let passSub = subFilter === 'all' || (item.type && item.type.toLowerCase() === subFilter.toLowerCase());
        
        let passStatus = true;
        if (statusFilter === 'low') passStatus = item.qty <= item.minQty;
        if (statusFilter === 'expiring') {
            if (!item.expiration) passStatus = false;
            else {
                const d = new Date(item.expiration);
                passStatus = d <= trintaDias;
            }
        }
        if (statusFilter === 'cooling') passStatus = item.cooling === true;

        // O item só aparece se passar em TODOS os testes (Pesquisa + Filtros)
        return passSearch && passCat && passSub && passStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-500">Nenhum item encontrado com estes filtros ou nome.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        let statuses = checkStatus(item);
        let statusHtml = statuses.map(s => `<span class="inline-block text-xs font-semibold px-2 py-1 rounded-full ${s.color} mb-1">${s.label}</span>`).join('<br>');
        
        let dateStr = '-';
        if(item.expiration) {
            const [y, m, d] = item.expiration.split('-');
            dateStr = `${d}/${m}/${y}`;
        }

        let iconCooling = item.cooling ? '<i class="fa-solid fa-snowflake text-blue-400 ml-2" title="Requer Resfriamento"></i>' : '';

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-3 px-6">
                <p class="font-bold text-gray-800">${item.name} ${iconCooling}</p>
            </td>
            <td class="py-3 px-6 text-sm text-gray-600">
                ${item.category} <span class="text-xs text-gray-400 block">${item.type}</span>
            </td>
            <td class="py-3 px-6 text-center text-sm font-medium ${item.qty === 0 ? 'text-red-500' : 'text-gray-800'}">${item.qty}</td>
            <td class="py-3 px-6 text-sm text-gray-600">${dateStr}</td>
            <td class="py-3 px-6">${statusHtml}</td>
            <td class="py-3 px-6 text-center">
                <button onclick="editItem(${item.id})" class="text-blue-500 hover:text-blue-700 mx-1 p-2" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteItem(${item.id})" class="text-red-500 hover:text-red-700 mx-1 p-2" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// LÓGICA DO CRUD (Modal)
// ==========================================
function openModal(id = null) {
    document.getElementById('item-modal').classList.remove('hidden-view');
    
    if (id) {
        // Editando item existente
        document.getElementById('modal-title').innerText = 'Editar Item';
        const item = inventory.find(i => i.id === id);
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-category').value = item.category;
        
        // Atualiza os subtipos ANTES de preencher o valor selecionado
        updateSubcategories(item.type);
        
        document.getElementById('item-qty').value = item.qty;
        document.getElementById('item-expiration').value = item.expiration;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-cooling').checked = item.cooling;
    } else {
        // Novo item
        document.getElementById('modal-title').innerText = 'Cadastrar Novo Item';
        document.getElementById('item-form').reset();
        document.getElementById('item-id').value = '';
        
        // Carrega os subtipos iniciais (da primeira categoria selecionada por padrão)
        updateSubcategories();
    }
}

function closeModal() {
    document.getElementById('item-modal').classList.add('hidden-view');
}

function saveItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('item-id').value;
    const newItem = {
        id: id ? parseInt(id) : Date.now(), // Gera ID provisório
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        qty: parseInt(document.getElementById('item-qty').value),
        minQty: 10, // Default para exemplo
        expiration: document.getElementById('item-expiration').value,
        price: parseFloat(document.getElementById('item-price').value) || 0,
        type: document.getElementById('item-type').value,
        cooling: document.getElementById('item-cooling').checked
    };

    // DICA DE INTEGRAÇÃO COM BACK-END:
    // Aqui você usará fetch() com método POST (novo) ou PUT (edição)
    // fetch(id ? `/api/estoque/${id}` : '/api/estoque', { method: id ? 'PUT' : 'POST', body: JSON.stringify(newItem) })

    if (id) {
        // Atualiza localmente
        const index = inventory.findIndex(i => i.id === parseInt(id));
        inventory[index] = newItem;
    } else {
        // Adiciona localmente
        inventory.push(newItem);
    }

    closeModal();
    
    // Limpa a barra de pesquisa ao salvar um item novo para garantir que ele apareça na lista
    if(document.getElementById('search-item')) {
        document.getElementById('search-item').value = '';
    }
    
    renderInventory();
    updateDashboard(); // Atualiza contadores
    
    // Simula um modal de sucesso ao invés de alert
    const msg = document.createElement('div');
    msg.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity';
    msg.innerText = 'Item salvo com sucesso!';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

function editItem(id) {
    openModal(id);
}

function deleteItem(id) {
    // Mensagem de confirmação customizada (evitando alerts e confirms nativos conforme boas práticas)
    const confirmBox = document.createElement('div');
    confirmBox.className = 'fixed inset-0 modal-bg z-[60] flex items-center justify-center p-4';
    confirmBox.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Excluir Item?</h3>
            <p class="text-gray-600 mb-6">Tem certeza que deseja remover este item do estoque? Esta ação não pode ser desfeita.</p>
            <div class="flex gap-3 justify-center">
                <button id="cancel-del" class="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg">Cancelar</button>
                <button id="confirm-del" class="px-4 py-2 text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg shadow-sm">Sim, Excluir</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmBox);

    document.getElementById('cancel-del').onclick = () => confirmBox.remove();
    document.getElementById('confirm-del').onclick = () => {
        // DICA DE INTEGRAÇÃO COM BACK-END:
        // fetch(`/api/estoque/${id}`, { method: 'DELETE' })
        
        inventory = inventory.filter(i => i.id !== id);
        renderInventory();
        updateDashboard();
        confirmBox.remove();
    };
}