import { useForm, Controller  } from 'react-hook-form';
import { Input, Button, Upload,Radio,Checkbox,Card ,Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AddEmployee = () => {
  const { handleSubmit, control, setValue, formState: { errors }  } = useForm();
  const { Option } = Select; 
  const { id } = useParams(); 
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); 
  
  useEffect(() => {
   
    axios.get('https://localhost:7106/api/Employee/GetCountry')
      .then((response) => {
        console.log(response)
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
   
    if (selectedCountry) {
      axios.get(`https://localhost:7106/GetState?Id=${selectedCountry}`)
        .then((response) => {
          console.log(response)
          setStates(response.data);
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
   
    if (selectedState) {
      axios.get(`https://localhost:7106/GetCity?Id=${selectedState}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
        });
    }
  }, [selectedState]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState(null); 
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  useEffect(() => {
    
    if (id) {
     
      axios
        .get(`https://localhost:7106/api/Employee/GetId?id=${id}`)
        .then((response) => {
          if (response) {
            const employeeData = response.data;
            Object.keys(employeeData).forEach((key) => {
              setValue(key, employeeData[key]);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);


  
  const onSubmit = async (data) => {
    try {
      
      const formDataWithFile = new FormData();
      formDataWithFile.append('id', id);
      formDataWithFile.append('firstName', data.firstName);
      formDataWithFile.append('lastName', data.lastName);
      formDataWithFile.append('salary', data.salary);
      formDataWithFile.append('email', data.email);
      formDataWithFile.append('zipcode', data.zipCode);
      formDataWithFile.append('password', data.password);
      formDataWithFile.append('countryId', selectedCountry);
      formDataWithFile.append('stateId', selectedState);
      formDataWithFile.append('cityId', selectedCity);
      formDataWithFile.append('gender', data.gender);
      formDataWithFile.append('maritialStatus', data.maritialStatus);
      formDataWithFile.append('hobbies', data.hobbies);
      formDataWithFile.append('files', data.files[0]);


      const response = id
      ? await axios.put(`https://localhost:7106/api/Employee/UpdateEmployee?id=${id}`, formDataWithFile)
      : await axios.post('https://localhost:7106/api/Employee/AddEmployee', formDataWithFile);

    console.log(id ? 'Employee updated:' : 'New employee added:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
   
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
       <Card title="Employee Information"> 
      <h4>FirstName</h4>
      <Controller
        name="firstName"
        control={control}
        rules={{ required: 'First Name is required' }}
       
        render={({ field }) => (
          <Input
            {...field}
            
            placeholder="First Name"
            type="text"
          />
        )}
      />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <h4>LastName</h4>
      <Controller
        name="lastName"
        control={control}
       
        rules={{ required: 'Last Name is required' }}
        render={({ field }) => (
          <Input
            {...field}
            
            placeholder="Last Name"
            type="text"
          />
        )}
      />
      {errors.lastName && <p>{errors.lastName.message}</p>}

      <h4>Salary</h4>
      <Controller
        name="salary"
        control={control}
        
        rules={{ required: 'Salary is required', validate: (value) => value > 5000 || 'Salary must be greater than 5000', }}
        render={({ field }) => (
          <Input
            {...field}
           
            placeholder="Salary"
            type="number"
          />
        )}
      />
      {errors.salary && <p>{errors.salary.message}</p>}

      <h4>Email</h4>
      <Controller
        name="email" 
        control={control}
        
        rules={{ required: 'Email is required', pattern: /^\S+@\S+$/i }} 
        render={({ field }) => (
          <Input
            {...field}
            
            placeholder="Email" 
            type="text" 
          />
        )}
      />
   {errors.email && <p>{errors.email.message}</p>}

   <h4>Zip Code</h4>
          <Controller
            name="zipCode"
            control={control}
            defaultValue=""
            rules={{ required: 'Zip Code is required', pattern: /^[0-9]{6}$/ }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Zip Code (6 numbers)"
                type="text"
              />
            )}
          />
          {errors.zipCode && <p>{errors.zipCode.message}</p>}

          <Controller
          name="password"
          control={control}
          rules={{
          required: 'Password is required',
           validate: (value) => {
      
          if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)) {
            return 'Password must have at least 1 uppercase, 1 number, and 1 special character';
          }
          if (value.length < 6 || value.length > 16) {
            return 'Password must be between 6 and 16 characters';
          }
            return true; 
          },
        }}
        render={({ field }) => (
        <>
      <h4>Password</h4>
      <Input
        {...field}
        placeholder="Password"
        type="password"
         />
      </>
      )}
    />
        <h4>Country</h4>
        <Select onChange={handleCountryChange} value={selectedCountry}>
          {countries.map((country) => (
            <Option key={country.id} value={country.id}>
              {country.countryName}
            </Option>
          ))}
        </Select>

        <h4>State</h4>
        <Select onChange={handleStateChange} value={selectedState}>
          {states.map((state) => (
            <Option key={state.id} value={state.id}>
              {state.stateName}
            </Option>
          ))}
        </Select>

        <h4>City</h4>
        <Select onChange={handleCityChange} value={selectedCity}>
          {cities.map((city) => (
            <Option key={city.id} value={city.id}>
              {city.cityName}
            </Option>
          ))}
        </Select>

   <h4>Gender</h4>
   <Controller
        name="gender"
        control={control}
        defaultValue="" 
        render={({ field }) => (
          <Radio.Group {...field}>
            <Radio value="M">Male</Radio>
            <Radio value="F">Female</Radio>
          </Radio.Group>
        )}
      />

       <h4>MaritalStatus</h4>
        <Controller
        name="maritalStatus"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <div>
            <Checkbox {...field}>
              Are you Married
            </Checkbox>
          </div>
        )}
      />
      
       <h4>Hobbies</h4>
          <Controller
            name="hobbies"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple" // Allow multiple selections
                placeholder="Select Hobbies"
              >
                <Option value="singing">Singing</Option>
                <Option value="swimming">Swimming</Option>
                <Option value="surfing">Surfing</Option>
              </Select>
            )}
          />
          {errors.hobbies && <p>{errors.hobbies.message}</p>}

      <h4>File upload:</h4>
      <Controller
        name="files"
        control={control}
        rules={{ required: 'File is required' }}
        render={({ field }) => (
          <Upload
            fileList={field.value}
            beforeUpload={(file) => {
              setValue('files', [file]);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        )}
      />
      {errors.files && <p>{errors.files.message}</p>}

 </Card>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
};

export default AddEmployee;