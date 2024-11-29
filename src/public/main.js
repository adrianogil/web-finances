let currentMonth = 10; // October (10th month)
let year = 2024;


function changeMonth(direction) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  currentMonth += direction;

  if (currentMonth < 1) {
    currentMonth = 12; // go to December
    year = year -1;
  } else if (currentMonth > 12) {
    currentMonth = 1; // go to January
    year = year + 1;
  }

  const prevMonth = currentMonth - 1 < 1 ? 12 : currentMonth - 1;
  const nextMonth = currentMonth + 1 > 12 ? 1 : currentMonth + 1;

  document.getElementById("currentMonth").textContent = `${monthNames[currentMonth - 1]} ${year}`;
  document.getElementById("prevMonthBtn").textContent = `◀ ${monthNames[prevMonth - 1]} ${year}`;
  document.getElementById("nextMonthBtn").textContent = `${monthNames[nextMonth - 1]} ${year} ▶`;

  // Call a function here to update your table with the correct month's data
  // For example, updateTableForMonth(currentMonth);
}

function logout() {
    alert("Você será desconectado. Até logo!");
    // Aqui você pode adicionar a lógica de logout real
    window.location.href = 'login.html';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // if (document.body.classList.contains('dark-mode')) {
    //     alert("Modo escuro ativado.");
    // } else {
    //     alert("Modo claro ativado.");
    // }
}

document.addEventListener('click', function(event) {
    const userInfo = document.querySelector('.user-info');
    const submenu = document.querySelector('.submenu');
    if (!userInfo.contains(event.target)) {
        submenu.style.visibility = 'hidden';
        submenu.style.opacity = 0;
        submenu.style.transform = 'translateY(-10px)';
    } else {
        submenu.style.visibility = 'visible';
        submenu.style.opacity = 1;
        submenu.style.transform = 'translateY(0)';
    }
});

const token = localStorage.getItem('jwtToken');

if (!token) {
    alert('Usuário não autenticado. Por favor, faça login.');
    window.location.href = 'login.html';
}

async function fetchAccounts() {
    try {
        const response = await fetch('/api/accounts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response);

        if (!response.ok) {
            throw new Error('Erro ao carregar contas.');
        }

        const accounts = await response.json();
        accountsList.innerHTML = '';

        accounts.forEach(account => {
            const listItem = document.createElement('li');
            listItem.textContent = account.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteAccount(account.id);

            listItem.appendChild(deleteButton);
            accountsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        alert('Erro ao carregar contas. Por favor, tente novamente.');
    }
}

async function addAccount(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const accountName = document.getElementById('accountName').value.trim();
    const accountType = document.getElementById('accountType').value.trim();

    if (!accountName || !accountType) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/api/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: accountName, type: accountType })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar conta.');
        }

        alert('Conta adicionada com sucesso!');
        fetchAccounts(); // Atualiza a lista de contas
        closeModal(); // Fecha o modal
    } catch (error) {
        console.error('Erro ao adicionar conta:', error);
        alert('Erro ao adicionar conta. Por favor, tente novamente.');
    }
}

async function deleteAccount(accountId) {
    if (!confirm('Tem certeza de que deseja excluir esta conta?')) return;

    try {
        const response = await fetch(`/api/accounts/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir conta.');
        }

        alert('Conta excluída com sucesso!');
        fetchAccounts(); // Atualiza a lista de contas
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao excluir conta. Por favor, tente novamente.');
    }
}

// Função para buscar categorias
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar categorias.');
        }

        const categories = await response.json();
        categoriesList.innerHTML = '';

        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.textContent = category.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteCategory(category.id);

            listItem.appendChild(deleteButton);
            categoriesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        alert('Erro ao carregar categorias. Por favor, tente novamente.');
    }
}

// Função para adicionar categoria
async function addCategory(event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value.trim();

    if (!categoryName) {
        alert('Por favor, preencha o nome da categoria.');
        return;
    }

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: categoryName })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar categoria.');
        }

        alert('Categoria adicionada com sucesso!');
        fetchCategories(); // Atualiza a lista de categorias
        closeCategoryModal(); // Fecha o modal
    } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria. Por favor, tente novamente.');
    }
}

// Função para excluir categoria
async function deleteCategory(categoryId) {
    if (!confirm('Tem certeza de que deseja excluir esta categoria?')) return;

    try {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir categoria.');
        }

        alert('Categoria excluída com sucesso!');
        fetchCategories(); // Atualiza a lista de categorias
    } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        alert('Erro ao excluir categoria. Por favor, tente novamente.');
    }
}

// Carrega as contas ao inicializar
fetchAccounts();

// Carrega as categorias ao inicializar
fetchCategories();