
import './App.css';
import Post from './Post';
import Header from './Header';
import {Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Registerpage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/"element={<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Registerpage />} />
      </Route>
   </Routes>  
  );
}

export default App;
