# Usa como base a imagem do ubuntu v20.04
FROM ubuntu:20.04

# Evita avisos do apt
ENV DEBIAN_FRONTEND=noninteractive

# Atualiza os repositórios e faz upgrade dos pacotes, depois limpa as listas do apt-get
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Instala os requisitos para o repositório NodeJS 20, depois limpa as listas do apt-get
RUN apt-get update && apt-get install -y ca-certificates curl gnupg && rm -rf /var/lib/apt/lists/*

# Atualizar certificados CA
RUN update-ca-certificates

# Cria a pasta keyrings para o NodeJS
RUN mkdir -p /etc/apt/keyrings

# Baixa e adiciona a keyring do NodeJS
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Adiciona o repositório NodeJS
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Atualiza os repositórios novamente e faz upgrade dos pacotes, depois limpa as listas do apt-get
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Instala os pacotes necessários, depois limpa as listas do apt-get
RUN apt-get update && apt-get install -y nodejs sqlite build-essential zip unzip python2 python3 git nano && rm -rf /var/lib/apt/lists/*

# Clona o repositório Seed
RUN git clone https://github.com/KillovSky/Seed.git

# Define o diretório de trabalho
WORKDIR /Seed

# Instala as dependências do projeto
RUN npm install

# Faz downgrade do sharp para compatibilidade com o canva (se necessário)
#RUN npm install sharp@0.30.7

# Expõe a porta
EXPOSE 3000

# Define o comando para iniciar a Seed
CMD ["node", "/Seed/lib/Initialize/checker.js"]
