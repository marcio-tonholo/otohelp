# OtoHelp Academy Frontend

Interface moderna para o marketplace de mentoria médica procedural.

## Tecnologias

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **Zustand** - State management
- **Axios** - HTTP client
- **CSS Modules** - Styling

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:3000`

## Build

```bash
npm run build
```

## Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── api/           # Cliente HTTP e endpoints
├── store/         # State management (Zustand)
├── utils/         # Funções utilitárias
├── App.jsx        # Componente principal
├── main.jsx       # Entrada da aplicação
└── index.css      # Estilos globais
```

## Páginas

- **Home** - Página inicial
- **Login** - Autenticação do usuário
- **Register** - Registro de novo usuário
- **Dashboard** - Painel do usuário
- **Experiences** - Listagem e busca de experiências

## Componentes

- **Header** - Navegação principal
- **Footer** - Rodapé
- **ExperienceCard** - Card de experiência
- **MentorCard** - Card de mentor

## Estado Global

### useAuthStore

- Gerencia autenticação e dados do usuário
- Métodos: login, register, logout, getCurrentUser

### useExperienceStore

- Gerencia experiências e filtros
- Métodos: fetchExperiences, searchByProcedure, createExperience

### useBookingStore

- Gerencia reservas e bookings
- Métodos: fetchBookings, createBooking, approveBooking
