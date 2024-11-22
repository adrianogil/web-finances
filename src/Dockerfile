# Usando a imagem oficial do Node.js
FROM node:16

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar o Sequelize CLI globalmente
RUN npm install -g sequelize-cli

RUN npm install -g nodemon

# Copiar o código para dentro da imagem
COPY . .

# Expor a porta usada pela API
EXPOSE 3000

# Comando para rodar as migrations e iniciar a aplicação
CMD sequelize db:migrate && npm run devStart

