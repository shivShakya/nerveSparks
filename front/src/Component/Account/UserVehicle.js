import React, { useState, useEffect } from 'react';
import './UserVehicle.css';
const URL = 'https://back-shivshakya.vercel.app';

function UserVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const token = localStorage.getItem('Authorization');
  
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
       const userId = payload.user.user_id;
  
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
  
      const response = await fetch(`${URL}/users/${userId}/vehicles`, {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error('Network error');
      }
  
      const data = await response.json();
      if (!data) {
        throw new Error("No data received");
      }
  
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      console.error("Error while fetching data:", err.message);
      setError("Failed to fetch data");
      setLoading(false);
    }
  }
  
 
  return (
    <div className='container'>
      {loading ? (
        <h1>Loading ...</h1>
      ) : error ? (
        <div>
          <h1>Please Login to see your car .</h1>
        </div>
      ) : (
        vehicles && vehicles.length > 0 ? (
          vehicles.map((car) => (
            <div key={car.car_id} className='vehicle-item'>
              <h4>Your Car Details</h4>
              <h1>{car.name}</h1><hr/>
              <h1>Type : {car.type}</h1>
              <h1>Model : {car.model}</h1>
              <h1>Color : {car.car_info.color}</h1>
              <h1>Price : {car.car_info.price} Rs</h1>
            </div>
          ))
        ) : (
          <div>
            <h1>No Vehicle</h1>
          </div>
        )
      )}
    </div>
  );
}

export default UserVehicles;
