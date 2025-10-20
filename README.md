# Jungle Gaming - Desafio Full-stack (Sistema de Tarefas)

Este é um sistema de gerenciamento de tarefas colaborativo construído como parte do desafio técnico para a vaga de Desenvolvedor Júnior Full-stack na Jungle Gaming.

O projeto utiliza uma arquitetura de microserviços robusta, comunicação em tempo real com WebSockets e uma interface moderna e reativa construída com React e Tailwind CSS.

## Stack de Tecnologias

### Back-end

- **Node.js** com **NestJS** (TypeScript)
- **Arquitetura:** Microserviços
- **Banco de Dados:** PostgreSQL (com TypeORM)
- **Mensageria:** RabbitMQ (para comunicação assíncrona entre serviços)
- **Autenticação:** JWT (Access Tokens + Refresh Tokens) com Passport.js
- **Tempo Real:** WebSockets (Socket.io)
- **Containerização:** Docker e Docker Compose

### Front-end

- **React** (com Vite)
- **TypeScript**
- **UI:** Tailwind CSS + `shadcn/ui`
- **Roteamento:** TanStack Router
- **Gerenciamento de Estado:** Zustand
- **Formulários:** React Hook Form + Zod (para validação)
- **Cliente HTTP:** Axios

### Monorepo

- **Turborepo** (para gerenciamento do monorepo)
- **Yarn Workspaces** (para gerenciamento de pacotes)

## Arquitetura de Microserviços

O sistema é dividido em 5 serviços independentes que se comunicam via RabbitMQ:

1.  **API Gateway (`api-gateway`):** A porta de entrada pública. Recebe todas as requisições HTTP, valida a autenticação (JWT) e encaminha as solicitações para os serviços corretos.
2.  **Serviço de Autenticação (`auth-service`):** Responsável por gerenciar usuários, criptografar senhas (bcrypt), gerar e validar tokens JWT.
3.  **Serviço de Tarefas (`tasks-service`):** Responsável por toda a lógica de negócio (CRUD) de tarefas, comentários e logs de auditoria. Publica eventos (ex: `task_created`) no RabbitMQ.
4.  **Serviço de Notificações (`notifications-service`):** Ouve os eventos do RabbitMQ (ex: `task_created`) e os retransmite em tempo real para o front-end via WebSockets.
5.  **Aplicação Web (`web`):** A interface do usuário (SPA) construída em React.

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v20+)
- Yarn (v4+)
- Docker e Docker Compose
- DBeaver ou outro cliente de banco de dados

### 1. Configuração Inicial

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/DaniloCardoso93/sistema-tarefas-colaborativo.git
    cd [NOME_DA_PASTA]
    ```

2.  **Crie o arquivo de ambiente:**
    Na raiz do projeto, crie um arquivo `.env` e cole o seguinte conteúdo:

    ```
    # Variáveis do Auth Service
    DATABASE_HOST=localhost
    RABBITMQ_URL=amqp://admin:admin@localhost:5672

    # Variáveis do API Gateway
    GATEWAY_PORT=3001
    JWT_ACCESS_SECRET=SEU_SEGREDO_SUPER_SECRETO_DO_ACCESS_TOKEN
    JWT_REFRESH_SECRET=SEU_SEGREDO_SUPER_SECRETO_DO_REFRESH_TOKEN
    ```

3.  **Instale as dependências:**
    ```bash
    yarn install
    ```

### 2. Rodando o Banco de Dados e o RabbitMQ (Docker)

Inicie os serviços de infraestrutura em segundo plano:

```bash
docker-compose up -d
```
