import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ScreenTest } from './pages/ScreenTest';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg text-slate-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screen-test" element={<ScreenTest />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
