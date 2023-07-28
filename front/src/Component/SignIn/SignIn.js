import React, { useState } from 'react';

const URL = "https://back-shivshakya.vercel.app";

function SignIn() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user_email, setUserEmail] = useState('');
  const [user_location, setUserLocation] = useState('');
  const [user_info, setUserInfo] = useState({
    name: '',
    age: 0,
    occupation: '',
    phone: '',
  });

  const [vehicle_info, setVehicleInfo] = useState([]);

  async function postData() {
    const data = {
      name: name,
      email: email,
      password: password,
      user_email: user_email,
      user_location: user_location,
      user_info: user_info,
      vehicle_info: vehicle_info,
    };

    try {

      const response = await fetch(`${URL}/login`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result) {
        alert('You are registered!');
      } else {
        alert('Some error occurred!');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('An error occurred while registering.');
    }
  }

  return (
    <div className='signIn'>
      <h1>SignIn</h1>
      <div className='log-form'>
        <h3>Name</h3>
        <input type='text' value={name} onChange={(e) => { setName(e.target.value) }} className='in-log' placeholder='Name' />

        <h3>Email</h3>
        <input type='email' value={email} onChange={(e) => { setEmail(e.target.value) }} className='in-log' placeholder='Email' />

        <h3>Password</h3>
        <input type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} className='in-log' placeholder='Password' />

        <h3>User Email</h3>
        <input type='text' value={user_email} onChange={(e) => { setUserEmail(e.target.value) }} className='in-log' placeholder='User Email' />

        <h3>User Location</h3>
        <input type='text' value={user_location} onChange={(e) => { setUserLocation(e.target.value) }} className='in-log' placeholder='User Location' />

        <h3>User Info</h3>
        <input type='text' value={user_info.name} onChange={(e) => setUserInfo({ ...user_info, name: e.target.value })} className='in-log' placeholder='Name' />
        <input type='number' value={user_info.age} onChange={(e) => setUserInfo({ ...user_info, age: parseInt(e.target.value) })} className='in-log' placeholder='Age' />
        <input type='text' value={user_info.occupation} onChange={(e) => setUserInfo({ ...user_info, occupation: e.target.value })} className='in-log' placeholder='Occupation' />
        <input type='text' value={user_info.phone} onChange={(e) => setUserInfo({ ...user_info, phone: e.target.value })} className='in-log' placeholder='Phone' />

        <h3>Vehicle Info</h3>
        <br /><br /><br />
        <button className='log-btn' onClick={postData}>Submit</button>
      </div>
    </div>
  )
}

export default SignIn;
