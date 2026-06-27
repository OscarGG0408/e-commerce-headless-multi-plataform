'use client';

import Navbar from './components/Navbar';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, CreditCard, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 py-24 sm:py-32 flex-1 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-200/30 via-zinc-50 to-zinc-50 dark:from-zinc-900/30 dark:via-black dark:to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.05] mb-6">
              El E-commerce del Futuro, <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">Totalmente Headless</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-8 mb-10 max-w-xl">
              Nuestra tienda conecta un Frontend veloz en Next.js con múltiples motores como MedusaJS mediante una capa inteligente de GraphQL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-full font-bold transition-all hover:opacity-90 flex items-center justify-center space-x-2 shadow-lg shadow-zinc-950/10 dark:shadow-white/5"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-100 dark:border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4">
            <Layers className="w-8 h-8 text-zinc-900 dark:text-white" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Conexión Multi-Core</h3>
            <p className="text-sm text-zinc-500 leading-6">
              Conecta MedusaJS por defecto o intercambia por Shopify, PrestaShop u otros sin tocar una sola línea de código frontend.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4">
            <ShoppingBag className="w-8 h-8 text-zinc-900 dark:text-white" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Experiencia Premium</h3>
            <p className="text-sm text-zinc-500 leading-6">
              Catálogo dinámico, carrito interactivo local y un flujo de checkout súper limpio para maximizar tus ventas.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4">
            <CreditCard className="w-8 h-8 text-zinc-900 dark:text-white" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Pagos Agnosticos</h3>
            <p className="text-sm text-zinc-500 leading-6">
              La capa GraphQL implementa interfaces universales listas para integrar Stripe, PayPal, o tu pasarela local preferida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
