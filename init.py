#####################################################
########## Top Spotify Songs Visualization ##########
############### Initialize Application ##############
#####################################################

###############################
##### Import Dependencies #####
###############################

import pandas as pd
import sqlite3
from sqlalchemy import create_engine
import scrape

###############################
###### Load CSV File(s) #######
###############################

# load csv as dataframe
top2017_df = pd.read_excel('static/data/top2017_clean.xlsx')
top2018_df = pd.read_excel('static/data/top2018_clean.xlsx')
top2019_df = pd.read_excel('static/data/top2019_clean.xlsx')

# Merge dataframes together
top_df = pd.concat([top2017_df, top2018_df, top2019_df], ignore_index=True)

# print(top_df.head())

###############################
###### Transform CSV(s) #######
###############################

# prompt user to ask if scrape should be run
run_scrape_again = input("Run scrape.py (y/n)? : ")
if run_scrape_again == 'y' or run_scrape_again == 'Y':
    scrape.run_scrape()
    # load csv as dataframe
    top2017_df = pd.read_excel('static/data/top2017_clean.xlsx')
    top2018_df = pd.read_excel('static/data/top2018_clean.xlsx')
    top2019_df = pd.read_excel('static/data/top2019_clean.xlsx')
    # Merge dataframes together
    top_df = pd.concat([top2017_df, top2018_df, top2019_df], ignore_index=True)
    

###############################
######### Load SQLite #########
###############################

#connect to database and replace with new data
engine = create_engine('sqlite:///static/db/spotify_db.sqlite', echo=False)

top_df.to_sql('spotify', con=engine, if_exists='replace', index=True)

test = engine.execute("SELECT * FROM spotify LIMIT 1").fetchall()

# print (test)

##########################################################
####################### End Script #######################
##########################################################
