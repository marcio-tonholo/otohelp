# OtoHelp Academy - Arquitetura

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Navegador)                      │
│                   http://localhost:3000                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/HTTP
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Application de Frontend (React)              │
│                      localhost:3000                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Pages      │  │ Components   │  │  Store           │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────┤  │
│  │ Home         │  │ Header       │  │ useAuthStore     │  │
│  │ Login        │  │ Footer       │  │ useExperienceStore
│  │ Register     │  │ Cards        │  │ useBookingStore  │  │
│  │ Dashboard    │  │              │  │                  │  │
│  │ Experiences  │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                          │                                   │
│                          │ Axios Client                      │
│                          ▼                                   │
│          ┌────────────────────────────────┐                 │
│          │      API HTTP (client.js)      │                 │
│          │    http://localhost:5000/api   │                 │
│          └────────────────────────────────┘                 │
└─────────────────────────────────┬──────────────────────────┘
                                   │
                                   │ REST API Calls
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│              API Backend (Node.js + Express)                │
│                   localhost:5000                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Routes     │  │ Controllers  │  │  Middleware      │   │
│  ├─────────────┤  ├──────────────┤  ├──────────────────┤   │
│  │ /auth       │  │ authCtrl     │  │ auth.js (JWT)    │   │
│  │ /mentors    │  │ mentorCtrl   │  │ validation       │   │
│  │ /students   │  │ studentCtrl  │  │                  │   │
│  │ /experiences│ │ experienceCtrl │                  │   │
│  │ /bookings   │  │ bookingCtrl   │  │                  │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                          │                                   │
│                          │ Mongoose ORM                      │
│                          ▼                                   │
│          ┌────────────────────────────────┐                 │
│          │      Models (Mongoose)         │                 │
│          ├────────────────────────────────┤                 │
│          │ User (base)                    │                 │
│          │   ├─ Mentor                    │                 │
│          │   └─ Student                   │                 │
│          │ Experience                     │                 │
│          │ Booking                        │                 │
│          └────────────────────────────────┘                 │
│                          │                                   │
│                          │ TCP Connection                    │
│                          ▼                                   │
└─────────────────────────────────┬──────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                         │
│              (Local: localhost:27017)                       │
│              (Cloud: MongoDB Atlas)                         │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                               │
│  ├─ users (Mentor + Student via discriminator)             │
│  ├─ experiences                                             │
│  └─ bookings                                                │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados - Login

```
Usuario digita credenciais
         │
         ▼
   Input Form (React)
         │
         ▼
   useAuthStore.login()
         │
         ▼
   axios.post('/api/auth/login', {...})
         │
         ▼
   Backend: router → authController.login()
         │
         ▼
   User.findOne() → validar senha
         │
         ▼
   Gerar JWT Token
         │
         ▼
   Return token + user data
         │
         ▼
   localStorage.setItem('token')
         │
         ▼
   Redirect → Dashboard
```

## Fluxo de Dados - Criar Experiência (Mentor)

```
Mentor acessa "Criar Experiência"
         │
         ▼
Form Preenchido (React)
         │
         ▼
useExperienceStore.createExperience()
         │
         ▼
axios.post('/api/experiences', {...}, {headers: {Authorization: Bearer token}})
         │
         ▼
Backend Middleware: protect() → verifica JWT
         │
         ▼
authController: verifica se é mentor
         │
         ▼
experienceController.createExperience()
         │
         ▼
Experience.create() (salva no MongoDB)
         │
         ▼
Retorna experience data
         │
         ▼
Sucesso! Redireciona para detalhes
```

## Fluxo de Dados - Solicitar Vaga (Aluno)

```
Aluno visualiza experiência
         │
         ▼
Clica "Solicitar Vaga"
         │
         ▼
useBookingStore.createBooking()
         │
         ▼
axios.post('/api/bookings', {experienceId}, {headers})
         │
         ▼
Backend: protect() → authorize(['student'])
         │
         ▼
bookingController.createBooking()
         │
         ▼
Cria Booking com status "pendente"
         │
         ▼
Calcula comissão (20%)
         │
         ▼
Salva no MongoDB
         │
         ▼
Retorna confirmação
         │
         ▼
Toast: "Solicitação enviada!"
```

## Fluxo de Dados - Aprovar Vaga (Mentor)

```
Mentor acessa Dashboard
         │
         ▼
Vê solicitações de alunos
         │
         ▼
Clica "Aprovar"
         │
         ▼
axios.put('/api/bookings/:id/approve', {}, {headers})
         │
         ▼
Backend: protect() → authorize(['mentor'])
         │
         ▼
Verifica se booking.mentor === req.user.id
         │
         ▼
bookingController.approveBooking()
         │
         ▼
Atualiza status para "aprovado"
         │
         ▼
Atualiza currentStudents na Experience
         │
         ▼
Salva no MongoDB
         │
         ▼
Retorna confirmação
         │
         ▼
Toast: "Vaga aprovada!"
```

## Segurança - Fluxo JWT

```
1. Registro/Login
   └─ Cria JWT Token com payload: { id: userId, userType: 'mentor' }
   └─ Expira em 7 dias

2. Cliente armazena token
   └─ localStorage.setItem('token', token)

3. Cliente envia em cada requisição
   └─ Header: Authorization: Bearer <token>

4. Backend valida (middleware auth.js)
   └─ jwt.verify(token, JWT_SECRET)
   └─ Se válido: set req.user = { id, userType }
   └─ Se inválido: retorna 401

5. Controllers usam req.user
   └─ Verifica permissões
   └─ Autoriza ações apenas para o próprio usuário
```

## Estrutura HTTP Call

### Request

```javascript
axios.post(
  '/api/bookings',
  { experienceId: '123' }, // Body
  {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...',
      'Content-Type': 'application/json',
    },
  },
);
```

### Response Success (201)

```javascript
{
  success: true,
  data: {
    _id: '507f191e810c19729de860ea',
    experience: '507f1f77bcf86cd799439011',
    student: '507f1f77bcf86cd799439012',
    mentor: '507f1f77bcf86cd799439013',
    price: 2000,
    platformCommission: 400,
    mentorEarnings: 1600,
    status: 'pendente',
    paymentStatus: 'pendente',
    createdAt: '2026-03-12T10:30:00Z'
  }
}
```

### Response Error

```javascript
{
  error: 'Essa experiência está cheia',
  timestamp: '2026-03-12T10:30:00Z'
}
```

## Banco de Dados Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  crm: String (unique),
  crmState: String,
  userType: 'mentor' | 'student',
  profilePicture: String (URL),
  status: 'pending_validation' | 'active' | 'inactive',

  // Se userType === 'mentor'
  specialization: String,
  yearsOfExperience: Number,
  bio: String,
  procedures: [
    { name: String, complexity: String, frequency: String }
  ],
  rating: {
    averageRating: Number,
    totalReviews: Number
  },
  totalStudents: Number,
  totalEarnings: Number,

  // Se userType === 'student'
  learningObjectives: [String],
  currentLevel: String,
  bookingsHistory: [ObjectId],
  completedExperiences: Number,
  totalSpent: Number,

  createdAt: Date,
  updatedAt: Date
}
```

### Experiences Collection

```javascript
{
  _id: ObjectId,
  mentor: ObjectId (ref: User),
  title: String,
  description: String,
  type: 'cirurgia' | 'ambulatorio' | ...,
  procedure: String,
  complexity: 'basico' | 'intermediario' | 'avancado',
  location: {
    city: String,
    address: String,
    hospital: String
  },
  scheduledDate: Date,
  duration: Number, // hours
  maxStudents: Number,
  currentStudents: Number,
  price: Number,
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection

```javascript
{
  _id: ObjectId,
  experience: ObjectId (ref: Experience),
  student: ObjectId (ref: User),
  mentor: ObjectId (ref: User),
  price: Number,
  platformCommission: Number,
  mentorEarnings: Number,
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'concluido' | 'cancelado',
  paymentStatus: 'pendente' | 'concluido' | 'falhou' | 'reembolsado',
  studentReview: {
    rating: Number,
    comment: String,
    createdAt: Date
  },
  mentorReview: {
    rating: Number,
    comment: String,
    createdAt: Date
  },
  createdAt: Date,
  approvedAt: Date,
  completedAt: Date
}
```

## Autenticação e Autorização

### Tipos de Usuário

- **mentor** - Pode criar experiências, aprovar bookings, receber ganhos
- **student** - Pode solicitar vagas, fazer reviews

### Permissões por Endpoint

| Endpoint              | Método | Auth | Autorização            |
| --------------------- | ------ | ---- | ---------------------- |
| /auth/register        | POST   | -    | -                      |
| /auth/login           | POST   | -    | -                      |
| /auth/me              | GET    | JWT  | -                      |
| /mentors              | GET    | -    | -                      |
| /experiences          | GET    | -    | -                      |
| /experiences          | POST   | JWT  | mentor                 |
| /bookings             | POST   | JWT  | student                |
| /bookings/:id/approve | PUT    | JWT  | mentor (proprietário)  |
| /bookings/:id/review  | POST   | JWT  | student (proprietário) |

---

**Texto diagrama da arquitetura completa do OtoHelp Academy**
