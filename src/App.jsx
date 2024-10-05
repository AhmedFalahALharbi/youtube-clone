import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout'; 
import Home from './pages/Home';
import VideoDisplay from './pages/VideoDisplay';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoDisplay />} />
          <Route path="/search/:query" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
