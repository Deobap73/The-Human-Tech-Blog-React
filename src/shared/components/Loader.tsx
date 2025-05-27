// src/shared/components/Loader.tsx
import './styles/Loader.scss';

const Loader = () => (
  <div className='global-loader' role='status' aria-live='polite'>
    <div className='global-loader__spinner'>
      <svg viewBox='25 25 50 50' className='global-loader__svg'>
        <circle
          className='global-loader__circle'
          cx='50'
          cy='50'
          r='20'
          fill='none'
          strokeWidth='6'
        />
      </svg>
    </div>
    <span className='global-loader__msg'>Loading...</span>
  </div>
);

export default Loader;
