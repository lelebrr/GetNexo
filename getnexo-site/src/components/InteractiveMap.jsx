import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para centralizar o mapa na localização do usuário
const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    map.flyTo([latitude, longitude], 13);
                },
                (err) => {
                    console.error('Não foi possível obter sua localização.', err);
                }
            );
        }
    }, [map]);

    return position ? (
        <Marker position={position}>
            <Popup>
                Você está aqui!
            </Popup>
        </Marker>
    ) : null;
};

const InteractiveMap = () => {
    return (
        <div className="h-96 w-full">
            <MapContainer
                center={[-23.5505, -46.6333]} // São Paulo como padrão
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;