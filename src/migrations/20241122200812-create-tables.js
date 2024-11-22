'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela User
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      creation_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
      },
      subscription_status: {
        type: Sequelize.ENUM('Free Trial', 'Premium'),
        defaultValue: 'Free Trial',
      },
      preferences: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela Account
    await queryInterface.createTable('Account', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('Conta Corrente', 'Cartão de Crédito', 'Outro'),
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela Category
    await queryInterface.createTable('Category', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela Subscription
    await queryInterface.createTable('Subscription', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      plan_type: {
        type: Sequelize.ENUM('Free', 'Premium'),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela LoginHistory
    await queryInterface.createTable('LoginHistory', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      login_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      device: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      browser: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela PreferenceSetting
    await queryInterface.createTable('PreferenceSetting', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      language: {
        type: Sequelize.ENUM('pt-BR', 'en-US', 'es-ES'),
        defaultValue: 'pt-BR',
      },
      currency: {
        type: Sequelize.ENUM('BRL', 'USD', 'EUR'),
        defaultValue: 'BRL',
      },
      theme: {
        type: Sequelize.ENUM('Claro', 'Escuro'),
        defaultValue: 'Claro',
      },
      notifications: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Criação da tabela FinancialRecord
    await queryInterface.createTable('FinancialRecord', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM('Receita', 'Despesa'),
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        account_id: {
          type: Sequelize.INTEGER,
          allowNull: true, // Permite valores nulos para compatibilidade com SET NULL
          references: {
            model: 'Account',
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: true, // Permite valores nulos para compatibilidade com SET NULL
          references: {
            model: 'Category',
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    // Exclusão das tabelas em ordem reversa
    await queryInterface.dropTable('FinancialRecord');
    await queryInterface.dropTable('PreferenceSetting');
    await queryInterface.dropTable('LoginHistory');
    await queryInterface.dropTable('Subscription');
    await queryInterface.dropTable('Category');
    await queryInterface.dropTable('Account');
    await queryInterface.dropTable('User');
  },
};
