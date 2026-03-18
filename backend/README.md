# OtoHelp Academy Backend

API REST para o marketplace de mentoria médica procedural.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Autenticação
- **Bcryptjs** - Hash de senhas
- **Multer** - Upload de arquivos
- **Stripe** - Pagamentos (futura integração)

## Instalação

```bash
npm install
```

## Configuração

Copie `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

## Desenvolvimento

```bash
npm run dev
```

O servidor rodará em `http://localhost:5000`

## Producção

```bash
npm start
```

## Estrutura de Pastas

```
src/
├── config/        # Configurações (database, constants)
├── models/        # Modelos MongoDB (Mongoose)
├── controllers/   # Lógica de negócio
├── routes/        # Definição de rotas
├── middleware/    # Middlewares (auth, validation, etc)
├── utils/         # Funções utilitárias
└── server.js      # Entrada da aplicação
```

## Models

- **User** - Base para usuários (Mentor e Student)
- **Mentor** - Especialistas que oferecem experiências
- **Student** - Alunos que buscam aprender
- **Experience** - Experiências oferecidas
- **Booking** - Reservas de alunos

## Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário

### Mentores

- `GET /api/mentors` - Listar mentores
- `GET /api/mentors/:id` - Detalhes do mentor
- `GET /api/mentors/dashboard` - Dashboard do mentor
- `PUT /api/mentors/profile` - Atualizar perfil

### Alunos

- `GET /api/students/profile` - Perfil do aluno
- `GET /api/students/dashboard` - Dashboard do aluno
- `PUT /api/students/profile` - Atualizar perfil

### Experiências

- `GET /api/experiences` - Listar experiências
- `GET /api/experiences/:id` - Detalhes da experiência
- `POST /api/experiences` - Criar experiência (mentor)
- `PUT /api/experiences/:id` - Atualizar experiência
- `DELETE /api/experiences/:id` - Deletar experiência
- `GET /api/experiences/search/procedure` - Buscar por procedimento
- `GET /api/experiences/search/mentor` - Buscar por mentor

### Bookings

- `POST /api/bookings` - Criar reserva
- `GET /api/bookings` - Listar reservas
- `PUT /api/bookings/:id/approve` - Aprovar reserva
- `PUT /api/bookings/:id/reject` - Rejeitar reserva
- `PUT /api/bookings/:id/complete` - Completar reserva
- `POST /api/bookings/:id/review` - Adicionar avaliação

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação.

1. Registre/Faça login para obter um token
2. Inclua o token no header: `Authorization: Bearer <token>`
3. O token expira em 7 dias por padrão

## Comissão da Plataforma

- Padrão: 20% sobre cada transação
- Exemplo: Experiência de R$ 2.000
  - Comissão: R$ 400
  - Mentor recebe: R$ 1.600

## TODO

- [ ] Integração com Stripe para pagamentos
- [ ] Upload de arquivos para AWS S3
- [ ] Sistema de notificações por email
- [ ] Validação de documentos (manual)
- [ ] Sistema de rating e reviews avançado
- [ ] Filtros e busca avançada
- [ ] Relatórios e analytics
