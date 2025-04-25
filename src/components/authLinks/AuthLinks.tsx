// src/components/authLinks/AuthLinks.tsx

import './AuthLinks.scss';

const AuthSocial = () => {
  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className='social-login'>
      <button onClick={() => handleOAuth('google')} className='google'>
        Continue with Google
      </button>
      <button onClick={() => handleOAuth('github')} className='github'>
        Continue with GitHub
      </button>
    </div>
  );
};

export default AuthSocial;
