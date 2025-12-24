const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(express.static('public'));

app.get('/api/user', async (req, res) => {
  try {
    // Random user
    const userResp = await axios.get('https://randomuser.me/api/');
    const u = userResp.data.results[0];
    const user = {
      firstName: u.name.first,
      lastName: u.name.last,
      gender: u.gender,
      picture: u.picture.large,
      age: u.dob.age,
      dob: u.dob.date,
      city: u.location.city,
      country: u.location.country,
      fullAddress: `${u.location.street.number} ${u.location.street.name}`
    };

    // Country data
    const countryResp = await axios.get(`https://restcountries.com/v3.1/name/${user.country}`);
    const c = countryResp.data[0];
    const currencyCodes = c.currencies ? Object.keys(c.currencies) : [];
    const code = currencyCodes[0] || 'N/A';
    const country = {
      name: c.name.common,
      capital: c.capital?.[0] || 'N/A',
      languages: c.languages ? Object.values(c.languages).join(', ') : 'N/A',
      currency: code === 'N/A' ? { code: 'N/A', name: 'N/A', symbol: '' } : {
        code,
        name: c.currencies[code].name,
        symbol: c.currencies[code].symbol
      },
      flag: c.flags?.svg || c.flags?.png || ''
    };

    // Exchange rates
    let exchange = { base: code, USD: 'N/A', KZT: 'N/A' };
    if (process.env.EXCHANGE_API_KEY && code !== 'N/A') {
      try {
        const ex = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${code}`);
        const rates = ex.data.conversion_rates || {};
        exchange = { base: code, USD: rates.USD?.toFixed(4) || 'N/A', KZT: rates.KZT?.toFixed(2) || 'N/A' };
      } catch (e) {}
    }

    // News
    let news = [];
    if (process.env.NEWS_API_KEY) {
      try {
        const n = await axios.get('https://newsapi.org/v2/everything', {
          params: { q: user.country, language: 'en', pageSize: 10, apiKey: process.env.NEWS_API_KEY }
        });
        news = (n.data.articles || [])
          .filter(a => a.title?.toLowerCase().includes(user.country.toLowerCase()))
          .slice(0, 5)
          .map(a => ({ title: a.title, image: a.urlToImage || '', description: a.description || '', url: a.url }));
      } catch (e) {}
    }

    res.json({ user, country, exchange, news });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));