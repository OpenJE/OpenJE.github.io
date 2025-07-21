import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';

import VanBuren from './pages/VanBuren/VanBuren';
import JeffersonEngine from './pages/JeffersonEngine/JeffersonEngine';
import './App.css';

const Nav = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <>
      <h1>OpenJE</h1>
      <nav>
        <form onSubmit={ ( e ) => e.preventDefault() }>
          <button onClick={ () => navigate( '/' ) }>Home</button>
          <button onClick={ () => navigate( '/van-buren' ) }>Van Buren</button>
          <button onClick={ () => navigate( '/jefferson-engine' ) }>Jefferson Engine</button>
        </form>
      </nav>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Router>
        <header>
          <Nav />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/van-buren" element={<VanBuren />} />
            <Route path="/jefferson-engine" element={<JeffersonEngine />} />
          </Routes>
        </main>
        <footer>
          <p>Open Jefferson Engine</p>
        </footer>
      </Router>
    </div>
  );
}

export default App;
