var j = 0;
var mainContainer = document.getElementById("mainContainer");
console.log(mainContainer);
var playlistJson = [];
var FINAL_JSON = [];

function mainCode() {
    mainContainer.scrollTop = 0;
    codeRunner();
}

function codeRunner() {
    if (j < 15188) {
        var t1 = setTimeout(function() {
            exportPlaylistCode();
        }, 1000);
    } else {
        //console.log(playlistJson);
        for (var d = 0; d < playlistJson.length; d++) {
            if (findIdInArray(playlistJson[d].id, FINAL_JSON)) {
                FINAL_JSON.push(playlistJson[d]);
            }
        }
        localStorage.setItem("GPLAY_LIB", JSON.stringify(FINAL_JSON));
        chrome.runtime.sendMessage({
            greeting: "gplay library",
            GPLAY_LIB: JSON.stringify(FINAL_JSON)
        }, function(response) {
            console.log(response.farewell);
        });
    }
}

function exportPlaylistCode() {
    mainContainer.scrollTop = 350 + j;
    var tm = setTimeout(function() {
        var playlist = document.querySelectorAll('.song-table tr.song-row');
        for (var i = 0; i < playlist.length; i++) {
            var l = playlist[i];
            var id = l.getAttribute("data-index");
            var title = l.querySelectorAll('td[data-col="title"] .column-content')[0].textContent;
            var artist = l.querySelectorAll('td[data-col="artist"] .column-content')[0].textContent;
            var album = l.querySelectorAll('td[data-col="album"] .column-content')[0].textContent;
            //console.log(artist + '|' + title + '|' + album);
            addTrackToJson(playlistJson, id, title, artist, album);
        }
    }, 1000);
    j = j + 500;
    codeRunner();
}
mainCode();

function addTrackToJson(json1, id, title, artist, album) {
    var temp = {};
    temp['id'] = id;
    temp['title'] = title;
    temp['artist'] = artist;
    temp['album'] = album;
    json1.push(temp);
    return json1;
}

function findIdInArray(id, json2) {
    for (var i = 0; i < json2.length; i++) {
        if (id == json2[i].id) {
            return false;
        }
    }
    return true;
}