'use client';

import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, gql, ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { CheckCircle2, Shield } from 'lucide-react';

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($cartId: ID!, $email: String!, $shippingAddress: String!, $paymentMethod: String!) {
    createOrder(cartId: $cartId, email: $email, shippingAddress: $shippingAddress, paymentMethod: $paymentMethod) {
      id
      total
      status
    }
  }
`;

function CheckoutContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '', country: 'México' });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });

  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER_MUTATION);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    const session = localStorage.getItem('user');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleNextStep = async () => {
    if (step === 2) {
      try {
        const cartId = localStorage.getItem('cartId') || 'mock_cart_id';
        const email = user?.email || 'anonimo@example.com';
        const shippingAddress = `${address.street}, ${address.city}, CP ${address.zip}, ${address.country}`;
        
        await createOrder({
          variables: {
            cartId,
            email,
            shippingAddress,
            paymentMethod: 'credit_card'
          }
        });

        // Limpiar carrito
        localStorage.setItem('cart', '[]');
        localStorage.removeItem('cartId');
        window.dispatchEvent(new Event('cart-updated'));
        setStep(3);
      } catch (err) {
        console.error('Error al colocar orden:', err);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
      {/* Progress Bar */}
      {step < 3 && (
        <div className="flex items-center justify-between mb-12 text-sm font-semibold">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'}`}>
            <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-zinc-950 dark:border-white">1</span>
            <span>Dirección</span>
          </div>
          <div className="flex-1 h-0.5 bg-zinc-200 dark:bg-zinc-800 mx-4"></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'}`}>
            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-zinc-950 dark:border-white' : 'border-zinc-200 dark:border-zinc-800'}`}>2</span>
            <span>Pago</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Dirección de Envío</h2>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dirección (Calle y Número)</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="Av. Reforma 123"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Ciudad</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  placeholder="CDMX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Código Postal</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  placeholder="01000"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!address.name || !address.street || !address.city || !address.zip}
            className="w-full mt-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold transition-all hover:opacity-90 disabled:opacity-50"
          >
            Continuar al Pago
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center justify-between">
            <span>Método de Pago</span>
            <span className="text-xs text-zinc-500 font-normal flex items-center space-x-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Pago Seguro</span>
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Nombre en la Tarjeta</label>
              <input
                type="text"
                value={payment.cardName}
                onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="JUAN PEREZ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Número de Tarjeta</label>
              <input
                type="text"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Vencimiento</label>
                <input
                  type="text"
                  value={payment.expiry}
                  onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">CVC</label>
                <input
                  type="text"
                  value={payment.cvc}
                  onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/20 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            disabled={orderLoading || !payment.cardName || !payment.cardNumber || !payment.expiry || !payment.cvc}
            className="w-full mt-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold transition-all hover:opacity-90 disabled:opacity-50"
          >
            {orderLoading ? 'Procesando Pago...' : `Pagar ${total.toLocaleString('es-MX', { style: 'currency', currency: 'USD' })}`}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-20 space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">¡Pedido Confirmado!</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Muchas gracias por tu compra. Tu orden está siendo procesada y te hemos enviado un correo con el recibo de tu pedido.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="px-8 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm font-semibold"
          >
            Seguir Comprando
          </button>
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  return (
    <ApolloProvider client={client}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-black">
        <Navbar />
        <CheckoutContent />
      </div>
    </ApolloProvider>
  );
}
