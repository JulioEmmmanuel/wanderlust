// Foursquare API Info
const clientId = 'Q3CL1AOA2LHVWCICGNEY2SWETZKFUANXSSBMP5WFMHJ4VJZL';
const clientSecret = 'KVWURBPTM5MEVQRNBC5URMISKSSHFDXXGAWH0SFKTYOYP5XO';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const limit = 15;
const photoUrl = "https://api.foursquare.com/v2/venues/"


// APIXU Info
const apiKey = 'b1753c3b833846c492e224236190608';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Add AJAX functions here:
const getVenues = async () => {
	const city = $input.val();
  const urlToFetch = `${url}${city}&limit=${limit}&client_id=${clientId}&client_secret=${clientSecret}&v=20190806`;
  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(location => location.venue);
      return venues;
    }
  }

  catch (error) {
    console.log(error);
  }
}
/*
  const getPhotos = async (venueId) => {
 		const url2ToFetch = photoUrl + venueId + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20190807';
   try {
     const response = await fetch(url2ToFetch);
     if (response.ok) {
       const jsonResponse = await response.json();
       const photos = jsonResponse.response.venue.photos.groups[1].items[0].prefix + 'width300' + jsonResponse.response.venue.photos.groups[1].items[0].suffix;
       return photos;
     }
   }
   catch(err){console.log(err)}
  }
*/
const getForecast = async () => {
  const urlToFetch = `${forecastUrl}${apiKey}&q=${$input.val()}&days=7&hour=11`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const days = jsonResponse.forecast.forecastday;
      return days;
    }
  }catch (error) {
    console.log(error);
  }
}

// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(async ($venue, index) => {
    let randomNumber = Math.floor(Math.random() * limit)
    const venue = venues[randomNumber];
     //let photo = await getPhotos(venue.id);
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = `<h2>${venue.name}</h2>
<h3>${venue.categories[0].name}</h3>
<img class="venueimage" src="${venueImgSrc}"/>
<h3>Dirección:</h3>
<p>${venue.location.address}</p>
<p>${venue.location.city}</p>
<p>${venue.location.country}</p>`;
    $venue.append(venueContent);
    })
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (days) => {
  $weatherDivs.forEach(($day, index) => {
    const currentDays = days[index];
    const currentDate = new Date(currentDays.date)
    const weekDay = weekDays[currentDate.getDay()]
		let weatherContent = `<h2> Alta: ${currentDays.day["maxtemp_c"]}°C</h2>
<h2> Baja: ${currentDays.day["mintemp_c"]}°C</h2>
<h2> Precipitación: ${currentDays.day["totalprecip_mm"]}mm</h2>
<h2> Humedad: ${currentDays.day["avghumidity"]}Hg</h2>
<img src="http://${currentDays.day.condition.icon}" class="weathericon" />
<h2>${weekDay}</h2>`;
    $day.append(weatherContent);
  });
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)
