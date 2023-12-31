import { useForm, Controller  } from 'react-hook-form';
import { Input, Button, Upload,Radio,Card ,Select} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState,} from 'react';
import { useParams } from 'react-router-dom';
import {BASE_URL,imageUrl} from './GetAllEmployee';

const AddEmployee = () => {
  const { handleSubmit, control, setValue, formState: { errors } ,reset } = useForm();
  const { Option } = Select; 
  const { id } = useParams(); 
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); 
  const [dateOfBirth, setDateOfBirth] = useState(''); 
  const [validationError, setValidationError] = useState(''); 
  const handleCountryChange = (value) => { setSelectedCountry(value);setSelectedState(null);setSelectedCity(null);};
  const handleStateChange = (value) => {  setSelectedState(value);};
  const handleCityChange = (value) => {setSelectedCity(value);};
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDateOfBirth(selectedDate);
    const currentDate = new Date();
    const selectedDateObject = new Date(selectedDate);
    
    let  ageDifferenceInYears = currentDate.getFullYear() - selectedDateObject.getFullYear();
    const birthdateHasOccurred = (
      currentDate.getMonth() > selectedDateObject.getMonth() ||
      (currentDate.getMonth() === selectedDateObject.getMonth() &&
        currentDate.getDate() >= selectedDateObject.getDate())
    );
    
    if (!birthdateHasOccurred) {
      ageDifferenceInYears--;
    }
    
    if (ageDifferenceInYears < 18) {
      setValidationError('You must be at least 18 years old.');
    } else {
      setValidationError('');
    }
  };
 
  useEffect(() => {
    axios.get(`${BASE_URL}/Employee/GetCountry`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
   
    if (selectedCountry) {
      axios.get(`${BASE_URL}/State/GetState?Id=${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
   
    if (selectedState) {
      axios.get(`${BASE_URL}/City/GetCity?Id=${selectedState}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
        });
    }
  }, [selectedState]);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
     
      axios
        .get(`${BASE_URL}/Employee/GetId?id=${id}`)
        .then((response) => {
          if (response) {
            console.log(response)
            const employeeData = response.data;
            Object.keys(employeeData).forEach((key) => {
              setValue(key, employeeData[key]);
             setValue('files', [{ name: employeeData.imageName, uid: '-1' }]);
            });
            setSelectedCountry(employeeData.countryId);
            setSelectedState(employeeData.stateId);
            setSelectedCity(employeeData.cityId);
            
          const profileImageUrl = `${imageUrl}${employeeData.imageName}`;
          setProfileImageUrl( profileImageUrl);
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
      data.maritalStatus = data.maritalStatus ? "1" : "0";
      formDataWithFile.append('firstName', data.firstName);
      formDataWithFile.append('lastName', data.lastName);
      formDataWithFile.append('salary', data.salary);
      formDataWithFile.append('email', data.email);
      formDataWithFile.append('zipcode', data.zipCode);
      formDataWithFile.append('password', data.password);
      formDataWithFile.append('address', data.address);
      formDataWithFile.append('countryId', selectedCountry);
      formDataWithFile.append('stateId', selectedState);
      formDataWithFile.append('cityId', selectedCity);
      formDataWithFile.append('gender', data.gender);
      formDataWithFile.append('birthDate', dateOfBirth);
      formDataWithFile.append('maritalStatus',data.maritalStatus);
      formDataWithFile.append('hobbies', data.hobbies);
      if (Array.isArray(data.files) && data.files.length > 0) {
        formDataWithFile.append('files', data.files[0]);
      }
         if (id && !isNaN(Number(id))) {
      formDataWithFile.append('id', id);
       }

       const url = id && !isNaN(Number(id))
       ? `${BASE_URL}/Employee/UpdateEmployee?id=${id}`
       : `${BASE_URL}/Employee/AddEmployee`;

    const response = (id && !isNaN(Number(id)))
      ? await axios.put(url, formDataWithFile)
      : await axios.post(url, formDataWithFile);

      
      if (response.status === 200)
       { 
        reset();
         setSelectedCountry(null);
         setSelectedState(null);
         setSelectedCity(null);
        console.log(id ? 'Employee updated:' : 'New employee added:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
       <Card title="Employee Information"> 
      <h4>First Name</h4>
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

      <h4>Last Name</h4>
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
   <h4>Address</h4>
      <Controller
        name="address" 
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="address" 
            type="text" 
          />
        )}
      />
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
         <h4>Date of Birth</h4>
      <input
        type="date"
        name="birthDate"
        placeholder="Select Date of Birth"
        value={dateOfBirth}
        onChange={handleDateChange}
        required 
      />
      {validationError && <p>{validationError}</p>}

        <h4>Country</h4>
        <Select name='countryId'onChange={handleCountryChange} value={selectedCountry}style={{ width: 120 }}>
          {countries.map((country) => (
            <Option key={country.id} value={country.id}>
              {country.countryName}
            </Option>
          ))}
        </Select>

        <h4>State</h4>
        <Select name='stateId' onChange={handleStateChange} value={selectedState}style={{ width: 120 }}>
          {states.map((state) => (
            <Option key={state.id} value={state.id}>
              {state.stateName}
            </Option>
          ))}
        </Select>

        <h4>City</h4>
        <Select name='cityId' onChange={handleCityChange} value={selectedCity}style={{ width: 120 }}>
          
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

       <h4>Marital Status</h4>
        <Controller
        name="maritalStatus"
        control={control}
        defaultValue={false} 
        render={({ field }) => (
          <div>
           <input type="checkbox" {...field} />
              Are you Married
          </div>
        )}
      />
      
       <h4>Hobbies</h4>
          <Controller
            name="hobbies"
            control={control}
            defaultValue={[]}
            style={{width: 120,}}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Hobbies"
              >
                <Option value="singing">singing</Option>
                <Option value="swimming">swimming</Option>
                <Option value="surfing">surfing</Option>
              </Select>
            )}
          />
          {errors.hobbies && <p>{errors.hobbies.message}</p>}

          <h4>File upload:</h4>
<Controller
  name="files"
  control={control}
  render={({ field }) => (
    <>
      <Upload
        fileList={field.value}
        beforeUpload={(file) => {
          setValue('files', [file]);
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Upload File</Button>
      </Upload>
      {field.value?.length > 0 && (
        <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
          <img
            src={profileImageUrl} // Display the image directly from the URL
            alt="Uploaded Preview"
            style={{ width: '100%', height: '100%' }}
          />
            </div>
          )}
          </>
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
