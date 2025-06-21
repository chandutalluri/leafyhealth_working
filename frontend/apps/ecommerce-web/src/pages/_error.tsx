import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#374151' }}>
          {statusCode ? `Server Error ${statusCode}` : 'Client Error'}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          {statusCode === 404 ? 'Page not found' : 'Something went wrong'}
        </p>
        <a 
          href="/" 
          style={{ 
            color: '#059669', 
            textDecoration: 'none',
            padding: '12px 24px',
            border: '2px solid #059669',
            borderRadius: '8px',
            display: 'inline-block'
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;