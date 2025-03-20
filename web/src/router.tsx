import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage.tsx';
import ConsentPage from './pages/ConsentPage/ConsentPage.tsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/consent-page" element={<ConsentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
