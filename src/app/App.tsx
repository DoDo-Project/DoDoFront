import '@/app/styles/App.css';
import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

function App() {
  return (
    <>
      <p className="text-2xl font-bold text-blue-300">테일윈드 v4 테스트</p>
      <DoDoLogo width={200} height={100} />
    </>
  );
}

export default App;
