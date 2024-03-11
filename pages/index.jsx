import dynamic from 'next/dynamic';

const VeOlas = dynamic(() => import('components/Home/VeOlas'), {
  ssr: false,
  loading: () => <p>Loading from client side...</p>,
});

export default VeOlas;
