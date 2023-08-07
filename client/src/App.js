import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { Provider } from 'react-redux';
import store from './utils/store';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';

// Move ApolloClient initialization outside the App component
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // backend URL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function RoutesComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('id_token');
    if (token && (window.location.pathname === '/signup')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home />} 
      />
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/signup" 
        element={<SignUp />} 
      />
    </Routes>
  );
}

function App() {
  // Use the location to determine whether to show the header
  const showHeader = window.location.pathname !== '/login' && window.location.pathname !== '/signup';

  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Provider store={store}>
            {showHeader && <Header />} {/* Render the header conditionally */}
            <RoutesComponent />
          </Provider>
        </>
      </Router>
      <Footer /> {/* Footer component gets used */}
    </ApolloProvider>
  );
}

export default App;
