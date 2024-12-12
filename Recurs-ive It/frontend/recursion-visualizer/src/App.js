import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './landing';
import SignUp from './signup';
import Login from './login';
import Recursion from './recursion';
import Layout from './layout';
import AuthPage from './AuthPage';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recursion" element={<Recursion />} />
        <Route path="/AuthPage" element={<AuthPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;