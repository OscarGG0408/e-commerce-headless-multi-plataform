import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    currency: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="aspect-square w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900 overflow-hidden relative flex items-center justify-center border border-zinc-100/80 dark:border-zinc-800 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-zinc-200/40 dark:group-hover:shadow-black/80">
        <span className="text-zinc-400 dark:text-zinc-600 text-sm font-medium transition-transform duration-500 group-hover:scale-105">Sin Imagen</span>
        <div className="absolute bottom-4 right-4 bg-zinc-950/95 text-white dark:bg-white/95 dark:text-zinc-950 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-tight">
          {product.price.toLocaleString('es-MX', { style: 'currency', currency: product.currency })}
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-1">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {product.description || 'Sin descripción disponible.'}
        </p>
      </div>
    </Link>
  );
}
