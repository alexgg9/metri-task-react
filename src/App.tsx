import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';


const App = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
  </Routes>
);

export default App;
