export default function Simple() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0fdf4',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#059669', fontSize: '2rem', marginBottom: '20px' }}>
        🌿 LeafyHealth - Working!
      </h1>
      <p style={{ color: '#374151', fontSize: '1.2rem', marginBottom: '30px' }}>
        Fresh Organic Groceries Delivered Fast
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥬</div>
          <h3>Vegetables</h3>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🍎</div>
          <h3>Fruits</h3>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥛</div>
          <h3>Dairy</h3>
        </div>
      </div>
    </div>
  );
}