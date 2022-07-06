import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import ReactMapGL from 'react-map-gl';
import Flights from './Flights';

const Map = () => {
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 53.350140,
        longitude: -6.2729187,
        zoom: 3
    });
    const accessToken = 'pk.eyJ1IjoibXN2azk1IiwiYSI6ImNreDAzMzR1YTBjbHMycnFsYTBoeWV3bXQifQ.qJcUEWY18RhLCVn5-kggVQ'
    return (
        <div>
            {/* <div>Map component rendered</div> */}
            <ReactMapGL
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapboxApiAccessToken={accessToken}
                >

                <Flights />
            </ReactMapGL>
        </div>
    );
};

export default Map;