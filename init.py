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

top2017_df = pd.read_csv('assets/data/top2017.csv')
top2018_df = pd.read_csv('assets/data/top2018.csv')
top2019_df = pd.read_csv('assets/data/top2019.csv')

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