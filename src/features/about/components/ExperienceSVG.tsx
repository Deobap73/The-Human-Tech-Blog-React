// src/features/about/components/ExperienceSVG.tsx

const ExperienceSVG: React.FC = () => (
  <svg
    className='experience__svg'
    width='900'
    height='650'
    viewBox='0 0 900 650'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ width: '100%', height: '100%' }}>
    <style>
      {`
        .line {
          stroke:rgba(25, 181, 254, 0.22);
          stroke-width: 7;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}
    </style>

    {/* SVG da ESQUERDA - subido 3rem (48px) */}
    <g transform='translate(0,-48)'>
      {/* Linha vertical principal com canto arredondado no topo (direita) */}
      <path
        className='line'
        d='
          M 390 590
          V 60
          Q 390 20 350 20
          H 50
        '
      />
      {/* Primeiro andar - linhas verticais (direita e esquerda trocadas) */}
      <path className='line' d='M 300 4 V 94' />
      <path className='line' d='M 80 4 V 94' />
      {/* Linha horizontal inferior (curva invertida) — SUBIU 2rem */}
      <path
        className='line'
        d='
    M 390 452
    Q 390 412 350 412
    H 50
  '
      />
      {/* Braços verticais inferiores (espelhados) — SUBIRAM 2rem */}
      <path className='line' d='M 300 396 V 486' />
      <path className='line' d='M 80 396 V 486' />
    </g>

    {/* SVG da DIREITA - posição normal, deslocado à direita */}
    <g transform='translate(330,0)'>
      {/* Linha vertical principal com canto arredondado no topo */}
      <path
        className='line'
        d='
          M 60 590
          V 60
          Q 60 20 100 20
          H 400
        '
      />
      {/* Primeiro andar - linhas verticais (esquerda e direita) */}
      <path className='line' d='M 150 4 V 94' />
      <path className='line' d='M 370 4 V 94' />
      {/* Linha horizontal inferior — DESCIDA 5rem */}
      <path
        className='line'
        d='
          M 60 484
          Q 60 444 100 444
          H 400
        '
      />
      {/* Braços verticais inferiores — DESCIDA 5rem */}
      <path className='line' d='M 150 428 V 518' />
      <path className='line' d='M 370 428 V 518' />
    </g>
  </svg>
);

export default ExperienceSVG;
