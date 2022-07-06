# Real Time Flight Tracking with impact of Covid-19 on commercial aviation industry

This project is a web application built using ReactJS and Python Flask framework. It is a highly responsive web app that lets user click on individual aircrafts and view the connecting airports, get more details of the flight and visualize various statistical plots related to flight frequency at a particular airport, covid cases and airline route frequency.

## Author

[Vikas Kumar Malkapuram Sesha Girish](https://gitlab.cs.nuim.ie/p210042/) <br />
Course - Computer Science Applied <br />
Student ID - 20251119

This project was developed on a Windows 10 machine and all the instructions are directed towards this OS.

Clone this repository or download the zip file and navigate to the project's root folder.

Keep a separate terminal for each of the below process.

## Backend

1. This project was built using Python version 3.9.x . Download [link](https://www.python.org/downloads/release/python-3910/) 
2. Install virtual environment package using pip `py -m pip install --user virtualenv`
3. Nagivate into **backend** folder
4. Create a virtual env using the command `python3 -m venv </path/to/root-folder-of-this-project/env-name>` or `python3 -m venv <env-name>` if the current directory is the project's rppt folder.
5. Applicable only for Windows : Run the command `.\<env-name>\Scripts\activate` to activate the environment.
6. Install all the necessary packages by running the command `pip install -r requirements.txt`
7. Execute the backend by typing `flask run`


## Frontend

1. Check if NodeJS is installed by typing `node -v` in command prompt.
2. If not, visit [NodeJS download](https://nodejs.org/en/download/).
3. Once installed, go to **frontend** folder and run the command `npm install` to install the dependencies.
4. Node Package Manager (npm) makes sure all the required packages are installed for the React app to function properly.
5. Start the local machine server by typing `npm start`