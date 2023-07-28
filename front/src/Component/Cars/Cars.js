import React, { useState, useEffect } from 'react';
import './Cars.css';
import { useNavigate, useParams } from 'react-router-dom';
const URL = "https://back-shivshakya.vercel.app";



function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {id} = useParams();
  console.log({'delaerId' : id});
  useEffect(() => {
    getData2();
    getData();
  }, [id]);

  async function getData() {
    try {
      const token = localStorage.getItem('Authorization');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
      };


      const response = await fetch(`${URL}/cars`,{
              method: 'GET',
              headers: headers,
          });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
      setLoading(false);
    }
  }


  async function getData2() {
    try {
      const token = localStorage.getItem('Authorization');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
      };


      const response = await fetch(`${URL}/dealerships/${id}/cars`,{
              method: 'GET',
              headers: headers,
          });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log({'data' : data});
      setCars(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
      setLoading(false);
    }
  }

  const handleCheckDealership = (carId) => {
    console.log( carId);
    navigate(`/dealership/${carId}`);
  };

  const handleCheckDeal= (carId) => {
    console.log(carId);
    navigate(`/deal/${carId}`);
  };

  async function handleBuyCar(carId){
          alert('Thank you ! Your Payment Details are sent to your email.');
  }

  return (
    <div className='cars'>
    <h1>Cars</h1>

    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="car-list">
        {cars.map((car) => (
          <div key={car.car_id} className="car-item">
            <h2>{car.name}</h2>
            <p>Type: {car.type}</p>
            <p>Model: {car.model}</p>
            <p>Color: {car.car_info.color}</p>
            <p>Price: {car.car_info.price}</p>
            <button onClick={()=> handleCheckDealership(car.car_id)}>Check Dealership</button>
            <button onClick={()=> handleCheckDeal(car.car_id)}>Check Deal</button>
            <button onClick={(()=> handleBuyCar(car.car_id))}>Buy the Car</button>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

export default Cars;
