import React from 'react';
import Carousel from 'react-material-ui-carousel';
import randomColor from "randomcolor";

import StatsLineChart from './StatsLineChart';


const AirportStatsModal = (props) => {

    function range(start, end) {
        return Array(end - start).fill().map((_, idx) => start + idx)
      }

    const month_array = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    const color_arr = ["Peru",
    "Pink",
    "Plum",
    "PowderBlue",
    "Purple",
    "RebeccaPurple",
    "Red",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "SeaShell",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGray",
    "SlateGrey",
    "Snow",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal"];


    const airport_stats_2021 = props.stats_data['2021']['airp_stats']
    const airport_stats_2020 = props.stats_data['2020']['airp_stats']

    const airline_stats_2021 = props.stats_data['2021']['arln_stats']
    const airline_stats_2020 = props.stats_data['2020']['arln_stats']

    const covid_stats_2021 = props.covid_stats['2021']
    const covid_stats_2020 = props.covid_stats['2020']

    let arplabels = range(1, 32);

    let arllabels = (Object.keys(airline_stats_2020).includes('date')) ? 
                                        Object.values(airline_stats_2020['date']) : 
                                        Object.values(airline_stats_2021['date']);

    let covlabels = Object.values(covid_stats_2020['dm']);
    

    const get_airp_dataset = (plot_data) =>{
        return Object.keys(plot_data).map((val, id) => { 
            let month_val = parseInt(val)
            console.log(month_val)
            const month_name = month_array[month_val-1]
            return {label: month_name, 
                    data: Object.values(plot_data[val]),
                    fill:false,
                    borderColor: color_arr[id]}
                });
    }
    
    const get_airln_dataset = (plot_data) =>{ 
            return [{label: plot_data['airline'], 
                    data: Object.values(plot_data['count']),
                    fill:false,
                    borderColor: color_arr[7]}]
    }

    const get_covid_dataset = (plot_data) =>{ 
        let data_arr = Object.values(plot_data['total_cases'])
        return [{label: Object.values(plot_data['location'])[0], 
                data: data_arr.map(ele=>Math.abs(ele)),
                fill:false,
                borderColor: color_arr[11]}]
}

    return (
        <Carousel fullHeightHover={false} autoPlay={false}>
            <StatsLineChart 
                            stlabels = {arplabels} 
                            title={`Air traffic Statistics 2021 - ${props.arname}`} 
                            data_set={get_airp_dataset(airport_stats_2021)} 
                            x_axis_title={'days'}
                            y_axis_title={`# of ${props.artype} flights`}/>
            <StatsLineChart 
                            stlabels = {arplabels} 
                            title={`Air traffic Statistics 2020 - ${props.arname}`} 
                            data_set={get_airp_dataset(airport_stats_2020)} 
                            x_axis_title={'days'}
                            y_axis_title={`# of ${props.artype} flights`}/>
            <StatsLineChart 
                            stlabels = {covlabels} 
                            title={`Total covid cases in 2021 for ${Object.values(covid_stats_2020['location'])[0]}`} 
                            data_set={get_covid_dataset(covid_stats_2021)} 
                            x_axis_title={'date(day/month)'}
                            y_axis_title={'Total cases'}/>
            <StatsLineChart 
                            stlabels = {covlabels} 
                            title={`Total covid cases in 2020 for ${Object.values(covid_stats_2020['location'])[0]}`} 
                            data_set={get_covid_dataset(covid_stats_2020)} 
                            x_axis_title={'date(day/month)'}
                            y_axis_title={'Total cases'}/>
            <StatsLineChart 
                            stlabels = {arllabels} 
                            title={`Airline frequency Statistics 2021 - ${airline_stats_2021['airline']}`} 
                            data_set={get_airln_dataset(airline_stats_2021)} 
                            x_axis_title={'date(day/month)'}
                            y_axis_title={`frequency of airline (${props.artype})`}/>
            <StatsLineChart 
                            stlabels = {arllabels} 
                            title={`Airline frequency Statistics 2020 - ${airline_stats_2020['airline']}`} 
                            data_set={get_airln_dataset(airline_stats_2020)} 
                            x_axis_title={'date(day/month)'}
                            y_axis_title={`frequency of airline (${props.artype})`}/>
        </Carousel>
    );
};

export default AirportStatsModal;