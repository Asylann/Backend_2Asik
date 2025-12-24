const btn = document.getElementById('btn');
const profile = document.getElementById('profile');
const country = document.getElementById('country');
const exchange = document.getElementById('exchange');
const news = document.getElementById('news');

function el(tag, txt, cls) {
  const e = document.createElement(tag);
  if (txt) e.textContent = txt;
  if (cls) e.className = cls;
  return e;
}

btn.addEventListener('click', async () => {
  btn.disabled = true;
  btn.textContent = 'Loading...';
  try {
    const res = await fetch('/api/user');
    const data = await res.json();

    // Profile
    profile.innerHTML = '';
    const profileDiv = el('div', null, 'profile-header');
    const img = document.createElement('img');
    img.src = data.user.picture;
    img.alt = 'Profile';
    img.className = 'profile-img';
    profileDiv.appendChild(img);

    const info = el('div', null, 'profile-info');
    const name = el('div', `${data.user.firstName} ${data.user.lastName}`, 'profile-name');
    info.appendChild(name);
    info.appendChild(el('p', `Gender: ${data.user.gender}`));
    info.appendChild(el('p', `Age: ${data.user.age}`));
    info.appendChild(el('p', `DOB: ${new Date(data.user.dob).toLocaleDateString()}`));
    info.appendChild(el('p', `City: ${data.user.city}`));
    info.appendChild(el('p', `Country: ${data.user.country}`));
    info.appendChild(el('p', `Address: ${data.user.fullAddress}`));
    profileDiv.appendChild(info);
    profile.appendChild(profileDiv);

    // Country
    country.innerHTML = '';
    country.appendChild(el('h3', 'Location Details'));
    const flag = document.createElement('img');
    flag.src = data.country.flag;
    flag.alt = data.country.name;
    flag.className = 'flag';
    country.appendChild(flag);
    const countryGrid = el('div', null, 'info-grid');
    countryGrid.appendChild(el('p', `${data.country.name}`));
    countryGrid.appendChild(el('p', `Capital: ${data.country.capital}`));
    countryGrid.appendChild(el('p', `Languages: ${data.country.languages}`));
    countryGrid.appendChild(el('p', `Currency: ${data.country.currency.code}`));
    country.appendChild(countryGrid);

    // Exchange
    exchange.innerHTML = '';
    exchange.appendChild(el('h3', 'Exchange Rates'));
    const exGrid = el('div', null, 'info-grid');
    exGrid.appendChild(el('p', `1 ${data.exchange.base} = ${data.exchange.USD} USD`));
    exGrid.appendChild(el('p', `1 ${data.exchange.base} = ${data.exchange.KZT} KZT`));
    exchange.appendChild(exGrid);

    // News
    news.innerHTML = '';
    news.appendChild(el('h3', 'Latest News'));
    if (data.news && data.news.length) {
      data.news.forEach(a => {
        const card = el('div', null, 'news-card');
        if (a.image) {
          const i = document.createElement('img');
          i.src = a.image;
          i.alt = a.title;
          i.className = 'news-img';
          card.appendChild(i);
        }
        const content = el('div', null, 'news-content');
        content.appendChild(el('h4', a.title));
        content.appendChild(el('p', a.description));
        const link = document.createElement('a');
        link.href = a.url;
        link.textContent = 'Read full article →';
        link.target = '_blank';
        content.appendChild(link);
        card.appendChild(content);
        news.appendChild(card);
      });
    } else {
      news.appendChild(el('p', 'No news available', 'empty'));
    }
  } catch (err) {
    alert('Failed to fetch data');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Get Random User';
  }
});