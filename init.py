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

top2017_df = pd.read_csv('static/data/top2017.csv')
top2018_df = pd.read_csv('static/data/top2018.csv')
# top2019_df = pd.read_csv('static/data/top2019.csv')

top_df = pd.concat([top2017_df, top2018_df], ignore_index=True)

# print(top_df.head())

###############################
###### Transform CSV(s) #######
###############################





###############################
######### Load SQLite #########
###############################

# conn = sqlite3.connect('db/spotify_db.sqlite')
# cur = conn.cursor()
# cur.execute('CREATE TABLE NAMEHERE (name VARCHAR, description VARCHAR)')
# conn.commit()
# conn.close()

from sqlalchemy import create_engine
engine = create_engine('sqlite://', echo=False)


top_df.to_sql('spotify', con=engine, if_exists='replace')
test = engine.execute("SELECT * FROM spotify LIMIT 1").fetchall()
print (test)















##########################################################
####################### End Script #######################
##########################################################