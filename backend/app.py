from flask import Flask, Response, request
from flask_cors import CORS, cross_origin


import pandas as pd
import numpy as np
import seaborn as sns
import requests
import json
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = "OpenskyFlaskApp"
app.config['CORS_HEADERS'] = 'Content-Type'


properties = ['icao24', 'callsign', 'origin_country', 'time_position', 'last_contact', 'longitude', 'latitude', 'baro_altitude',
              'on_ground', 'velocity', 'true_track', 'vertical_rate', 'sensors', 'geo_altitude', 'squawk', 'spi', 'position_source', 'unknown']

opensky_url = "https://opensky-network.org/api/states/all"


airports_df = pd.read_csv("airports.tar.gz")
country_codes = pd.read_csv("countries_codes_and_coordinates.csv")
odf = pd.read_csv('origin_df.tar.gz')
ddf = pd.read_csv('dest_df.tar.gz')
odf_2020 = pd.read_csv('origin_df_2020.tar.gz')
ddf_2020 = pd.read_csv('dest_df_2020.tar.gz')
airline_df = pd.read_csv('Airline_dataset.csv')
covid_data_df = pd.read_csv('owid-covid-data.tar.gz')


@app.route("/opensky_api")
@cross_origin(supports_credentials=True)
def index():
    return "backend services for extracting data from Opensky Network"


@app.route("/opensky_api/flights")
def get_flights():

    flight_df = {}

    flight_dict = {}
    req_obj = requests.get(opensky_url).json()
    for entry in req_obj['states']:
        if len(entry) == 17:
            entry.append(0)

    flight_df = pd.DataFrame(req_obj['states'], columns=properties)
    flight_df = flight_df.fillna('No Data')
    country_list = ['ireland', 'india']

    for index, flight in flight_df.iterrows():
        if any(x in (flight['origin_country']).lower() for x in country_list):
            flight_dict[index] = flight.to_dict()

    my_list = list(flight_dict.values())

    return Response(json.dumps(my_list),  mimetype='application/json')


def get_al_3_country_code(al_2_code):
    ctry_code = country_codes[country_codes['Alpha-2 code']
                              == al_2_code]['Alpha-3 code'].tolist()
    if len(ctry_code) > 0:
        return ctry_code[0]
    return ''


@app.route("/opensky_api/flights/<icao24>", methods=['GET'])
def get_airport_details(icao24):
    t_h_b = int((datetime.datetime.now() -
                datetime.timedelta(hours=24)).timestamp())
    o_h_b = int(datetime.datetime.now().timestamp())
    airport_row = {}
    final_arp_details = {}
    airport_url = f"https://opensky-network.org/api/flights/aircraft?icao24={icao24}&begin={t_h_b}&end={o_h_b}"
    arp_obj = requests.get(airport_url).json()
    if len(arp_obj) == 0:
        t_h_b = int((datetime.datetime.now() -
                    datetime.timedelta(hours=96)).timestamp())
        o_h_b = int(datetime.datetime.now().timestamp())
        airport_url = f"https://opensky-network.org/api/flights/aircraft?icao24={icao24}&begin={t_h_b}&end={o_h_b}"
        arp_obj = requests.get(airport_url).json()
    if(arp_obj):
        final_arp_details = arp_obj[0]
        airline_name = airline_df[airline_df['ICAO'] ==
                                  final_arp_details['callsign'][:3]]['Name'].tolist()
        print()
        if len(airline_name) > 0:
            final_arp_details['airline'] = airline_name[0]
        else:
            final_arp_details['airline'] = ''
        if not (final_arp_details["estDepartureAirport"] == None):
            airport_row = airports_df.loc[airports_df['ident']
                                          == arp_obj[0]["estDepartureAirport"]]
            # airport_row = airports_df.query(f'ident == {arp_obj[0]["estDepartureAirport"]}')

            airport_row = airport_row.to_dict('records')[0]
            final_arp_details['estDepArpCoord'] = {'latitude': airport_row['latitude_deg'],
                                                   'longitude': airport_row['longitude_deg'],
                                                   'airport_name': airport_row['name'],
                                                   'iso_country_code': get_al_3_country_code(airport_row['iso_country'])}

            # print(airport_row)

        if not (arp_obj[0]["estArrivalAirport"] == None):
            airport_row = airports_df.loc[airports_df['ident']
                                          == arp_obj[0]["estArrivalAirport"]]
            airport_row = airport_row.to_dict('records')[0]
            final_arp_details['estArrArpCoord'] = {'latitude': airport_row['latitude_deg'],
                                                   'longitude': airport_row['longitude_deg'],
                                                   'airport_name': airport_row['name'],
                                                   'iso_country_code': get_al_3_country_code(airport_row['iso_country'])}
            # print(airport_row)
    return Response(json.dumps(final_arp_details),  mimetype='application/json')


def get_airp_stats_dict(stats_df):
    ap_dict = stats_df.groupby(['month', 'day'])['count'].apply(list).to_dict()
    fin = {}
    for skey in set([keys[0] for keys in ap_dict.keys()]):
        fin[skey] = {}
    for keys, val in ap_dict.items():
        fin[keys[0]].update({keys[1]: sum(val)})
    return fin


def get_airl_stats_dict(stats_df, arcode):
    al_name = airline_df[airline_df['ICAO'] == arcode]['Name']
    airl_df = stats_df[stats_df['callsign'] ==
                       arcode].sort_values(by=['month', 'day'])
    airl_df['date'] = stats_df["day"].astype('Int32').astype(
        str) + '/' + airl_df["month"].astype('Int32').astype(str)
    airl_df.dropna(inplace=True)
    airl_dict = airl_df[['date', 'count']].reset_index().to_dict()
    if len(al_name) > 0:
        airl_dict['airline'] = al_name.item()
    else:
        airl_dict['airline'] = ''
    return airl_dict


def get_covid_cases_country(covid_df, c_code, year):
    covid_df_refined = covid_df[covid_df['owid-covid-data.csv'] == c_code][[
        'date', 'total_cases', 'new_cases', 'total_deaths', 'new_deaths', 'location']]
    covid_df_refined['year'] = covid_df_refined['date'].apply(
        lambda x: str(datetime.datetime.strptime(x, '%Y-%m-%d').year))
    covid_df_refined['dm'] = covid_df_refined['date'].apply(lambda x: str(datetime.datetime.strptime(
        x, '%Y-%m-%d').day) + '/' + str(datetime.datetime.strptime(x, '%Y-%m-%d').month))
    return covid_df_refined[covid_df_refined['year'] == year].to_json()


@app.route("/opensky_api/airports/", methods=['GET'])
def get_airport_stats():
    airptcode = request.args.get('apcode')
    airpttype = request.args.get('aptype')
    airlncode = request.args.get('alcode')
    country_code = request.args.get('cocode')
    stats_response_obj = {}
    covid_dict = {}

    print(country_code)
    if airpttype == 'departure':

        for (key, dept_df) in enumerate([odf_2020, odf]):
            departure_airport_df = dept_df[dept_df['./'] == airptcode]
            deptr_dict = get_airp_stats_dict(departure_airport_df)
            dept_airl_dict = get_airl_stats_dict(
                departure_airport_df, airlncode)
            covid_dict = get_covid_cases_country(
                covid_data_df, country_code, '202'+str(key))
            stats_response_obj['202'+str(key)] = {'airp_stats': deptr_dict,
                                                  'arln_stats': dept_airl_dict,
                                                  'covid_data': covid_dict}

    elif airpttype == 'arrival':

        for (key, arr_df) in enumerate([ddf_2020, ddf]):
            arrival_airport_df = arr_df[arr_df['./'] == airptcode]
            arriv_dict = get_airp_stats_dict(arrival_airport_df)
            arriv_airl_dict = get_airl_stats_dict(
                arrival_airport_df, airlncode)
            covid_dict = get_covid_cases_country(
                covid_data_df, country_code, '202'+str(key))
            stats_response_obj['202'+str(key)] = {'airp_stats': arriv_dict,
                                                  'arln_stats': arriv_airl_dict,
                                                  'covid_data': covid_dict}

    return Response(json.dumps(stats_response_obj),  mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)
