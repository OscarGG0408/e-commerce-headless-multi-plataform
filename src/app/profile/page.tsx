'use client';

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, gql, ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { Heart, Package, User, LogOut } from 'lucide-react';

const GET_ORDERS = gql`
  query GetCustomerOrders($email: String!) {
    customerOrders(email: $email) {
      id
      total
      status
      items {
        id
        title
        price
        quantity
      }
    }
  }
`;

function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (!session) {
      router.push('/login');
    } else {
      setUser(JSON.parse(session));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const { data, loading } = useQuery(GET_ORDERS, {
    variables: { email: user?.email || '' },
    skip: !user?.email,
  });

  if (!user) return null;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 h-fit">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.email}</p>
              <p className="text-xs text-zinc-500">Cliente Premium</p>
            </div>
          </div>
          
          <hr className="border-zinc-200 dark:border-zinc-800" />
          
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm text-sm font-semibold text-zinc-900 dark:text-white">
              <User className="w-5 h-5" />
              <span>Mi Perfil</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Package className="w-5 h-5" />
              <span>Mis Pedidos</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
              <span>Favoritos</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-semibold text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Orders */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Historial de Pedidos</h2>
            {loading ? (
              <div className="p-6 text-center text-zinc-500 text-sm animate-pulse">
                Cargando historial de pedidos...
              </div>
            ) : !data?.customerOrders || data.customerOrders.length === 0 ? (
              <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center text-zinc-500 text-sm py-12">
                No tienes pedidos registrados todavía.
              </div>
            ) : (
              <div className="space-y-4">
                {data.customerOrders.map((order: any) => (
                  <div key={order.id} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-zinc-500 font-mono">ID de Orden: {order.id}</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                          Total: {order.total.toLocaleString('es-MX', { style: 'currency', currency: 'USD' })}
                        </p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                            <span>{item.title} x {item.quantity}</span>
                            <span>{item.price.toLocaleString('es-MX', { style: 'currency', currency: 'USD' })}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Mis Favoritos</h2>
            <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center text-zinc-500 text-sm py-12">
              No tienes productos agregados a favoritos.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ApolloProvider client={client}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-black">
        <Navbar />
        <ProfileContent />
      </div>
    </ApolloProvider>
  );
}
