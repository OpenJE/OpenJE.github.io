import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Class, { Structure } from './Class/Class';
import './Classes.css';
import data from '../../assets/F3.json';

export default function Classes() {
  const [ currentClass, setCurrentClass ] = React.useState<string | null>( null );
  const [ searchQuery, setSearchQuery ] = React.useState<string>('');

  // Filter classes based on the search query
  const filteredClasses = Object.keys( data.structures ).filter( ( className ) => {
    const demangledName = data.structures[ className as keyof typeof data.structures ].demangled_name || className;
    return demangledName.toLowerCase().includes( searchQuery.toLowerCase() );
  });

  return (
    <Container className="classes-container">
      <Row>
        <Col>
          <h1>Jefferson Engine Classes:</h1>
        </Col>
      </Row>
      <Row className="main">
        <Col className="sidebar">
          <Form.Control
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul>
            { filteredClasses.map( ( className ) => (
              <li key={ className }>
                <Button onClick={ () => setCurrentClass( className ) }>
                  {data.structures[ className as keyof typeof data.structures ].demangled_name || className }
                </Button>
              </li>
            ))}
          </ul>
        </Col>
        <Col className="content">
          { currentClass && Class( currentClass, data.structures[ currentClass as keyof typeof data.structures ] as unknown as Structure ) }
        </Col>
      </Row>
    </Container>
  );
}
