import React, { useState } from 'react';
import axios from 'axios';

import highlight_plane from "../images/flight_icon_blue.png";
import info from "../images/info.png";
import { Marker, Popup } from 'react-map-gl';
import AirportMarker from './AirportMarker';
import {
    Drawer,
    Typography,
    Alert,
    Table,
    TableRow,
    TableBody,
    TableContainer,
    TableCell,
    Paper,
    Fade
} from '@mui/material';
import { titleCase } from "title-case";


import PathFinder from './PathFinder';
import plane_img from '../images/boeing_747.jpg';


const Airplane = (props) => {


    const [showPopup, togglePopup] = useState(false);
    const [showSideBar, toggleSideBar] = useState(false);
    const [showAirports, toggleAirport] = useState(false);
    const [airport, setAirport] = useState({});
    const [info_details, setInfo] = useState({});
    const [showAlert, setAlertDur] = useState(false);


    const get_info = () => {
        axios.get(`http://localhost:5000/opensky_api/flights/${props.details['icao24']}`,
                {
                    headers: { 'content-type': 'application/json' }
                }).then(resp => {
                    toggleSideBar(true);
                    let info_obj = {}
                    if (Object.keys(resp.data).length > 0) {
                        info_obj['airline'] = resp.data['airline']
                        if(Object.hasOwn(resp.data, 'estDepArpCoord'))
                        info_obj['departure_airport'] = resp.data['estDepArpCoord']['airport_name'] + ', ' + resp.data['estDepArpCoord']['iso_country_code']
                        if(Object.hasOwn(resp.data, 'estArrArpCoord'))
                        info_obj['arrival_airport'] = resp.data['estArrArpCoord']['airport_name'] + ', ' + resp.data['estArrArpCoord']['iso_country_code']
                        console.log(info_obj)
                        if(resp.data['estDepartureAirport'] == null && resp.data['estArrivalAirport'] == null)
                        setAlertDur(true)
                        setTimeout(() => setAlertDur(false), 2500);
                        setInfo(info_obj)
                    }
                }).catch(error => {
                    console.log(error)
                });
    }

    const handleAirports = (e) => {
        togglePopup(false)
        e.preventDefault();
        if (showAirports === false) {
            axios.get(`http://localhost:5000/opensky_api/flights/${props.details['icao24']}`,
                {
                    headers: { 'content-type': 'application/json' }
                }).then(resp => {
                    if (Object.keys(resp.data).length > 0) {
                        setAirport(resp.data)
                        console.log(props.details['icao24'], props.details['true_track']);
                        toggleAirport(!showAirports)
                    }
                    else {
                        setAlertDur(true);
                        setTimeout(() => setAlertDur(false), 2500);
                    }
                }).catch(error => {
                    console.log(error)
                });
        }
        else toggleAirport(!showAirports);
    }
    const marker_size = 25;
    const sidebarObj = {"icao24": "", 
                        "callsign": "", 
                        "origin_country": "", 
                        "longitude": "degress", 
                        "latitude": "degrees",
                        "baro_altitude": "m",
                        "velocity": "m/s",
                        "vertical_rate": "m/s",
                        "true_track": "degrees"
                    }

    return (
        <>
            <Marker
                longitude={props.longitude}
                latitude={props.latitude}
            >

                <img src={highlight_plane}
                    height={marker_size}
                    width={marker_size}
                    alt="flight_img"
                    style={{
                        cursor: 'pointer',
                        transform: `translate(${-marker_size / 2}px,${-marker_size}px) rotate(${-90 + props.details['true_track']}deg)`,
                        filter: `invert(${showAirports ? 80 : 0}%)`,
                    }}
                    onClick={handleAirports}
                    onMouseEnter={togglePopup}
                />
            </Marker>
            {showPopup && <div onMouseLeave={() => togglePopup(false)}>
                <Popup
                    anchor="top"
                    latitude={props.latitude}
                    longitude={props.longitude}
                    closeButton={false}
                    closeOnClick={true}
                    onClose={() => togglePopup(false)} >
                    <span> Flight info </span>
                    <img
                        src={info}
                        height={marker_size}
                        width={marker_size}
                        alt={"airport marker"}
                        style={{ cursor: 'pointer' }}
                        onClick={get_info} />
                </Popup>
            </div>}
            <Drawer
                anchor="left"
                open={showSideBar}
                onClose={() => toggleSideBar(false)}
                PaperProps={{
                    sx: { width: "35%" },
                }}>
                <Typography variant="h5" align="center">
                    Flight Details
                </Typography>
                <img src={plane_img} alt="aircraft_image"/>

                <TableContainer component={Paper}>
                    <Table >
                        <TableBody>
                        {Object.keys(info_details).map(property => {
                                return (
                                    <TableRow key={property}>
                                        <TableCell align="left">{titleCase(property.replaceAll('_', ' '))}</TableCell>
                                        <TableCell align="left">{info_details[property]}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {Object.keys(sidebarObj).map(property => {
                                let value = props.details[property]
                                return (
                                    <TableRow key={property}>
                                        <TableCell align="left">{titleCase(property.replaceAll('_', ' '))}</TableCell>
                                        <TableCell align="left">{value + " "+ sidebarObj[property]}</TableCell>
                                    </TableRow>
                                );
                            })}
                            
                        </TableBody>
                    </Table>
                </TableContainer>
            </Drawer>
            {showAlert && <Fade in={showAlert} >
                <Alert variant="filled" severity="warning">Flight status not available at the moment</Alert>
            </Fade>}
            {showAirports && <AirportMarker fllat={props.latitude} fllon={props.longitude} airportDetails={airport} />}

            {showAirports && <PathFinder fllat={props.latitude}
                fllon={props.longitude}
                unid={props.details['icao24']}
                airportDet={airport} />}

        </>
    )
};

export default Airplane;