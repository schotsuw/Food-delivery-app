import  { useState } from 'react';
// import woman from '../../assets/womaneat.png';
import herofood from '../assets/herofood.png';
import {  
    Button, 
    TextField,
  } from '@mui/material';

const Hero = () => {
    const [postcode, setPostcode] = useState('');
  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-8">
          <div>
            <p className="text-gray-600 mb-2">Order Restaurant food, takeaway and groceries.</p>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Feast Your Senses,
              <br />
              <span className="text-red-500">Fast and Fresh</span>
            </h1>
          </div>

          <div className="max-w-md">
            <p className="mb-4">Enter a postcode to see what we deliver</p>
            <div className="flex gap-2">
              <TextField
                fullWidth
                placeholder="e.g. E12 345"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                variant="outlined"
              />
              <Button 
                variant="contained"
                className="!bg-red-500 !text-white !px-8"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <img 
            src={herofood}
            alt="People enjoying food"
            className="w-full rounded-lg"
          />
          
          
        </div>
      </div>
  )
}

export default Hero