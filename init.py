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

print_df = top_df.head()

print(print_df)

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




















##########################################################
####################### End Script #######################
##########################################################