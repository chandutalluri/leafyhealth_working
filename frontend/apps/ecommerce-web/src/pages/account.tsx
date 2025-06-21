import Head from 'next/head'

export default function AccountPage() {
  return (
    <>
      <Head>
        <title>My Account - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>
            <div className="glass-card p-12">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-xl text-gray-600">
                Manage your profile, orders, and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}