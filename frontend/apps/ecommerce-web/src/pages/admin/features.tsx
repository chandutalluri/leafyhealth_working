
import React from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeatureStatus from '@/components/admin/FeatureStatus';

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Feature Status - LeafyHealth Admin</title>
        <meta name="description" content="Monitor implementation status of all ecommerce features" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🌿 LeafyHealth Feature Status
              </h1>
              <p className="text-xl text-gray-600">
                Complete overview of your advanced ecommerce implementation
              </p>
            </div>
            
            <FeatureStatus />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
