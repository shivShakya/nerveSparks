import React, { useState, useEffect } from 'react';
import './Dealership.css';
import { useParams, useNavigate } from 'react-router-dom';
const URL = 'https://back-shivshakya.vercel.app';

const Dealership = () => {
  const [dealerShip, setDealerShip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log({'id': id})
  useEffect(() => {
    getData2();
    getData();
  }, [id]);

  async function getData() {
    try {
      const token = localStorage.getItem('Authorization');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token,
      };

      const response = await fetch(`${URL}/cars/${id}/dealerships`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDealerShip(data);
  
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
        Authorization: token,
      };

      const response2 = await fetch(`${URL}/dealership`, {
        method: 'GET',
        headers: headers,
      });

      if (!response2.ok) {
        throw new Error('Network response was not ok');
      }

      const data2 = await response2.json();
      setDealerShip(data2);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
      setLoading(false);
    }
  }

  console.log(dealerShip);

  function handleCars(id){
        console.log(id);
        navigate(`/cars/${id}`);
  }

  function handleDeals(id){
    console.log(id);
    navigate(`/deal/${id}`);
}

  return (
    <div className='dealership'>
      <h1>Dealership</h1>

      {loading ? (
        <p>Loading...</p>
      ): (
        <div className='dealer-list'>
          {dealerShip.map((dealer) => (
            <div key={dealer.id} className='dealer-item'>
              <h2>{dealer.dealership_email}</h2>
              <p>{dealer.dealership_name}</p>
              <p>{dealer.dealership_location}</p>
              <h3>Person Details</h3>
              <p>{dealer.dealership_info.contact_person}</p>
              <p>{dealer.dealership_info.contact_email}</p>
              <p>{dealer.dealership_info.phone}</p>
              <button onClick={()=> handleCars(dealer.dealership_id)}>Check Cars</button>
              <button onClick={()=> handleDeals(dealer.deals)}>Check Deals</button>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Dealership;
