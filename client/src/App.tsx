import './App.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';

type IpData = {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
    lat: number;
    lng: number;
    postalCode: string;
    timezone: string;
    geonameId: number;
  };
  isp: string;
};

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [ipData, setIpData] = useState<IpData | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleSearch = async (ip: string) => {
    const response = await fetch(
      `http://localhost:3001/?ipAddress=${encodeURIComponent(ip)}`,
    );

    const data: IpData = await response.json();
    setIpData(data);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchInput);
  };

  useEffect(() => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ipData) return;

    const lat = ipData.location.lat;
    const lng = ipData.location.lng;

    mapRef.current?.setView([lat, lng], 13);
  }, [ipData]);

  return (
    <>
      {/* IP Address Tracker
       */}
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search for any IP address or domain"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <div>
          <h2>IP Address</h2>
          <p>{ipData?.ip ?? '-'}</p>
        </div>
        <div>
          <h2>Location</h2>
          <p>
            {ipData?.location
              ? `${ipData.location.city}, ${ipData.location.country}`
              : '-'}
          </p>
          {ipData?.location.postalCode && <p>{ipData.location.postalCode}</p>}
        </div>
        <div>
          <h2>Timezone</h2>
          <p>{ipData?.location.timezone ?? '-'}</p>
        </div>
        <div>
          <h2>Isp</h2>
          <p>{ipData?.isp ?? '-'}</p>
        </div>
      </div>

      <div id="map"></div>
      <footer className="attribution">
        Challenge by{' '}
        <a href="https://www.frontendmentor.io?ref=challenge">
          Frontend Mentor
        </a>
        . Coded by <a href="#">Your Name Here</a>.
      </footer>
    </>
  );
}

export default App;
