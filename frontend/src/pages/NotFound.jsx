import React from 'react';

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <p
        style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}
      >
        Página não encontrada
      </p>
      <a
        href="/"
        style={{
          color: '#3b82f6',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        Voltar para Home
      </a>
    </div>
  );
};

export default NotFound;
