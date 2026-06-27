'use client';

import { useQuery, gql } from '@apollo/client';
import client from '../apollo-client';
import { ApolloProvider } from '@apollo/client';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      price
      currency
    }
  }
`;

function ProductsList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-zinc-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-950 dark:border-white mx-auto mb-4"></div>
        <span className="text-sm font-medium">Cargando catálogo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-zinc-500">
        <p className="text-sm font-medium mb-4">No pudimos conectar con el servidor GraphQL.</p>
        <p className="text-xs text-zinc-400">Asegúrate de que el API Gateway esté corriendo en http://localhost:4000/graphql</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-1 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Nuestro Catálogo
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Descubre nuestros productos exclusivos importados desde tu motor headless favorito.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {data?.products?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="flex-1 bg-white dark:bg-black min-h-screen">
        <ProductsList />
      </div>
    </ApolloProvider>
  );
}
