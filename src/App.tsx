import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup } from 'react-bootstrap';
import data from './assets/F3.json';
import './App.css';

const ClassDetails = ( className: string ) => {
  const cls = data.structures[ className as keyof typeof data.structures ];

  if (!cls) {
    return <div>Class not found!</div>;
  }

  return (
    <Container className="class-container">
      <h2>{ cls.demangled_name || className }</h2>
      <h3>Members</h3>
      <ul>
        { Object.entries( cls.members ).map( ( [ offset, member ] ) => (
          <li key={ offset }>
            Offset: { offset }, Name: { member.name }, Type: { member.type }
          </li>
        ))}
      </ul>
      <h3>Methods</h3>
      <ul>
        { Object.entries( cls.methods ).map( ( [ ea, method ] ) => (
          <li key={ ea }>
            Name: { method.name }, Type: { method.type }
          </li>
        ))}
      </ul>
      <h3>Vtables</h3>
      <ul>
        { Object.entries( cls.vftables ).map( ( [ ea, vftable ] ) => (
          <li key={ ea }>
            EA: { ea }, Length: { vftable.length }
          </li>
        ))}
      </ul>
    </Container>
  );
};

const Classes = () => {
  const [ currentClass, setCurrentClass ] = React.useState<string | null>( null );
  return (
    <Container className="classes-container">
      <Row>
        <Col>
          <h1>Jefferson Engine Classes:</h1>
        </Col>
      </Row>
      <Row className="main">
        <Col className="sidebar">
            <ul>
              { Object.keys(data.structures).map(( className ) => (
                <li key={ className }>
                  <Button onClick={ () => setCurrentClass( className ) }>
                    { data.structures[ className as keyof typeof data.structures ].demangled_name || className }
                  </Button>
                </li>
              ))}
            </ul>
          </Col>
          <Col className="content">
            { currentClass && ClassDetails( currentClass ) }
          </Col>
      </Row>
    </Container>
  );
}

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
