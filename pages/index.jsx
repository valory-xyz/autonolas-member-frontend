import dynamic from 'next/dynamic';

const VeOlas = dynamic(() => import('components/Home/VeOlas'), {
  ssr: false,
});

export default VeOlas;
