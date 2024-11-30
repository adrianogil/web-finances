
let currentMonth = 10; // October (10th month)
let year = 2024;

let currentRecordsData = {
    records: []
}


function changeMonth(direction) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    currentMonth += direction;

    if (currentMonth < 1) {
      currentMonth = 12; // go to December
      year = year - 1;
    } else if (currentMonth > 12) {
      currentMonth = 1; // go to January
      year = year + 1;
    }

    const prevMonth = currentMonth - 1 < 1 ? 12 : currentMonth - 1;
    const nextMonth = currentMonth + 1 > 12 ? 1 : currentMonth + 1;

    document.getElementById("currentMonth").textContent = `${monthNames[currentMonth - 1]} ${year}`;
    document.getElementById("prevMonthBtn").textContent = `◀ ${monthNames[prevMonth - 1]} ${year}`;
    document.getElementById("nextMonthBtn").textContent = `${monthNames[nextMonth - 1]} ${year} ▶`;

    // Update financial records for the selected month
    fetchFinancialRecords(currentMonth, year);
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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

        const accountSelect = document.getElementById('account');
        accountSelect.innerHTML = '<option value="" disabled selected>Conta</option>'; // Reset dropdown

        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id; // Assuming 'id' is the unique identifier
            option.textContent = account.name;
            accountSelect.appendChild(option);
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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="" disabled selected>Categoria</option>'; // Reset dropdown

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Assuming 'id' is the unique identifier
            option.textContent = category.name;
            categorySelect.appendChild(option);
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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

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

async function fetchFinancialRecords(month, year) {
    try {
        const response = await fetch(`/api/financial-records?month=${month}&year=${year}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

        if (!response.ok) {
            throw new Error('Erro ao carregar registros financeiros.');
        }

        const financialRecords = await response.json();
        currentRecordsData.records = financialRecords;
        updateFinancialRecordsTable(financialRecords);
    } catch (error) {
        console.error('Erro ao buscar registros financeiros:', error);
        alert('Erro ao carregar registros financeiros. Por favor, tente novamente.');
    }
}


function updateFinancialRecordsTable(records) {
    financialRecordsList.innerHTML = ''; // Limpa a lista atual
    let totalBalance = 0; // Variável para calcular o saldo total

    records.forEach(record => {
        const row = document.createElement('tr');

        // Data
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(record.date).toLocaleDateString('pt-BR');
        row.appendChild(dateCell);

        // Tipo (Receita ou Despesa)
        const typeCell = document.createElement('td');
        const typeSpan = document.createElement('span');
        typeSpan.textContent = record.type;
        typeSpan.style.color = record.type === 'Receita' ? 'green' : 'red';
        typeCell.appendChild(typeSpan);
        row.appendChild(typeCell);

        // Descrição
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = record.description;
        row.appendChild(descriptionCell);

        // Conta
        const accountCell = document.createElement('td');
        accountCell.textContent = record.account.name;
        row.appendChild(accountCell);

        // Categoria
        const categoryCell = document.createElement('td');
        categoryCell.textContent = record.category.name;
        row.appendChild(categoryCell);

        // Valor
        const amountCell = document.createElement('td');
        const amount = parseFloat(record.amount);
        amountCell.textContent = `${record.type === 'Receita' ? '+' : '-'}R$ ${amount.toFixed(2)}`;
        amountCell.style.color = record.type === 'Receita' ? 'green' : 'red';
        row.appendChild(amountCell);

        // Atualiza o saldo total
        totalBalance += amount;

        // Botão Excluir
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteFinancialRecord(record.id);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        financialRecordsList.appendChild(row);
    });

    // Atualiza o texto do Saldo Total
    const totalBalanceElement = document.querySelector('.saldo-total span');
    totalBalanceElement.textContent = `R$ ${totalBalance.toFixed(2)}`;
    // Change color based on positive or negative balance
    totalBalanceElement.style.color = totalBalance >= 0 ? 'green' : 'red';

    updateCharts(records);
}


async function deleteFinancialRecord(recordId) {
    if (!confirm('Tem certeza de que deseja excluir este registro financeiro?')) return;

    try {
        const response = await fetch(`/api/financial-records/${recordId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            logout()
            return; // Stop further execution
        }

        if (!response.ok) {
            throw new Error('Erro ao excluir registro financeiro.');
        }

        alert('Registro financeiro excluído com sucesso!');
        fetchFinancialRecords(currentMonth, year); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir registro financeiro:', error);
        alert('Erro ao excluir registro financeiro. Por favor, tente novamente.');
    }
}

// Function to fetch records data and update the pie and line charts
function updateCharts(records) {
    const categories = {};
    const dates = [];
    const balances = [];
    let totalBalance = 0;

    records.forEach(record => {
        const type = record.type;
        const category = record.category.name;
        let amount = parseFloat(record.amount);
        // console.log(amount);
        const date = new Date(record.date).toLocaleDateString('pt-BR');

        // Only consider expenses (Despesa) for the pie chart
        if (type === 'Despesa') {
            if (!categories[category]) {
                categories[category] = 0;
            }
            categories[category] += Math.abs(amount); // Use absolute value for expenses
        }

        // For balance chart, track overall balance over time
        totalBalance += amount;
        dates.push(date);
        balances.push(totalBalance);
    });

    // Prepare data for the pie chart
    const categoryLabels = Object.keys(categories);
    const categoryValues = Object.values(categories);

    // Update the pie chart data
    reportChart.data.labels = categoryLabels;
    reportChart.data.datasets[0].data = categoryValues;
    reportChart.update();

    // Update the line chart data (balance over time)
    balanceChart.data.labels = dates;
    balanceChart.data.datasets[0].data = balances;
    balanceChart.update();
}


// Carrega as contas ao inicializar
fetchAccounts();

// Carrega as categorias ao inicializar
fetchCategories();

// Carrega os registros financeiros ao inicializar
fetchFinancialRecords(currentMonth, year);
