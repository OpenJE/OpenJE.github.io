import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Class from './Class/Class';
import './Classes.css';
import data from '../../assets/F3.json';

export default function Classes() {
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
            { currentClass && Class( currentClass, data.structures[ currentClass as keyof typeof data.structures ] ) }
          </Col>
      </Row>
    </Container>
  );
}
