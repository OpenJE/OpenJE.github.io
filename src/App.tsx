import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup } from 'react-bootstrap';
import Classes from './components/Classes/Classes';
import './App.css';

const Home = () => {
  return (
    <Container className="home-container">
      <Row>
        <Col>
          <h1>Jefferson Engine Documentation</h1>
        </Col>
      </Row>
    </Container>
  );
}

const Nav = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <Container fluid className="nav-container">
      <InputGroup className="nav">
        <Button onClick={ () => navigate( '/' ) }>Home</Button>
        <Button onClick={ () => navigate( '/classes' ) }>Classes</Button>
      </InputGroup>
    </Container>
  );
}

function App() {
  return (
    <Container className="app-container">
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
