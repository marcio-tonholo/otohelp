# OtoHelp Academy

Marketplace de Mentoria Médica Procedural Sob Demanda

## Estrutura do Projeto

```
otohelpShocase/
├── backend/          # API REST (Node.js + Express)
├── frontend/         # Aplicação React
└── README.md        # Este arquivo
```

## Como Iniciar

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend rodará em `http://localhost:5000`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

O frontend rodará em `http://localhost:3000`

## Arquitetura

### Backend

- Node.js com Express
- MongoDB para persistência
- Autenticação com JWT
- Segregação por models (User, Mentor, Student, Experience, Booking)
- Middlewares de autenticação e autorização

### Frontend

- React com Vite
- React Router para navegação
- Zustand para gerenciamento de estado
- Axios para requisições HTTP
- CSS puro com variables CSS

## Fluxos Principais

### Cadastro (Mentor ou Aluno)

1. Usuário preenche formulário de registro
2. Sistema cria usuário no banco
3. JWT é gerado e retornado
4. Usuário é redirecionado para seu perfil/dashboard

### Busca de Experiências

1. Aluno acessa página de experiências
2. Pode buscar por:
   - Procedimento
   - Mentor
   - Filtros avançados (complexidade, preço, cidade)
3. Clica em "Ver Detalhes" para mais informações

### Solicitação de Vaga

1. Aluno visualiza experiência
2. Clica em "Solicitar Vaga"
3. Booking é criado com status "pendente"
4. Email é enviado ao mentor (não implementado ainda)
5. Mentor aprova/rejeita no dashboard

### Pagamento (Futuro)

1. Booking aprovado
2. Aluno realiza pagamento via Stripe
3. Plataforma retém comissão (20%)
4. Mentor recebe os 80%

## Modelos de Dados

### User (Base)

- nome, email, senha, telefone
- CRM, estado do CRM
- profilePicture
- status (pending_validation, active, inactive)

### Mentor (extends User)

- especialidade, subespecializações
- anos de experiência
- procedimentos que realiza
- ambientes onde trabalha (centro cirúrgico, ambulatório, etc)
- modalidades oferecidas
- preços
- disponibilidade
- rating e reviews
- ganhos totais

### Student (extends User)

- especialidade já formada
- ano de formação
- objetivos de aprendizado
- procedimentos de interesse
- nível atual (iniciante, intermediário, avançado)
- preferências (cidades, orçamento)
- histórico de bookings
- total gasto

### Experience

- mentor (referência)
- título, descrição
- tipo (cirurgia, ambulatório, observership, etc)
- procedimento
- complexidade
- localização (cidade, hospital)
- data/hora agendada
- duração
- máximo de alunos
- preço
- pré-requisitos
- objetivos de aprendizado
- status (scheduled, ongoing, completed, cancelled)

### Booking

- experience, student, mentor
- preço original
- comissão da plataforma
- ganho do mentor
- status (pendente, aprovado, rejeitado, concluído, cancelado)
- pagamento (pendente, concluído, falhou)
- reviews (aluno e mentor)

## Próximos Passos

1. **Integração com Pagamento**
   - Stripe para cartão de crédito
   - Pix para Brasil

2. **Upload de Arquivos**
   - AWS S3 para documentos e imagens
   - Validação automática de CRM

3. **Email e Notificações**
   - SendGrid ou similar para emails
   - Notificações em tempo real

4. **Pages Adicionais**
   - Detalhes da Experiência
   - Edição de Perfil (Mentor)
   - Minhas Experiências (Mentor)
   - Criar Experiência (Mentor)
   - Histórico de Bookings
   - Avaliação de Mentores

5. **Admin Dashboard**
   - Validação de documentos
   - Gerenciamento de disputas
   - Analytics e relatórios
   - Controle de comissões

6. **Mobile**
   - React Native ou PWA
   - Experiência otimizada para celular

## Variáveis de Ambiente

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/otohelp
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d
NODE_ENV=development

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## Licença

Este projeto é private.

## Contato

Para informações sobre o projeto, entre em contato com a equipe.
