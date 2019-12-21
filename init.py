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

###############################
###### Load CSV File(s) #######
###############################

# load csv as dataframe
top2017_df = pd.read_csv('static/data/top2017.csv')
top2018_df = pd.read_csv('static/data/top2018.csv')
# top2019_df = pd.read_csv('static/data/top2019.csv')

# Merge dataframes together
top_df = pd.concat([top2017_df, top2018_df], ignore_index=True)

# print(top_df.head())

###############################
###### Transform CSV(s) #######
###############################





###############################
######### Load SQLite #########
###############################

#connect to database and replace with new data
engine = create_engine('sqlite:///static/db/spotify_db.sqlite', echo=False)

top_df.to_sql('spotify', con=engine, if_exists='replace', index=True)

test = engine.execute("SELECT * FROM spotify LIMIT 1").fetchall()

print (test)

##########################################################
####################### End Script #######################
##########################################################