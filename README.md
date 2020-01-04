# Project 2 - Spotify
### Team Members:
* Andrew Sooklall
* Mikey Esteban
* Pratik Pathak
* Zane Christopher Lynch
##### Proposal Date: 12/12/19
##### Due Date: 01/04/20
##### GitHub Repo: https://github.com/ASooklall/project-2-spotify.git
### Proposed Project:
* Option 1: Custom “creative” D3.js project (nonstandard graph/chart)
* With multiple simpler charts for specific portions of our data.
* * Using Datasets from Spotify we aim to show users popular artists for each year and trends within songs and artists.
* Upcoming artists will also be able to see trends between years and predicted trends for upcoming years to adapt their music to match the growing interests of the population.
* We plan to clean and load CSVs into databases to load within a flask app. Using D3/JS and HTML, we’ll be creating webpages to host our graphical representations of our data and explain our findings.
* * Users will be able to search through our representations and view different comparisons by interacting with the charts and graph in real time.
Purpose:
* Show the top songs/artists per year in a graphically pleasing manner.
* Show trends between years for duration, tempo, genre, etc. to analyze changes in popularity among different factors.
* * These trends could be used by record labels or new upcoming solo artists to show what direction their songs should head towards in 2020/2021 etc.
* Provide comparisons between artists and songs and allow people to look into similarities between artists they might not normally consider or allow users to see other similar artists they might like.

### Requirements:
* Dependencies located within requirements.txt
* A spotify premium account to use init.py
* A spotify premium account for the song playing option in the application.
* A spotify authentication token for the scrape (init.py):
* * https://developer.spotify.com/documentation/web-api/
* * Instructions:
* * * Use link to follow instructions to create app, 
* * * In Dashboard create an app name 
* * * Use Client ID and Client Secret to make API calls (best if hidden in a config.py for the init.py app)
* A spotify SDK playback token for the song playback:
* * https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
* * Instructions:
* * * Follow link to grab access token.
* * * Token only lasts 1 hour, refresh after an hour.

### Instructions: 
* In your command line, run the following command:
* * Navigate into the project directory:
* * pip install requirements.txt
* If this is your first time running the app, do one of the following:
* * If you have the spotify_db.sqlite file within static/db then you can just move to the next step.
* * If you do not have the sqlite database file, you need to run init.py for your primary launch.
* * * Be sure to add your spotify authentication code into the script before running.
* Before running the application, you need to include your SDK playback token if you want the app to play songs.
* * Locations are marked within app.py
* After fulfilling the above conditions, run "app.py" to launch the flask app.

### Data sources:
* Wikipedia
* * Scraping pages for artist bio and pictures
* Spotify
* * Scraping data for album pictures and song lyrics?
* Kaggle Datasets
* * https://www.kaggle.com/nadintamer/top-tracks-of-2017
* * https://www.kaggle.com/nadintamer/top-spotify-tracks-of-2018
* * https://www.kaggle.com/leonardopena/top50spotify2019
* Web Playback SDK
* * https://developer.spotify.com/documentation/web-playback-sdk/

