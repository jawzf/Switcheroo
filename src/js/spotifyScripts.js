function authorizeSpotifyFunction() {
    $('#busyDiv').show();
    var CALLBACK_URL = chrome.identity.getRedirectURL('spotifyAuth');
    var AUTH_URL = 'https://accounts.spotify.com/authorize/?client_id=' + CLIENT_ID + '&scope=user-read-private%20user-read-email%20user-read-birthdate%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private%20user-read-playback-state&response_type=code&redirect_uri=' + encodeURIComponent(CALLBACK_URL);
    chrome.identity.launchWebAuthFlow({
        url: AUTH_URL,
        interactive: true,
    }, function(response) {
        var q = response.substr(response.indexOf('?') + 1);
        var parts = q.split('&');
        for (var i = 0; i < parts.length; i++) {
            var kv = parts[i].split('=');
            if (kv[0] == 'code') {
                code = kv[1];
                SPOTIFY_USER_AUTH_CODE = code;
                $.ajax({
                    url: 'https://accounts.spotify.com/api/token',
                    type: 'POST',
                    headers: {
                        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                    },
                    data: {
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: CALLBACK_URL
                    },
                    success: function(result) {
                        SPOTIFY_AUTHORIZATION = true;
                        SPOTIFY_USER_AUTH_TOKEN = result.access_token;
                        localStorage.setItem('SPOTIFY_USER_AUTH_TOKEN', SPOTIFY_USER_AUTH_TOKEN);
                        getSpotifyUserDetails(function(details) {
                            CURRENT_USER_DETAILS = details;
                            localStorage.setItem('CURRENT_USER_DETAILS', JSON.stringify(details));
                        });
                        $('#busyDiv').hide();
                        successMessage("Spotify Authentication Successful!");
                    },
                    error: function(response) {
                        console.log(response.responseText);
                        var error = JSON.parse(response.responseText);
                        if (error.error.message == "Invalid access token") {
                            clearAuthentication();
                        }
                        $('#busyDiv').hide();
                        failureMessage("Spotify Authentication Failed!");
                    }
                });
            } else {
                $('#busyDiv').hide();
                clearAuthentication();
                failureMessage("Spotify Authentication Failed!");
            }
        }
    });
}

function spotifyTransferFunction() {
    statusUpdate('Searching for tracks in Spotify');
    getSpotifyTrackIDs(function(response) {});
    // getSpotifyGPlayPlaylistID(function(id) {
    //     console.log('Playlist ID is' + id);
    //     GPLAY_PLIST_ID = id;
    // });
}

function getSpotifyTrackIDs(callback) {
    if (GPLAY_LIB.length > 0) {
        var i = 0;
        while (i < GPLAY_LIB.length) {
            setTimeout(getSpotiftTrackIDPlugin, i * 100, i, GPLAY_LIB);
            i++;
        }
    }
}

function getSpotiftTrackIDPlugin(i, GPLAY_LIB) {
    searchSpotifyTrack(GPLAY_LIB[i].title, GPLAY_LIB[i].artist, GPLAY_LIB[i].album, function(trackid) {
        GPLAY_TRACK_ID_ARRAY.push(trackid);
        if (i == GPLAY_LIB.length - 1) {
            statusUpdate('Creating your playlist in Spotify');
            setTimeout(function() {
                createSpotifyGPlayPlaylist(function(id) {
                    console.log('Playlist ID is ' + id);
                    GPLAY_PLIST_ID = id;
                    statusUpdate('Adding your tracks to the playlist');
                    addTracksToPlaylist(function(response) {})
                });
            }, 2000);
        }
    });
}

function createSpotifyTrackArray(a, b) {
    if (GPLAY_TRACK_ID_ARRAY.length > 0) {
        var temp = "[";
        for (var i = a; i < b; i++) {
            temp = temp + '"spotify:track:' + GPLAY_TRACK_ID_ARRAY[i] + '",'
        }
        temp = temp.slice(0, -1) + ']';
        return temp;
    }
}

function searchSpotifyTrack(track, artist, album, callback) {
    var query = track
    $.ajax({
        url: 'https://api.spotify.com/v1/search?q="' + encodeURIComponent(query) + '"&type=track',
        contentType: 'application/json',
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + SPOTIFY_CLIENT_AUTH_TOKEN,
            Accept: 'application/json'
        },
        success: function(result) {
            var items = result.tracks.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].album.name == album && items[i].artists[0].name == artist) {
                    callback(items[i].id);
                    break;
                }
            }
        },
        error: function(response) {
            $('#busyDiv').hide();
            failureMessage("Process Failed!");
            console.log(response);
            var error = JSON.parse(response.responseText);
            if (error.error.message == "Invalid access token") {
                clearAuthentication();
            }
        }
    });
}

function getSpotifyUserDetails(callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + SPOTIFY_USER_AUTH_TOKEN,
        },
        success: function(result) {
            callback(result);
        },
        error: function(response) {
            console.log(response.responseText);
            var error = JSON.parse(response.responseText);
            if (error.error.message == "Invalid access token" || error.error.message == "The access token expired") {
                clearAuthentication();
            }
        }
    });
}

function getSpotifyGPlayPlaylistID(callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/playlists',
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + SPOTIFY_USER_AUTH_TOKEN,
        },
        success: function(result) {
            var plists = result.items;
            for (var i = 0; i < plists.length; i++) {
                if (plists[i].name == "Google Play Music Library") {
                    callback(plists[i].id);
                    break;
                }
            }
        },
        error: function(response) {
            console.log(response.responseText);
            var error = JSON.parse(response.responseText);
            if (error.error.message == "Invalid access token") {
                clearAuthentication();
            }
        }
    });
}

function createSpotifyGPlayPlaylist(callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/users/' + CURRENT_USER_DETAILS.id + '/playlists',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            Authorization: 'Bearer ' + SPOTIFY_USER_AUTH_TOKEN,
        },
        data: '{"name": "Google Play Music Library","description": "Your library transferred from Google Play music to Spotify by Googlify!"}',
        success: function(result) {
            callback(result.id);
        },
        error: function(response) {
            var error = JSON.parse(response.responseText);
            if (error.error.message == "Invalid access token") {
                clearAuthentication();
            }
        }
    });
}

function addTracksToPlaylist(callback) {
    if (GPLAY_TRACK_ID_ARRAY.length > 0) {
        var c = GPLAY_TRACK_ID_ARRAY.length;
        console.log(c);
        var times = GPLAY_TRACK_ID_ARRAY.length / 100;
        for (i = 0; i < times; i++) {
            var a = i * 100;
            var b = ((c - a) < 100) ? (a + (c % 100)) : (a + 100);
            console.log(a + '    ' + b);
            $.ajax({
                url: 'https://api.spotify.com/v1/users/' + CURRENT_USER_DETAILS.id + '/playlists/' + GPLAY_PLIST_ID + '/tracks',
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    Authorization: 'Bearer ' + SPOTIFY_USER_AUTH_TOKEN,
                    Accept: 'application/json'
                },
                data: '{"uris":' + createSpotifyTrackArray(a, b) + '}',
                success: function(result) {
                    statusUpdate('Done');
                    $('#busyDiv').hide();
                    successMessage("Success! Spotify Playlist Created!")
                    console.log(result);
                    callback(result.id);
                },
                error: function(response) {
                    statusUpdate('Failed');
                    $('#busyDiv').hide();
                    failureMessage("Process Failed! Please try again!");
                    if (response.length > 0) {
                        var error = JSON.parse(response.responseText);
                        if (error.error.message == "Invalid access token") {
                            clearAuthentication();
                        }
                    }
                }
            });
        }
    }
}