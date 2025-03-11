import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Class, { Structure } from '../../components/Class/Class';
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
    <Container className="classes-container page">
      <Row className="classes-header">
        <Col>
          <h1>Classes:</h1>
        </Col>
      </Row>
      <Row className="classes-header">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="classes-body">
        <Col className="classes-body-sidebar">
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
        <Col className="classes-body-content">
          { currentClass && Class( currentClass, data.structures[ currentClass as keyof typeof data.structures ] as unknown as Structure ) }
        </Col>
      </Row>
    </Container>
  );
}
