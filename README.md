# 🎮 Jungle Gaming - Sistema de Tarefas Colaborativo

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

Sistema completo de gerenciamento de tarefas colaborativo com arquitetura de microserviços, autenticação JWT, notificações em tempo real via WebSocket e interface moderna.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack de Tecnologias](#-stack-de-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Executar](#-como-executar)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança

- ✅ Cadastro e login de usuários
- ✅ JWT com Access Token e Refresh Token
- ✅ Proteção de rotas no back-end e front-end
- ✅ Middleware de autenticação

### 📝 Gerenciamento de Tarefas

- ✅ CRUD completo de tarefas
- ✅ Filtros por status e prioridade
- ✅ Atribuição de tarefas a múltiplos usuários
- ✅ Sistema de comentários por tarefa
- ✅ Histórico de alterações (auditoria)

### 🔔 Comunicação em Tempo Real

- ✅ Notificações via WebSocket (Socket.io)
- ✅ Updates automáticos na UI
- ✅ Eventos para criação, atualização e exclusão de tarefas

### 🎨 Interface Moderna

- ✅ Design responsivo com tema escuro
- ✅ Componentes `shadcn/ui` + Tailwind CSS
- ✅ Feedback visual (skeletons, toasts)
- ✅ Validação de formulários com React Hook Form + Zod

---

## 🚀 Stack de Tecnologias

### **Infraestrutura**

- **Monorepo:** Turborepo + Yarn Workspaces (v4+)
- **Containerização:** Docker & Docker Compose
- **Banco de Dados:** PostgreSQL 15
- **Message Broker:** RabbitMQ 3.13

### **Back-end**

- **Framework:** NestJS 10 (Node.js 20+ com TypeScript)
- **ORM:** TypeORM
- **Autenticação:** Passport.js (estratégia JWT)
- **WebSockets:** @nestjs/websockets + Socket.io
- **Validação:** class-validator, class-transformer
- **Documentação:** Swagger (OpenAPI 3.0)

### **Front-end**

- **Framework:** React 18 + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Roteamento:** TanStack Router
- **Estado Global:** Zustand
- **Formulários:** React Hook Form + Zod
- **HTTP Client:** Axios
- **WebSockets:** socket.io-client

---

## 🏗️ Arquitetura

Sistema baseado em **microserviços** que se comunicam através do RabbitMQ, orquestrados por um API Gateway:

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/WS
         ▼
┌─────────────────┐
│  API Gateway    │
│   Port: 3001    │
└────────┬────────┘
         │ RabbitMQ
    ┌────┴────┬──────────┬──────────────┐
    ▼         ▼          ▼              ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│ Auth   │ │ Tasks  │ │ Notif.   │ │ PostgreSQL   │
│Service │ │Service │ │ Service  │ │ Port: 5432   │
└────────┘ └────────┘ │Port: 3003│ └──────────────┘
                      └──────────┘
```

### Serviços

1. **`api-gateway`** (Port 3001)
   - Interface pública REST API
   - Validação de JWT
   - Orquestração de chamadas aos microserviços
   - Documentação Swagger

2. **`auth-service`**
   - Gerenciamento de usuários
   - Autenticação e tokens JWT
   - Validação de credenciais

3. **`tasks-service`**
   - Lógica de negócio de tarefas
   - Comentários e histórico
   - Atribuições de usuários
   - Publicação de eventos

4. **`notifications-service`** (Port 3003)
   - Escuta eventos do RabbitMQ
   - Retransmissão via WebSocket
   - Notificações em tempo real

5. **`web`** (Port 5173)
   - SPA React
   - Interface do usuário

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v20 ou superior
- [Yarn](https://yarnpkg.com/) v4 ou superior
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

**Opcional:**

- Cliente de banco de dados (DBeaver, pgAdmin, etc.)

---

## 🔧 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/DaniloCardoso93/sistema-tarefas-colaborativo.git
cd my-turborepo
```

### 2. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na **raiz do projeto**:

```bash
touch .env
```

Cole o conteúdo abaixo e **substitua os valores dos secrets JWT**:

```env
# ===== Infraestrutura =====
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=challenge_db

RABBITMQ_URL=amqp://admin:admin@localhost:5672

# ===== API Gateway =====
GATEWAY_PORT=3001

# ⚠️ IMPORTANTE: Gere chaves secretas fortes e aleatórias!
JWT_ACCESS_SECRET=SUBSTITUA_POR_UMA_CHAVE_SECRETA_FORTE_E_ALEATORIA
JWT_REFRESH_SECRET=SUBSTITUA_POR_OUTRA_CHAVE_SECRETA_FORTE_E_ALEATORIA

# ===== Notifications Service =====
NOTIFICATIONS_PORT=3003
```

> 💡 **Dica:** Use um gerador de senhas forte para criar os secrets JWT (mínimo 32 caracteres).

### 3. Instale as Dependências

```bash
yarn install
```

---

## 🎯 Como Executar

### Passo 1: Inicie a Infraestrutura (Docker)

```bash
docker-compose up -d
```

Isso iniciará:

- **PostgreSQL** em `localhost:5432`
- **RabbitMQ** em `localhost:5672` (Management UI: `http://localhost:15672`)

**Credenciais RabbitMQ:**

- Usuário: `admin`
- Senha: `admin`

### Passo 2: Execute as Migrações do Banco

```bash
# Build dos serviços
yarn build

# Aplicar migrações
yarn workspace auth-service migration:run
yarn workspace tasks-service migration:run
```

### Passo 3: Inicie os Serviços (Modo Desenvolvimento)

Abra **5 terminais** e execute os comandos abaixo (sempre a partir da raiz do projeto):

#### Terminal 1 - Auth Service

```bash
yarn workspace auth-service start:dev
```

Aguarde: `Auth microservice is listening...`

#### Terminal 2 - Tasks Service

```bash
yarn workspace tasks-service start:dev
```

Aguarde: `Tasks microservice is listening...`

#### Terminal 3 - Notifications Service

```bash
yarn workspace notifications-service start:dev
```

Aguarde: `Notifications service running on port 3003`

#### Terminal 4 - API Gateway

```bash
yarn workspace api-gateway start:dev
```

Aguarde: `API Gateway running on port 3001`

#### Terminal 5 - Frontend (Web)

```bash
yarn workspace web dev
```

Aguarde: `ready in XXX ms`

### Passo 4: Acesse a Aplicação

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:3001
- **Swagger Docs:** http://localhost:5173/api-docs (via proxy Vite)
- **RabbitMQ Management:** http://localhost:15672

---

## 📚 Documentação da API

A documentação interativa da API está disponível via **Swagger UI**:

**URL:** http://localhost:5173/api-docs

> ℹ️ **Nota:** O acesso é via porta 5173 devido ao proxy configurado no Vite para resolver CORS durante o desenvolvimento.

### Endpoints Principais

#### Autenticação

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/profile` - Perfil do usuário (requer autenticação)

#### Tarefas

- `GET /api/tasks` - Listar tarefas (com filtros)
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:id` - Buscar tarefa
- `PATCH /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa
- `GET /api/tasks/:id/history` - Histórico de alterações

#### Comentários

- `POST /api/tasks/:taskId/comments` - Adicionar comentário
- `GET /api/tasks/:taskId/comments` - Listar comentários

#### Usuários

- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário

---

## 📁 Estrutura do Projeto

```
my-turborepo/
├── apps/
│   ├── api-gateway/          # API Gateway (NestJS)
│   ├── auth-service/         # Serviço de Autenticação (NestJS)
│   ├── tasks-service/        # Serviço de Tarefas (NestJS)
│   ├── notifications-service/# Serviço de Notificações (NestJS)
│   └── web/                  # Frontend (React + Vite)
├── packages/
│   ├── eslint-config/        # Configuração compartilhada do ESLint
│   ├── typescript-config/    # Configuração compartilhada do TypeScript
│   └── ui/                   # Componentes UI compartilhados
├── docker-compose.yml        # Orquestração de containers
├── turbo.json               # Configuração do Turborepo
├── package.json             # Dependências raiz
└── .env                     # Variáveis de ambiente
```

---

## 🔐 Variáveis de Ambiente

### Variáveis Obrigatórias

| Variável             | Descrição                        | Exemplo                             |
| -------------------- | -------------------------------- | ----------------------------------- |
| `DATABASE_HOST`      | Host do PostgreSQL               | `localhost`                         |
| `DATABASE_PORT`      | Porta do PostgreSQL              | `5432`                              |
| `DATABASE_USER`      | Usuário do banco                 | `postgres`                          |
| `DATABASE_PASSWORD`  | Senha do banco                   | `password`                          |
| `DATABASE_NAME`      | Nome do banco                    | `challenge_db`                      |
| `RABBITMQ_URL`       | URL do RabbitMQ                  | `amqp://admin:admin@localhost:5672` |
| `JWT_ACCESS_SECRET`  | Secret do access token           | `sua-chave-secreta-forte`           |
| `JWT_REFRESH_SECRET` | Secret do refresh token          | `outra-chave-secreta-forte`         |
| `GATEWAY_PORT`       | Porta do API Gateway             | `3001`                              |
| `NOTIFICATIONS_PORT` | Porta do serviço de notificações | `3003`                              |

---

## 🛠️ Troubleshooting

### Problema: Porta já em uso

**Erro:** `EADDRINUSE: address already in use`

**Solução:**

```bash
# Verifique quais processos estão usando as portas
lsof -i :3001  # ou :5173, :5432, etc

# Mate o processo
kill -9 <PID>
```

### Problema: Migrações não aplicadas

**Erro:** `relation "users" does not exist`

**Solução:**

```bash
yarn workspace auth-service migration:run
yarn workspace tasks-service migration:run
```

### Problema: RabbitMQ não conecta

**Erro:** `Failed to connect to RabbitMQ`

**Solução:**

```bash
# Verifique se o container está rodando
docker ps | grep rabbitmq

# Reinicie o RabbitMQ
docker-compose restart rabbitmq
```

### Problema: WebSocket não conecta

**Solução:**

1. Verifique se o `notifications-service` está rodando
2. Confirme a porta 3003 está livre
3. Verifique o console do navegador para erros

### Problema: Swagger não carrega

**Solução:**

1. Acesse via proxy Vite: `http://localhost:5173/api-docs`
2. Verifique se o `api-gateway` está rodando
3. Confirme que não há erros nos logs do gateway

---

## 🚀 Deployment (Produção)

### Build para Produção

```bash
# Build de todos os serviços
yarn build

# Build individual
yarn workspace api-gateway build
yarn workspace auth-service build
yarn workspace tasks-service build
yarn workspace notifications-service build
yarn workspace web build
```

### Docker Production

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar em produção
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Scripts Úteis

```bash
# Instalar dependências
yarn install

# Build completo
yarn build

# Limpar builds
yarn clean

# Lint
yarn lint

# Formatar código
yarn format

# Rodar migrações
yarn workspace auth-service migration:run
yarn workspace tasks-service migration:run

# Criar nova migração
yarn workspace auth-service migration:generate
yarn workspace tasks-service migration:generate
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido como parte do desafio técnico da Jungle Gaming.

---

## 👨‍💻 Autor

**Danilo Alves Cardoso**

- GitHub: [@DaniloCardoso93](https://github.com/DaniloCardoso93)
- LinkedIn: [Danilo Cardoso](https://www.linkedin.com/in/daniloacardoso/)

---

## 🙏 Agradecimentos

- Jungle Gaming pela oportunidade
- Comunidade NestJS e React
- Todos os contribuidores de código aberto

---

<div align="center">
  Desenvolvido com ❤️ para o desafio Jungle Gaming
</div>
