import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [convertedAmount, setConvertedAmount] = useState();

  useEffect(() => {
    const fetchCurrencies = async () => {
      const response = await axios.get('https://open.er-api.com/v6/latest');
      const data = response.data;
      setCurrencies([data.base, ...Object.keys(data.rates)]);
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency !== '' && toCurrency !== '') {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = response.data;
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
      }
    };
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate && amount !== '') {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [exchangeRate, amount]);

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className='main-container'>
      <h2>Currency Converter</h2>
      <div className='inner-container'>
        <label>From:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div className='inner-container'>
        <label>To:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <div className='output'>Converted Amount: {convertedAmount}</div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
