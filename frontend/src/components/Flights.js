import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Airplane from './Airplane';


const Flights = () => {
    const [flights, setFlightsList] = useState([]);

    const getFlightList = () =>{
        axios.get('http://localhost:5000/opensky_api/flights',
            {
                headers: { 'content-type': 'application/json' }
            }).then(resp => {
                // console.log(resp.data)
                setFlightsList(resp.data)
            }).catch(error => {
                console.log(error)
            });
    }

    useEffect(() => {
        getFlightList();
        setInterval(() =>{
            getFlightList()
        }, 25000);
    }, []);
    return (
        <>
        {/* <div>Flights data rendered</div> */}
            {flights.map(airplane => {
                if(!(airplane.latitude === 'No Data' || airplane.longitude === 'No Data')){
                    return (
                        <Airplane key = {airplane.icao24}
                            details={airplane}
                            latitude={airplane.latitude} 
                            longitude={airplane.longitude} 
                            />
                        );
                }
                return '';
            })}

        </>
    );
};

export default Flights;