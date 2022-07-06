import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import axios from 'axios';
import { Modal, Box } from '@mui/material';



import arrival_marker from '../images/arrival_icon.png';
import departure_marker from '../images/departure_icon.png';
import AirportStatsModal from './AirportStatsModal';
import HaversineDist from './HaversineDist';


const AirportMarker = (props) => {
    useEffect(() => {
        // console.log(props.airportDetails.estArrArpCoord)
    })

    const [airport_stats, setStats] = useState({});
    const [country_covid_stats, setCovidStats] = useState({});
    const [showStats, setOpen] = useState(false);
    const [arpName, setArpName] = useState("");
    const [arpType, setArpType] = useState("");

    const handleAirportStats = (e) => {
        togglePopup(false)
        const arp_type = e.currentTarget.getAttribute("ap_type")
        const country_code = e.currentTarget.getAttribute("country_code")
        setArpType(e.currentTarget.getAttribute("ap_type"))
        setArpName(e.currentTarget.getAttribute("arp_name"))
        const airport_status = arp_type === "arrival" ?
            props.airportDetails.estArrivalAirport :
            props.airportDetails.estDepartureAirport
        // console.log("Airport type: " + airport_type);
        if (airport_status != null) {
            axios.get("http://localhost:5000/opensky_api/airports/",
                {
                    params: {
                        apcode: airport_status,
                        aptype: arp_type,
                        alcode: props.airportDetails.callsign.slice(0, 3),
                        cocode: country_code
                    },

                    headers: { 'content-type': 'application/json' }
                }).then(resp => {
                    let covid_stats = {'2021': {}, '2020': {}}
                    covid_stats['2021'] = JSON.parse(resp.data['2021']['covid_data']);
                    covid_stats['2020'] = JSON.parse(resp.data['2020']['covid_data']);
                    setCovidStats(covid_stats);
                    // console.log(JSON.parse(resp.data['2020']['covid_data']));
                    delete resp.data['2021']['covid_data'];
                    delete resp.data['2020']['covid_data'];
                    // console.log(resp.data);
                    setStats(resp.data)
                    setOpen(true)
                }).catch(error => {
                    console.log(error)
                });
        }
    }

    const marker_height = 27;
    const marker_width = 20;
    const box_style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        height: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const handleClose = () => setOpen(false);

    const [showPopup, togglePopup] = useState(false);

    

    return (
        <div>
            {("estArrArpCoord" in props.airportDetails) ?
                (<Marker

                    latitude={props.airportDetails.estArrArpCoord['latitude']}
                    longitude={props.airportDetails.estArrArpCoord['longitude']}>
                    <img
                        src={arrival_marker}
                        width={marker_width}
                        height={marker_height}
                        onClick={handleAirportStats}
                        ap_type="arrival"
                        country_code = {props.airportDetails.estArrArpCoord['iso_country_code']}
                        arp_name={props.airportDetails.estArrArpCoord['airport_name']}
                        alt="Arrival airport location"
                        style={{ transform: `translate(${-marker_width / 2}px,${-marker_height}px)`, cursor: 'pointer' }}
                        onMouseEnter={togglePopup} />
                </Marker>) : null}
                {showPopup && ("estDepArpCoord" in props.airportDetails) ?
                (<Popup
                        anchor="right"
                        latitude={props.airportDetails.estDepArpCoord['latitude']}
                        longitude={props.airportDetails.estDepArpCoord['longitude']}
                        closeButton={true}
                        closeOnClick={true}
                        onClose={() => togglePopup(false)} >
                        <span> Distance to flight: </span>
                        <span>
                            {HaversineDist(props.airportDetails.estDepArpCoord['latitude'], 
                                          props.airportDetails.estDepArpCoord['longitude'],
                                          props.fllat, props.fllon)} KM
                        </span>
                    </Popup>): null}
                    {showPopup && ("estDepArpCoord" in props.airportDetails) ?
                    (<Popup
                        anchor="right"
                        latitude={props.airportDetails.estArrArpCoord['latitude']}
                        longitude={props.airportDetails.estArrArpCoord['longitude']}
                        closeButton={true}
                        closeOnClick={true}
                        onClose={() => togglePopup(false)} >
                        <span> Distance to flight: </span>
                        <span>
                            {HaversineDist(props.airportDetails.estArrArpCoord['latitude'], 
                                          props.airportDetails.estArrArpCoord['longitude'],
                                          props.fllat, props.fllon)} KM
                        </span>
                    </Popup>) : null}
            {("estDepArpCoord" in props.airportDetails) ?
                (<Marker

                    latitude={props.airportDetails.estDepArpCoord['latitude']}
                    longitude={props.airportDetails.estDepArpCoord['longitude']}>
                    <img
                        src={departure_marker}
                        width={marker_width + 2}
                        height={marker_height + 2}
                        onClick={handleAirportStats}
                        ap_type="departure"
                        country_code = {props.airportDetails.estDepArpCoord['iso_country_code']}
                        arp_name={props.airportDetails.estDepArpCoord['airport_name']}
                        alt="Destination airport location"
                        style={{ transform: `translate(${-marker_width / 2}px,${-marker_height}px)`, cursor: 'pointer' }} 
                        onMouseEnter={togglePopup}/>
                </Marker>) : null}
            {showStats && <Modal
                open={showStats}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={box_style}>
                    <AirportStatsModal stats_data={airport_stats} covid_stats={country_covid_stats} arname={arpName} artype={arpType} />
                </Box>
            </Modal>}

        </div>
    );
};

export default AirportMarker;