'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import client from '../../apollo-client';
import { ApolloProvider } from '@apollo/client';
import Navbar from '../../components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      currency
    }
  }
`;

const CREATE_CART = gql`
  mutation CreateCart {
    createCart {
      id
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!) {
    addToCart(cartId: $cartId, productId: $productId, quantity: $quantity) {
      id
      items {
        id
        productId
        title
        price
        quantity
      }
      total
    }
  }
`;

function ProductDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  const [createCart] = useMutation(CREATE_CART);
  const [addToCartMutation] = useMutation(ADD_TO_CART);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-zinc-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-950 dark:border-white mx-auto mb-4"></div>
        <span className="text-sm font-medium">Cargando producto...</span>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-zinc-500">
        <p className="text-sm font-medium mb-4">Producto no encontrado.</p>
        <Link href="/products" className="text-xs text-zinc-950 dark:text-white underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const { product } = data;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        const { data: cartData } = await createCart();
        if (cartData?.createCart) {
          cartId = cartData.createCart.id;
          localStorage.setItem('cartId', cartId!);
        }
      }

      const { data: updatedCartData } = await addToCartMutation({
        variables: {
          cartId,
          productId: product.id,
          quantity
        }
      });

      if (updatedCartData?.addToCart) {
        // Guardar items locales para el Navbar y el Cart page fallback
        const cartItems = updatedCartData.addToCart.items;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        setAdded(true);
        // Disparar evento para actualizar el navbar
        window.dispatchEvent(new Event('cart-updated'));
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Gallery Placeholder */}
        <div className="aspect-square w-full rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
          <span className="text-zinc-400 dark:text-zinc-600 text-sm font-medium">Galería de Imágenes</span>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {product.price.toLocaleString('es-MX', { style: 'currency', currency: product.currency })}
            </p>
            <hr className="border-zinc-100 dark:border-zinc-800" />
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {product.description || 'Este producto no cuenta con una descripción detallada en este momento.'}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Cantidad:</span>
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{adding ? 'Agregando...' : added ? '¡Añadido al Carrito!' : 'Añadir al Carrito'}</span>
            </button>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <Truck className="w-5 h-5 text-zinc-400" />
                <span>Envío express disponible</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
                <span>Garantía de calidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="flex-1 bg-white dark:bg-black min-h-screen">
        <ProductDetailContent />
      </div>
    </ApolloProvider>
  );
}
