var searchButtonEl = $('#buttonSearch');
var gamelistEl = $('#gameLists');
var gameCards = $('#gameCards');
var buttonSortBy = $('#buttonSortBy');

var prevBtnEl = $('#prevBtn');
var nextBtnEl = $('#nextBtn');
var gameCardsResultEl = $("#gameCardsResult");
var sortByContainerEl = $("#sortByContainer");

var prev;
var next;

// RAWG API key
const apiKey = '?key=3cdf9cc32da5448dbb6bfe6c7afa0561';
const rawgUrl = 'https://api.rawg.io/api/games';

// RAWG API function call for searchfiterG
// args: endpoint as input
function rawgGames(url) {
    // Hide news section of page
    console.log(url);
    $('#newsSection').css('display', 'none');
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Call function to generate game lists based on data resulst
            generateGameList(data.results);
            // Display prev and next buttons
            buttonSortBy.css('display', 'block');
            prevBtnEl.css('display', 'inline');
            nextBtnEl.css('display', 'inline');
            prev = data.previous
            next = data.next
            localStorage.setItem('prev', JSON.stringify(prev));
            localStorage.setItem('next', JSON.stringify(next));
            // Check if prev and next is null or not
            if (prev === null) {
                prevBtnEl.css('display', 'none');
            } else if (next === null) {
                nextBtnEl.css('display', 'none');
            }
        })
}

//*************************** FILTER FUNCTIONS ***************************

function search(){
    var searchParam = '&search=';
    var searchmade = $('#searchInput');
    searchParam += searchmade.val().trim();
    return searchParam;
}
function filterGenres(){
    var genreParam = '&genres=';
    // Get from genres tags inputs and append to genreParam var
    var genreselected = $("#genreSelector");
    genreParam += genreselected.val()
    return genreParam;
}
function filterPlatforms(){
    var platformParam = '&parent_platforms=';
    var platformSelected = $("#platformSelector")
    platformParam += platformSelected.val()
    return platformParam;
}
function filterNoPlayers(){
    var playersParam = '&tags='
    var playersSelected = $("#playersSelector")
    playersParam += playersSelected.val()
    return playersParam;
}

//*************************** GENERATE GAME CARD ***************************
// Generate game card results
function generateGameList(searchResults) { 
    gamelistEl.empty();
    for (var i = 0; i < searchResults.length; i++) {
        console.log(searchResults[i].name);
        // Create list for game results
        var gameListItemEl = $('<li class="box">');
        var gameImgEL = $('<img class="imgCard">').attr('src', searchResults[i].background_image);
        // Create div element to hold image and details
        var gameInfoEl = $('<div class="game-info">');
        gameInfoEl.css({
            'display': 'flex',
            'justify-content': 'flex-start',
            'align-items': 'center',
        });
        // Create separate div for title and rating
        var cardDetailsEl = $('<div>');
        cardDetailsEl.css({
            'display': 'flex',
            'flex-direction': 'column',
            'padding-left': '15px',
            'width': '100%'
        });
        // Create link element for clickable game title
        var gameNameEl = $('<a>').text(searchResults[i].name).attr('data-gameid', searchResults[i].id);
        gameNameEl.addClass('gameLink');
        gameNameEl.css('display', 'relative');
        // Call getRating to get game rating
        var gameRatingEl = getRating(searchResults[i].rating_top);
        // Call getPlatformList to create available platforms in icons
        var gamePlatformEl = getPlatformList(searchResults[i]);
        var gameGenres = getGenreList(searchResults[i].genres);
        var gameESRB = $('<h5 class="subtitle is-6">');
        if (searchResults[i].esrb_rating !== null) {
            gameESRB.text(searchResults[i].esrb_rating.name)
        } else {
            gameESRB.text('None');
        }
        // Append title and rating to separate div
        cardDetailsEl.append(gameNameEl, gameRatingEl, gameGenres, gameESRB);
        // Append everything to game-info element
        gameInfoEl.append(gameImgEL, cardDetailsEl, gamePlatformEl);
        gameListItemEl.append(gameInfoEl);
        gamelistEl.append(gameListItemEl);
    }
}
// Generate platforms
function getPlatformList(results) {
    var iconRef = ['pc', 'playstation', 'xbox', 'ios', 'nintendo'];
    var iconArr = ['windows', 'playstation', 'xbox', 'apple', 'nintendo'];
    var iconClass = ['fa-brands fa-windows', 'fa-brands fa-playstation', 'fa-brands fa-xbox', 'fa-brands fa-apple', 'fa-solid fa-gamepad'];
    
    var platformArr = [];
    var platforms = results.parent_platforms;
    var divPlatform = $('<div class="level-right flex-end">');
    
    for (var i = 0; i < platforms.length; i++) {
        platformArr.push(platforms[i].platform.slug);
    }
    
    for (var i = 0; i < platformArr.length; i++) {
        if (iconRef.includes(platformArr[i])) {
            var iconIndex = iconRef.indexOf(platformArr[i]);
            var icons = $('<i>').addClass(iconClass[iconIndex]);
            var span = $('<span class="icon is-small">');
            span.append(icons);
            var link = $('<a id="' + iconArr[iconIndex] + '" class="level-item"  aria-label="reply">');
            link.append(span);
            divPlatform.append(link);
        }
    }
    
    return divPlatform;
}
// Get ratings of games
function getRating(num) {
    console.log(num);
    var divRating = $('<p>')
    
    for (var i = 1; i <= 5; i++) {
        var rating = $('<i>');
        if (num >= i) {
            // create full star
            rating.addClass('fa-solid fa-star');
        } else {
            // create empty star
            rating.addClass('fa-regular fa-star');
        }
        
        divRating.append(rating);
    }
    divRating.append(' Rating');
    divRating.css('justify-content', 'end');
    return divRating;
}

// Get genre list for the game
function getGenreList(genres){
    var div = $('<div class="tags">');
    for (var i = 0; i < genres.length; i++) {
        var genre = $('<span class="tag">').text(genres[i].name);
        div.append(genre);
    }
    return div;
}


//*************************** CLICK EVENT FUNCTIONS ***************************

function handleGameLink(event) {
    // var gameLinkClicked = (event.target);
    var element = event.target;
    if (element.matches("a") === true) {
        var gameID = element.dataset.gameid
        localStorage.setItem('gameID', JSON.stringify(gameID));
        window.location.replace('gamePage.html');
    }
}

// When search button is clicked add paremeters to endpoint and call api
function handleSearchButton() {
    gamelistEl.empty();
    console.log('SEARCH PRESSED');
    var genre = $("#genreSelector");
    var platfrom = $("#platformSelector");
    var players = $("#playersSelector");
    var searchInputEl = search();

    if(genre.val() !== null){
        searchInputEl += filterGenres();
    }
    if(platfrom.val() !== null){
        searchInputEl += filterPlatforms();
    }
    if(players.val() !== null){
        searchInputEl += filterNoPlayers();
    }
    rawgGames(rawgUrl+apiKey+searchInputEl);

}

var platformSelector = document.getElementById('platformSelector2');

platformSelector.addEventListener('change', function() {
    const selectedOption = platformSelector.value;
    const searchInputEl = document.getElementById('searchInput').value;
    rawgGames(rawgUrl + apiKey + '&search=' + searchInputEl + '&ordering=' + selectedOption);
});


//*************************** CLICK EVENTS ***************************

// Selected game link event
gamelistEl.on('click', '.gameLink', handleGameLink);
// Search button event
searchButtonEl.on('click', handleSearchButton);

$('.title').on('click', function(event){
    var element = event.target;
    if (element.matches("p") === true) {
        var gameID = element.dataset.gameid
        console.log(gameID);
        localStorage.setItem('gameID', JSON.stringify(gameID));
        window.location.replace('gamePage.html');
    }
});
// Game title returns to landing page
$('#gameGeniusTitle').on('click', function () { window.location.reload();})
// Pressing enter key on search input
$('#searchInput').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        searchButtonEl.click();
        return false;
    }
});

// Pagination Next button
nextBtnEl.on('click', function () {
    gamelistEl.empty();
    rawgGames(next);
});

// Pagination Previous button
prevBtnEl.on('click', function () {
    gamelistEl.empty();
    rawgGames(prev);
});


//*************************** SOME OTHER CATEGORIES WE MIGHT NEED ***************************

// List of genres available for RAWG API
// returns an array of genres, we can add to genre filter

function getGenres() {
    var genreList = [];
    var url = 'https://api.rawg.io/api/genres' + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        // Do something/ call a function
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.results.length; i++) {
                genreList.push(data.results[i].slug);
            }
            console.log(genreList);
        })
    return genreList;
}

// ADD something here for autocomplete filters.

// List of Platforms available for RAWG API
function getPlatforms(){
    var platformList = []

    var url = 'https://api.rawg.io/api/platforms/lists/parents' + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        // Do something/ call a function
        .then(function (data) {
            console.log(data);

            for (var i =0; i<data.results.length; i++) {
                platformList.push(data.results[i].slug);
            }
            console.log(platformList);
        })
    return platformList;
        }

function getNOofPlayers(){
    var NoPlayers = []
    var url = 'https://api.rawg.io/api/tags' + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        // Do something/ call a function
        .then(function (data) {
            console.log(data);
            for (var i =0; i<data.results.length; i++) {
                NoPlayers.push(data.results[i].slug);
            }
            console.log( NoPlayers);

        })
    return NoPlayers;
}


// function getLatestGames() {
//     // var genreList = [];
//     var url = 'https://api.rawg.io/api/games' + apiKey + '&ordering=-metacritic,-released';
//     fetch(url)
//         .then(function (response) {
//             return response.json();
//         })
//         // Do something/ call a function
//         .then(function (data) {
//             console.log(data);
//             // for (var i = 0; i < data.results.length; i++) {
//             //     genreList.push(data.results[i].slug);
//             // }
//             // console.log(genreList);
//         })
//     // return genreList;
// }




// Initialize page
function init() {
    // Hide pagination buttons on landing page
    prevBtnEl.css('display', 'none');
    nextBtnEl.css('display', 'none');
    buttonSortBy.css('display', 'none');

    localStorage.setItem('prev', JSON.stringify(null));
    localStorage.setItem('next', JSON.stringify(null));
    localStorage.setItem('gameID', JSON.stringify(null));
    
    // getGenres();
    // getPlatforms();
    // getNOofPlayers();


}
init();