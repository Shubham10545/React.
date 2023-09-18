import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Row, Col } from 'antd';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const GetAllEmployee=()=> {
  const [employeeData, setEmployeeData] = useState([]);
  const baseUrl = 'https://localhost:7106/Images/';
  const navigate = useNavigate();

  
  const handleUpdate = (id) => { 
      navigate(`/addEmployee/${id}`);
    }
        
  useEffect(() => {
    

    axios
      .get('https://localhost:7106/api/Employee/GetAllEmployee')
      .then((response) => {
        console.log(response);
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); 

  const handleDelete = (id) => {
    axios
      .delete(`https://localhost:7106/api/Employee/DeleteEmployee?id=${id}`)
      .then((response) => {
        setEmployeeData(employeeData.filter((employee) => employee.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const columns = [
    
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'FirstName',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Marital Status',
      dataIndex: 'maritalStatus',
      key: 'maritalStatus',
      render: (maritalStatus) => {
        return maritalStatus === 1 ? 'Married' : 'Single';
      },
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (birthDate) => {
        return new Date(birthDate).toLocaleDateString();
      },
    },
    {
      title: 'Hobbies',
      dataIndex: 'hobbies',
      key: 'hobbies',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => {
        return `₹${salary.toFixed(2)}`;
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      key: 'zipCode',
    },
    {
      title: 'Photo',
      dataIndex: 'imageName',
      key: 'imageName',
      render: (imageName) => (
        <img src={baseUrl + imageName}  style={{ width: '50px', height: '50px' }} />
      ),
    }, 
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button>Delete</Button>
        </Popconfirm>
      ),
    },
    {
      title: 'Update',
      key: 'update',
      render: (text, record) => (
        <Button onClick={() => handleUpdate(record.id)}>Update</Button>
      ),
    },
  ];

  return (
  <>
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
      <Table dataSource={employeeData.map((item) => ({ ...item, key: item.id }))} columns={columns} />
      </Col>
      </Row>
    </div>
    </>
  );
}

export default GetAllEmployee;
