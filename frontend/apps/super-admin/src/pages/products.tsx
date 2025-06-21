import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import ProductEcosystem from '../components/business-domains/ProductEcosystem';

export default function ProductsPage() {
  return (
    <Layout>
      <ProductEcosystem />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};