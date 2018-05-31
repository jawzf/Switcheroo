$('#gplayBtn').click(function() {
    if (url.substring(0, 29) != "https://play.google.com/music") {
        chrome.tabs.create({
            url: 'https://play.google.com/music/listen?#/ap/auto-playlist-recent'
        });
    } else {
        chrome.tabs.update({
            url: 'https://play.google.com/music/listen?#/ap/auto-playlist-recent'
        });
    }
});
$('#spotifyAuthBtn').click(function() {
    authorizeSpotifyFunction();
});
$('#spotifyAuthBtnDisabled').click(function() {
    authorizeSpotifyFunction();
});
$('#infoBtn').click(function() {
    $('#helpDiv').show();
});
$('#helpDiv').click(function() {
    $('#helpDiv').hide();
});
$('#export').click(function() {
    console.log('This');
    if ((url.substring(0, 29) == "https://play.google.com/music") && (url.substring(url.length - 20, url.length) == "auto-playlist-recent")) {
        $('#busyDiv').show();
        statusUpdate('Exporting your Play Music Library');
        getCurrentTab(function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                file: 'js/gPlayMusicExporter.js'
            }, function() {});
        });
    } else {
        failureMessage("Click Open Google Play Music Library to proceed!");
    }
});
$('#testBtn').click(function() {
    spotifyTransferFunction();
});