'use client';

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">
          Carrito de Compras
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="mb-4">Tu carrito está vacío.</p>
            <Link href="/products" className="text-sm font-bold text-zinc-950 dark:text-white underline">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
            {/* Products List */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Imagen</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {item.price.toLocaleString('es-MX', { style: 'currency', currency: item.currency })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 h-fit space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Resumen del Pedido</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>{total.toLocaleString('es-MX', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-medium">Gratis</span>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span>{total.toLocaleString('es-MX', { style: 'currency', currency: 'USD' })}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold transition-all hover:opacity-90 flex items-center justify-center space-x-2"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
