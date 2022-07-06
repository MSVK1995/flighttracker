import React from 'react';

import { Source, Layer } from "react-map-gl";

const PathFinder = (props) => {

    const dataOne = ("estDepArpCoord" in props.airportDet) ?
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: [
                    [props.fllon, props.fllat],
                    [props.airportDet.estDepArpCoord['longitude'], props.airportDet.estDepArpCoord['latitude']]
                ]
            }
        } : null;
    const dataTwo = ("estArrArpCoord" in props.airportDet) ?
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: [
                    [props.fllon, props.fllat],
                    [props.airportDet.estArrArpCoord['longitude'], props.airportDet.estArrArpCoord['latitude']]
                ]
            }
        } : null;
    return (
        <>
            {("estDepArpCoord" in props.airportDet) ?
                <Source id={"polylineLayer1" + props.unid} type="geojson" data={dataOne}>
                    <Layer
                        id={"lineLayer1" + props.unid}
                        type="line"
                        source="my-data"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "red",
                            "line-width": 2
                        }}
                    />

                </Source> : null}
            {("estArrArpCoord" in props.airportDet) ?
                <Source id={"polylineLayer2" + props.unid} type="geojson" data={dataTwo}>
                    <Layer
                        id={"lineLayer2" + props.unid}
                        type="line"
                        source="my-data"
                        layout={{
                            "line-join": "round",
                            "line-cap": "round"
                        }}
                        paint={{
                            "line-color": "green",
                            "line-width": 2
                        }}
                    />
                </Source> : null}

        </>

    );
};

export default PathFinder;