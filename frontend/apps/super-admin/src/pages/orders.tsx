import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import OrderOperations from '../components/business-domains/OrderOperations';

export default function OrdersPage() {
  return (
    <Layout>
      <OrderOperations />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};