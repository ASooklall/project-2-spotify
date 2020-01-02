##########################
## import dependencies ##
########################
import spotipy
import spotipy.util as util
import pandas as pd
from config import username, SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope


def run_scrape():
    ########################
    ### grab old csv file #
    ######################
    top_2017 = pd.read_csv("assets/data/top2017.csv", encoding='latin-1')
    top_2018 = pd.read_csv("assets/data/top2018.csv", encoding='unicode_escape')
    top_2019 = pd.read_csv("assets/data/top2019.csv", encoding='unicode_escape')

    print("loaded csvs")

    # initialize list to scrape
    search_data = []

    # pull tracks and artists
    tracks = list(top_2019['Track.Name'])
    artists = list(top_2019['Artist.Name'])
    # add each list to search_data
    for i in range(len(tracks)):
        search_data.append([tracks[i], artists[i]])

    ##################################
    ### helper functions for scrape #
    ################################
    def search_by_track(track, artist):
        ''' searches by track, pulls 10 albums
            if artist in album matches artist param,
            RETURNS: [artist, track, song-id]'''
        token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)
        # create spotipy object
        sp = spotipy.Spotify(auth=token)
        # search by track name
        result = sp.search(q=track, type='track')
        # save first 10 results
        first_ten_albums = result['tracks']['items']
        # loop through each album
        for album in first_ten_albums:
            # extract artist of each album
            possible_artist = album['album']['artists'][0]['name']
            # see if album artist matches query artist
            if possible_artist == artist:
                # match found, add to song-ids
                value = [artist, track, result['tracks']['items'][0]['id']]
                return value

    def search_by_artist(artist, track):
        ''' returns correct track by artist to use in
            search_by_track'''
        token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)
        # create spotipy object
        sp = spotipy.Spotify(auth=token)

        # search by artist name
        result = sp.search(q=artist, type='artist')
        # grab artist id
        artist_id = result['artists']['items'][0]['id']
        # search artist top tracks
        top_tracks = sp.artist_top_tracks(artist_id)
        top_10 = top_tracks['tracks']
        # loop through top tracks, check to see if any match track query
        for song in top_10:
            possible_song = song['name']
            # matches enough, match found
            if track[:2] == possible_song[:2] or track[-3:] == possible_song[-3:]:
                track = possible_song
                return track

    def grab_genre(artist):
        ''' returns a genre of artist'''
        token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)
        # create spotipy object
        sp = spotipy.Spotify(auth=token)

        # search by artist name
        result = sp.search(q=artist, type='artist')
        # grab artist id
        artist_id = result['artists']['items'][0]['id']
        # search artist top tracks
        genre = sp.artist(artist_id)['genres']
        return genre


    ############################################
    ### Spotipy Scrape for results obeject  ###
    ##########################################

    # create token for each scrape
    token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)

    # initalize results list
    results = []

    # Create our spotify object
    for query in search_data:
        if token:
            # create track & artist search variables
            track = query[0]
            artist = query[1]
            genre = grab_genre(artist)

            # run search by track to find results
            value = search_by_track(track, artist)

            # if search_by_track returns none, use search_by_artist.
            # else append to results
            if value == None:
                correct_track = search_by_artist(artist, track)
                # run search_by_track again
                value = search_by_track(correct_track, artist)
                value.append(genre)
                results.append(value)
            else:
                value.append(genre)
                results.append(value)
        else:
            print("Can't get token for", username)

    #########################################################
    ### Spotipy to create song features to results object ##
    #######################################################

    # create spotipy object
    sp = spotipy.Spotify(auth=token)

    # initalize top_2019_data object
    top_2019_data = []

    for each in results:
        # grab needed song features
        features = sp.audio_features(each[2])
        data = features[0]
        data['name'] = each[1]
        data['artists'] = each[0]
        data['year'] = '2019'
        data['genre'] = each[3]
        top_2019_data.append(data)


    #########################################
    ### Data munging to fix top_2019_data ##
    #######################################

    # turn to DataFrame
    top2019_df = pd.DataFrame.from_dict(top_2019_data)
    # Drop unneeded columns
    top_2019_df = top2019_df.drop(columns=['type', 'uri','track_href','analysis_url'])
    # Reorder columns
    top_2019_df = top_2019_df[['id','name','artists','danceability','energy','key','loudness','mode','speechiness','acousticness','instrumentalness','liveness','valence','tempo','duration_ms','time_signature','year','genre']]


    ##########################################
    ### add genre to top2017 & top2018 csv ##
    ########################################
    def add_genre(dataframe):
        '''takes in a dataframe, adds a genre column by artist'''
        token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)

        # grab artist column for Spotipy search
        artists = list(dataframe['artists'])

        # initialize genre column
        genres = []

        # loop through artists list
        for person in artists:
            # create spotipy object
            sp = spotipy.Spotify(auth=token)
            # search by artist name
            result = sp.search(q=person, type='artist')
            try:
                # grab artist id
                artist_id = result['artists']['items'][0]['id']
                # search artist top tracks
                genre = sp.artist(artist_id)['genres']
                genres.append(genre)
            except IndexError:  # artist name is incorrect
                # grab index of row
                i = dataframe.index[dataframe['artists'] == person]
                # grab song title
                song_df = dataframe.loc[i, 'name']
                song_list = song_df.values
                song = song_list[0]
                # search by track instead
                sp = spotipy.Spotify(auth=token)
                result = sp.search(q=song, type='track')
                # grab correct artist
                artist = result['tracks']['items'][0]['artists'][0]['name']
                sp = spotipy.Spotify(auth=token)
                result = sp.search(q=artist, type='artist')
                # grab genre associated with correct artist
                genre = result['artists']['items'][0]['genres']
                genres.append(genre)

        # add genre to dataframe
        dataframe['genre'] = genres

        return dataframe

    # Add to each df
    print("adding genre to top 2017")
    top_2017_df = add_genre(top_2017)
    print("finished adding genre to top 2017")
    print()
    print("adding genre to top 2018")
    top_2018_df = add_genre(top_2018)
    print("finished adding genre to top 2018")

    ##############################
    ###### Fixing top genres ####
    ############################

    ### helper functions ###
    def remove_unpopular_genres(dataframe):
        ''' only keeps top genres '''
        final_genres = ['trap', 'hip hop', 'reggaeton', 'edm', 'latin', 'tropical house', 'pop rap', 'rap', 'pop']
        for i, genres in dataframe['genre'].iteritems():
            index = 0
            while index < len(genres):
                if genres[index] in final_genres:
                    index += 1
                else:
                    del(genres[index])

        return dataframe

    def add_genre_other(dataframe):
        ''' adds other as genre if empty '''
        for i, genres in dataframe['genre'].iteritems():
            if len(genres) == 0:
                genres.append('other')

        return dataframe

    def del_mult_genres(dataframe):
        ''' picks main genre (choosing least populated genre)'''
        final_genres = ['trap', 'hip hop', 'reggaeton', 'edm', 'latin', 'tropical house', 'pop rap', 'rap', 'pop']
        for i, song_genres in dataframe['genre'].iteritems():
            if len(song_genres) > 1:
                index = 0
                while index < len(final_genres):
                    if final_genres[index] in song_genres:
                        dataframe.loc[i,'genre'] = final_genres[index]
                        break
                    else:
                        index += 1
            else:
                dataframe.loc[i,'genre'] = song_genres

        return dataframe

    #### Run on our dataframes
    each_df = [top_2017_df, top_2018_df, top_2019_df]
    for df in each_df:
        df = remove_unpopular_genres(df)
        df = add_genre_other(df)
        df = del_mult_genres(df)


    ###################################
    ##### Correct 2017, 2018 Data ####
    #################################

    print("AT FIXING 2017-2018 DATA")

    #### Helper functions ####
    def fix_id(track, artist):
        ''' searches by track, pulls 10 albums if artist in album matches artist param, RETURNS: [artist, track, song-id]'''
        token = util.prompt_for_user_token(username, scope, client_id=SPOTIPY_CLIENT_ID,client_secret=SPOTIPY_CLIENT_SECRET,redirect_uri=SPOTIPY_REDIRECT_URI)

        # create spotipy object
        sp = spotipy.Spotify(auth=token)
        # search by track name
        result = sp.search(q=track, type='track')

        # save first 10 results
        first_ten_albums = result['tracks']['items']
        # loop through each album
        for album in first_ten_albums:
            # extract artist of each album
            possible_artist = album['album']['artists'][0]['name']
            # see if album artist matches query artist
            if possible_artist == artist:
                # match found, add to song-ids
                value = result['tracks']['items'][0]['id']
                return value

    def fix_dataframe_values(dataframe):
        ''' corrects IDs , incorrect tracks '''
        for i, column in dataframe.iterrows():
            track = column['name']
            artist = column['artists']
            try:
                correct_id = fix_id(track,artist)
                if correct_id != None:
                    dataframe.loc[i, 'id'] = correct_id
                if correct_id == None:
                    sp = spotipy.Spotify(auth=token)
                    # search by track name
                    result = sp.search(q=track, type='track')
                    correct_id = result['tracks']['items'][0]['id']
                    dataframe.loc[i, 'id'] = correct_id
            except IndexError:
                correct_track = search_by_artist(artist, track)
                if correct_track != None:
                    dataframe.loc[i, 'name'] = correct_track
                    correct_id = fix_id(correct_track, artist)
                    dataframe.loc[i, 'id'] = correct_id
                else:
                    track = track.split()[0]
                    correct_id = fix_id(track,artist)

        return dataframe

    #### Run on Dataframes 2017 & 2018 ####
    print("Running change of dataframe values functions on 2017")
    top_2017_df = fix_dataframe_values(top_2017_df)
    print("Finished with 2017")
    print()
    print("Running change of dataframe values functions on 2018")
    top_2018_df = fix_dataframe_values(top_2018_df)
    print("Finished with 2018")
    print()


    #########################
    ## save DFs as excel ####
    #######################
    print("Saving DF to excels")
    top_2017_df.to_excel('static/data/top2017_clean.xlsx', index=False)
    top_2018_df.to_excel('static/data/top2018_clean.xlsx', index=False)
    top_2019_df.to_excel('static/data/top2019_clean.xlsx', index=False)

if __name__ == "__main__":
    run_scrape()
