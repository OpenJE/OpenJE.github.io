import { Container, Row, Col } from 'react-bootstrap';
import './Home.css';

export default function Home() {
  return (
    <Container className="home-container page">
      <Row>
        <Col>
          <h1>Home</h1>
        </Col>
      </Row>
    </Container>
  );
}
