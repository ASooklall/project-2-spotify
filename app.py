###########################################################
############# Top Spotify Songs Visualization #############
#################### Flask Application ####################
###########################################################

###############################
##### Import Dependencies #####
###############################

import os

import pandas as pd
import numpy as np

import json

import sqlite3

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template, g
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

###############################
##### Initialize Database #####
###############################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///static/db/spotify_db.sqlite"
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)
engine = db.engine


# Save references to each table
inspector = inspect(db.engine)
# print(inspector.get_table_names())


###############################
###### Flask App. Routes ######
###############################

@app.route("/")
def index():
    #"""Return the homepage."""
    return render_template("index.html")

@app.route("/top_data")
def top_data():
    global engine
    global inspector

    songs = []
    column_names = []

    table_name = inspector.get_table_names()[0]
    table_columns = inspector.get_columns(table_name)
    for col in table_columns:
        # print(col['name'])
        column_names.append(col['name'])

    # column_names = ["index",
    #                 "id",
    #                 "name",
    #                 "artist",
    #                 "danceability",
    #                 "energy",
    #                 "key",
    #                 "loudness",
    #                 "mode",
    #                 "speechiness",
    #                 "acousticness",
    #                 "instrumentalness",
    #                 "liveness",
    #                 "valence",
    #                 "tempo",
    #                 "duration_ms",
    #                 "time_signature",
    #                 "genre",
    #                 "year"]

    # with engine.connect() as con:
    data = engine.execute('SELECT * FROM ' + table_name)

    for row in data:
        # songs.append(dict(zip(column_names, row)))
        temp = {}
        for i in range(0, len(row)):
            temp[column_names[i]] = row[i]
        songs.append(temp)
    
    # engine.close()
    # data = {}
    return jsonify(songs)

@app.route("/table")
def table():
    #"""Return the table page."""
    return render_template("table.html")


###############################
#### Run Flask Application ####
###############################

if __name__ == "__main__":
    app.run()

##########################################################
################### End Flask Script #####################
##########################################################