import React, { useState, useEffect } from 'react';
import './Deal.css';
import { useParams } from 'react-router-dom';
const URL = 'https://back-shivshakya.vercel.app';

const Deal = () => {
  const [deal, setDeal] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  useEffect(() => {
   // getData2();
    getData();
  }, [id]);
  console.log({'id': id});
  async function getData() {
    try {
      const token = localStorage.getItem('Authorization');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token,
      };

      const response = await fetch(`${URL}/cars/${id}/deals`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if(data){
        setDeal(data);
      }
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
      const ids= id.split(',');
      console.log(ids[0]);
      

      const promises = ids.map(async (singleId) => {
        const response = await fetch(`${URL}/dealerships/${singleId}/deals`, {
          method: 'GET',
          headers: headers,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        return response.json();
      });
     
      const data = await Promise.all(promises);
     
      const mergedData = data.flat(); 
      if (mergedData) {
        setDeal(mergedData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
      setLoading(false);
    }
  }
  console.log(deal);


  return (
    <div className='dealership'>
      <h1>Deals </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className='dealer-list'>
          {deal.map((deal) => (
            <div key={deal.id} className='dealer-item'>
              <h2> Car-Id : {deal.deal_id}</h2>
              <p> Discount : {deal.deal_info.discount}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Deal;
