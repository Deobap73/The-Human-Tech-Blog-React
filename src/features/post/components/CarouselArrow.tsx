import React from 'react';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}

const CarouselArrow: React.FC<CarouselArrowProps> = ({ direction, onClick, disabled }) => (
  <button
    className='carouselArrow'
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
    type='button'>
    {direction === 'left' ? (
      <svg width='20' height='20' viewBox='0 0 20 20'>
        <path d='M13 16l-5-5 5-5' fill='none' stroke='#333' strokeWidth='2' strokeLinecap='round' />
      </svg>
    ) : (
      <svg width='20' height='20' viewBox='0 0 20 20'>
        <path d='M7 4l5 5-5 5' fill='none' stroke='#333' strokeWidth='2' strokeLinecap='round' />
      </svg>
    )}
  </button>
);

export default CarouselArrow;
