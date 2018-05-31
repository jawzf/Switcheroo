function getCurrentTab(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        callback(tabs);
    });
}

function printUrl(tabs) {
    console.log(tabs[0].url);
    url = tabs[0].url;
};

function clearAuthentication() {
    SPOTIFY_AUTHORIZATION = false;
    SPOTIFY_USER_AUTH_TOKEN = undefined;
    SPOTIFY_USER_AUTH_CODE = undefined;
    CURRENT_USER_DETAILS = undefined;
    localStorage.setItem('SPOTIFY_USER_AUTH_TOKEN', undefined);
    localStorage.setItem('CURRENT_USER_DETAILS', undefined);
}

function successMessage(msg) {
    $('#successMessage').text(msg);
    $('#successDiv').show();
    setTimeout(function() {
        $('#successDiv').hide();
    }, 2000);
}

function failureMessage(msg) {
    $('#failureMessage').text(msg);
    $('#failureDiv').show();
    setTimeout(function() {
        $('#failureDiv').hide();
    }, 2000);
}

function statusUpdate(msg) {
    $('#statusMessage').text(msg);
    console.log('switcheroo status: ' + msg);
}