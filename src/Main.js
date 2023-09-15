import React from 'react'
import GetAllEmployee from './GetAllEmployee';
import {useNavigate} from 'react-router-dom';
import { Button, Row, Col } from 'antd';

const Main = () => {
    const navigate = useNavigate();
    const navigateToAddEmployee = () => {
      navigate('/addEmployee/:id');
    };

  return (
    <div>
      <Row>
          <h1>Employee Data</h1>
      </Row>
        <Col offset={20} span={10}>
          <Button type="primary" onClick={navigateToAddEmployee}>
            Add Employee
          </Button>
        </Col>
      <Row>
          <GetAllEmployee />
      </Row>
    </div>
  );
}
export default Main
