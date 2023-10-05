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

// RAWG API function call for search
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
            // Call function to generate game lists based on data results
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

// When search button is clicked add paremeters to endpoint and call api
function handleSearchButton() {
    gamelistEl.empty();
    console.log('SEARCH PRESSED');
    // limit search to 10 results per page
    var searchInputEl = '&page_size=10&search=';
    searchInputEl += $('#searchInput').val().trim();
    // searchInputEl += filterGenres();
    rawgGames(rawgUrl + apiKey + searchInputEl);
}

// Search button event
searchButtonEl.on('click', handleSearchButton);
// Pressing enter key
$('#searchInput').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        searchButtonEl.click();
        return false;
    }
});


// TODO: Need add a function for filter parameters and add it to search or call another api
function filterGenres() {
    var genreParam = '&genres=';
    // Get from genres tags inputs and append to genreParam var
    genreParam += ''
    return genreParam;
}


function generateGameList(searchResults) {
    for (var i = 0; i < searchResults.length; i++) {
        console.log(searchResults[i].name);

        // Create list for game results
        var gameListItemEl = $('<li class="box">');
      
        var gameImgEL = $('<img class="imgCard">').attr('src', searchResults[i].background_image);
        // Create link element for clickable game title
        var gameNameEl = $('<a>').text(searchResults[i].name).attr('href', "gamePage.html");
        gameNameEl.addClass('gameLink');
        gameNameEl.css('display', 'block');
        // Call getRating to get game rating
        var gameRatingEl = getRating(searchResults[i].rating_top);
        // Call getPlatformList to create available platforms in icons
        var gamePlatformEl = getPlatformList(searchResults[i]);
        // Append everything to list element
        gameListItemEl.append(gameNameEl, gameImgEL, gameRatingEl, gamePlatformEl);

        gamelistEl.append(gameListItemEl);
    }
}

function handleGameLink(event){
var gameLinkClicked = (event.target);

}


gamelistEl.on('click', '.gameLink', handleGameLink);


// Generate platforms
function getPlatformList(results) {
    var iconRef = ['pc', 'playstation', 'xbox', 'ios', 'nintendo'];
    var iconArr = ['windows', 'playstation', 'xbox', 'apple', 'nintendo'];
    var iconClass = ['fa-brands fa-windows', 'fa-brands fa-playstation', 'fa-brands fa-xbox', 'fa-brands fa-apple', 'fa-solid fa-gamepad'];

    var platformArr = [];
    var platforms = results.parent_platforms
    var divPlatform = $('<div class="level-left">');

    for (var i = 0; i < platforms.length; i++) {
        platformArr.push(platforms[i].platform.slug);
    }
    console.log(platformArr);

    for (var i = 0; i < platformArr.length; i++) {
        if (iconRef.includes(platformArr[i])) {
            var iconIndex = iconRef.indexOf(platformArr[i]);
            var icons = $('<i>').addClass(iconClass[iconIndex]);
            var span = $('<span class="icon is-small">');
            span.append(icons);
            var link = $('<a id="' + iconArr[iconIndex] + '" class="level-item"  aria-label="reply">')
            link.append(span);
            divPlatform.append(link);
        }
    }
    return divPlatform;
}

// Generate ratings
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
    return divRating;
}

// Initial Pagination functions
// When next button is clicked move next results
nextBtnEl.on('click', function () {
    console.log('NEXT BUTTON_--------------')
    console.log(next);
    gamelistEl.empty();
    rawgGames(next);
});

// When prev button is clicked move prev results
prevBtnEl.on('click', function () {
    console.log('PREV BUTTON_--------------')
    console.log(prev);
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
function getPlatforms() {
    var url = 'https://api.rawg.io/api/platforms/lists/parents' + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        // Do something/ call a function
        .then(function (data) {
            console.log(data);
        })
}
// getPlatforms();

// Returns to landing page
$('#gameGeniusTitle').on('click', function () {
    window.location.reload();
})

// Initialize page
function init() {
    // Hide pagination buttons on landing page
    prevBtnEl.css('display', 'none');
    nextBtnEl.css('display', 'none');
    buttonSortBy.css('display', 'none');

    localStorage.setItem('prev', JSON.stringify(null));
    localStorage.setItem('next', JSON.stringify(null));
    // console.log('GENRE--------');
    // getGenres();
    // console.log('PLATFORM--------');
    getPlatforms();

}
init();