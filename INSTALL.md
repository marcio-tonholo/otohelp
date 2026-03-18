# OtoHelp Academy - Guia de Instalação

## Pré-requisitos

- Node.js v16 ou superior
- npm ou yarn
- MongoDB (local ou cloud como MongoDB Atlas)

## Instalação Rápida

### 1. Clone ou Extraia o Projeto

```bash
cd otohelpShocase
```

### 2. Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Edite .env com seus valores:
# - MONGODB_URI: string de conexão do MongoDB
# - JWT_SECRET: uma chave segura aleatória
# - NODE_ENV: 'development'

# Inicie o servidor
npm run dev

# Servidor estará em http://localhost:5000
```

### 3. Frontend (em outro terminal)

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Aplicação estará em http://localhost:3000
```

## Usando MongoDB Atlas (Recomendado para desenvolvimento)

1. Vá para [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster
4. Obtenha a string de conexão
5. Adicione ao seu `.env`:

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/otohelp?retryWrites=true&w=majority
```

## Variáveis de Ambiente Essenciais

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/otohelp
JWT_SECRET=chave-secreta-muito-longa-e-aleatoria-aqui
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env opcional)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Primeiro Acesso

1. Abra http://localhost:3000
2. Clique em "Registrar"
3. Crie uma conta como "Aluno" ou "Mentor"
4. Faça login
5. Explore a plataforma

## Testando a API

Use o Postman ou similar para testar:

### Registrar

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Dr. João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "11999999999",
  "crm": "123456",
  "crmState": "SP",
  "userType": "mentor"
}
```

### Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Listar Experiências

```
GET http://localhost:5000/api/experiences
```

## Troubleshooting

### MongoDB Connection Error

- Verifique se MongoDB está rodando: `mongod`
- Ou use MongoDB Atlas com string de conexão correta

### Port Already in Use

```bash
# Backend
lsof -i :5000
kill -9 <PID>

# Frontend
lsof -i :3000
kill -9 <PID>
```

### Erro de CORS

- Certifique-se que o backend está rodando em http://localhost:5000
- Verifique a configuração de proxy no vite.config.js

### Clear Cache

```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## Build para Produção

### Backend

```bash
npm start
```

### Frontend

```bash
npm run build
npm run preview
```

## Próximos Passos

- [ ] Criar mais páginas (Detalhes da Experiência, Perfil do Mentor, etc)
- [ ] Implementar upload de arquivos
- [ ] Integrar pagamento (Stripe/Pix)
- [ ] Adicionar validação de documentos
- [ ] Implementar email notifications
- [ ] Criar dashboard para admin

---

**Dúvidas?** Revise os README.md em `/backend` e `/frontend` para mais detalhes técnicos.
