'use client';

import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, gql, ApolloProvider } from '@apollo/client';
import client from '../apollo-client';

const LOGIN_MUTATION = gql`
  mutation LoginCustomer($email: String!, $password: String!) {
    loginCustomer(email: $email, password: $password) {
      token
      customer {
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterCustomer($email: String!, $password: String!) {
    registerCustomer(email: $email, password: $password) {
      token
      customer {
        email
      }
    }
  }
`;

function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [loginCustomer, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerCustomer, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const mutation = isRegister ? registerCustomer : loginCustomer;
      const { data } = await mutation({
        variables: { email, password }
      });

      const payload = isRegister ? data.registerCustomer : data.loginCustomer;
      if (payload) {
        localStorage.setItem('user', JSON.stringify({ email: payload.customer.email, token: payload.token }));
        router.push('/profile');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al autenticar');
    }
  };

  const loading = loginLoading || registerLoading;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {isRegister ? 'Únete a nuestra plataforma e-commerce' : 'Accede a tus favoritos y pedidos'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline transition-colors"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <ApolloProvider client={client}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-black">
        <Navbar />
        <LoginContent />
      </div>
    </ApolloProvider>
  );
}
