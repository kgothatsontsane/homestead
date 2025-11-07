import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [2, -40],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create a new component to handle map center updates
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

const Map = ({ address, city, country }) => {
  const [position, setPosition] = useState([-26.2041, 28.0473]); // Default to Johannesburg
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const geocode = async (searchQuery) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
            found: true
          };
        }
        return { coords: null, found: false };
      } catch (error) {
        console.error('Error geocoding:', error);
        return { coords: null, found: false };
      }
    };

    const updateLocation = async () => {
      // Try full address first
      if (address) {
        const fullAddress = `${address}, ${city}, ${country}`;
        const result = await geocode(fullAddress);
        if (result.found) {
          setPosition(result.coords);
          setLocationName(address);
          return;
        }
      }

      // Fallback to city
      if (city) {
        const result = await geocode(`${city}, ${country}`);
        if (result.found) {
          setPosition(result.coords);
          setLocationName(city);
          return;
        }
      }

      // If nothing works, keep default Johannesburg position
      setPosition([-26.2041, 28.0473]);
      setLocationName('Location not found');
    };

    updateLocation();
  }, [address, city, country]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      zoomControl={true}
    >
      <ChangeView center={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker 
        position={position}
        icon={L.divIcon({
          className: 'custom-marker',
          html: '<div class="marker-pin"></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })}
      >
        <Popup className="custom-popup">
          {locationName}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
