import React, { useState, useEffect } from 'react';
import './App.css';
interface FormData {
  text: string;
}

const FormData: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ text: '' });
  const [apiData, setApiData] = useState<any>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, text: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${formData.text}?api_key=UgZoAde0BqkyaV8mpp1yQPG4FIeaNSgVlvWQBgf5`);
      const data = await response.json();
      setApiData(data);
    } catch (error:any) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleRandom = async() => {
    // generate a random string and set it as the value of formData.text
    try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=UgZoAde0BqkyaV8mpp1yQPG4FIeaNSgVlvWQBgf5`);
        const data = await response.json();
        setApiData(data);
      } catch (error:any) {
        console.log(error);
        alert(error.message);
      }
    };

  return (
    <div className="main-container" style={{ backgroundImage: `url("https://th.bing.com/th/id/OIP.R1L3kCraPi6uv7LL-VxEqwHaGA?pid=ImgDet&rs=1/150x150")` }}>
      {apiData ? (
        <div className="details-container">
            <p>Name: {apiData.name}</p>
            <p>NASA JPL URL: <a href={apiData.nasa_jpl_url}>{apiData.nasa_jpl_url}</a></p>
            <p>Is Potentially Hazardous Asteroid: {apiData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
      </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <input type="text" value={formData.text} onChange={handleChange} placeholder="Enter Asteroid ID" />
          <button type="submit" disabled={!formData.text}>Submit</button>
          <button type="button" onClick={handleRandom}>Generate Random</button>
        </form>
      )}
    </div>
  );
};

export default FormData;

