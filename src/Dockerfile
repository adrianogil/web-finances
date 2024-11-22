# Usando a imagem oficial do Node.js
FROM node:16

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código para dentro da imagem
COPY . .

# Expor a porta usada pela API
EXPOSE 3000

# Iniciar o backend
CMD ["npm", "start"]
