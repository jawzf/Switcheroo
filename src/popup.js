//
//
//
/************ Initialise Variables ***********/
var SPOTIFY_CLIENT_AUTH_TOKEN = "";
var CLIENT_ID = config.CLIENT_ID;
var CLIENT_SECRET = config.CLIENT_SECRET;
statusUpdate('');
var url = "";
var SPOTIFY_AUTHORIZATION = false;
var SPOTIFY_USER_AUTH_CODE;
var SPOTIFY_USER_AUTH_TOKEN;
var CURRENT_USER_DETAILS;
var GPLAY_PLIST_ID;
var GPLAY_LIB;
var GPLAY_TRACK_ID_ARRAY = [];
$.ajax({
    url: "https://accounts.spotify.com/api/token",
    type: 'POST',
    data: {
        "grant_type": "client_credentials"
    },
    headers: {
        Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    success: function(result) {
        SPOTIFY_CLIENT_AUTH_TOKEN = result.access_token;
    },
    error: function(response) {
        console.log(response);
    }
});
$('#busyDiv').hide();
if (localStorage.getItem("SPOTIFY_USER_AUTH_TOKEN") == undefined || localStorage.getItem("SPOTIFY_USER_AUTH_TOKEN") == "undefined" || localStorage.getItem("CURRENT_USER_DETAILS") == undefined || localStorage.getItem("CURRENT_USER_DETAILS") == "undefined") {
    clearAuthentication();
} else {
    SPOTIFY_AUTHORIZATION = true;
    SPOTIFY_USER_AUTH_TOKEN = localStorage.getItem("SPOTIFY_USER_AUTH_TOKEN");
    CURRENT_USER_DETAILS = JSON.parse(localStorage.getItem("CURRENT_USER_DETAILS"));
    getSpotifyUserDetails(function(details) {
        CURRENT_USER_DETAILS = details;
        localStorage.setItem('CURRENT_USER_DETAILS', JSON.stringify(details));
    });
}
getCurrentTab(printUrl);
/******* Program Ready*****
*
*
*
*************Automatic Scripts************/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.GPLAY_LIB.length > 0) {
            GPLAY_LIB = JSON.parse(request.GPLAY_LIB);
            // console.log(GPLAY_LIB);
            spotifyTransferFunction();
        }
        if (request.greeting == "gplay library")
            sendResponse({
                farewell: "goodbye"
            });
        return true;
    });
if (SPOTIFY_AUTHORIZATION) {
    $('#spotifyAuthBtn').hide();
    $('#spotifyAuthBtnDisabled').show();
} else {
    $('#spotifyAuthBtn').show();
    $('#spotifyAuthBtnDisabled').hide();
}
var spotifyBtnActiveInterval = setInterval(function() {
    if (SPOTIFY_AUTHORIZATION) {
        $('#spotifyAuthBtn').hide();
        $('#spotifyAuthBtnDisabled').show();
    } else {
        $('#spotifyAuthBtn').show();
        $('#spotifyAuthBtnDisabled').hide();
    }
}, 1000);
/*
*
*
 */