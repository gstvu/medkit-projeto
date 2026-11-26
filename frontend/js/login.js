// ==========================================
// MEDKIT - LÓGICA DE AUTENTICAÇÃO (LOGIN)
// ==========================================

const API_URL = 'http://localhost:3000/api';

// Se o médico já estiver logado nesta aba, redireciona direto para frontend/pages/sistema.html
if (sessionStorage.getItem('medkit_user')) {
    window.location.href = 'frontend/pages/sistema.html';
}

async function handleLogin(event) {
    event.preventDefault();

    const crmInput = document.getElementById('crm').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorBox = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login');

    // Esconde erro anterior e mostra feedback de carregamento
    errorBox.classList.add('hidden-view');
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crm: crmInput,
                senha: passwordInput
            })
        });

        const data = await response.json();

        if (response.ok && data.user) {
            // Salva os dados do médico autorizado na sessão e abre o sistema na pasta pages/
            sessionStorage.setItem('medkit_user', JSON.stringify(data.user));
            window.location.href = 'frontend/pages/sistema.html';
        } else {
            // Mostra erro retornado pelo servidor (CRM ou senha incorretos)
            errorBox.innerText = data.message || 'CRM ou senha inválidos.';
            errorBox.classList.remove('hidden-view');
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        errorBox.innerText = 'Erro de conexão com o servidor. Verifique se o back-end está rodando.';
        errorBox.classList.remove('hidden-view');
    } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<span>Entrar no Sistema</span>';
    }
}