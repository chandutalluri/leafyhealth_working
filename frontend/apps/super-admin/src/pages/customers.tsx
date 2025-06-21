import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import CustomerRelationshipHub from '../components/business-domains/CustomerRelationshipHub';

export default function CustomersPage() {
  return (
    <Layout>
      <CustomerRelationshipHub />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};