///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
/////////////////////// Dynamic Filter Table //////////////////////
///////////////////////////////////////////////////////////////////


///////////////////////////////////
///////// Global Variables ////////
///////////////////////////////////

var dataURL = '/top_data'
var tbody = d3.select("tbody");



  // append html to table after search filters
// tbody.append('p').html("test");
// tbody.append('p').html(dataURL);

// // test to pull data
// d3.json(dataURL, data => {
//     // data.forEach(song =>{
//     //     tbody.append('p').html(song.artists)
//     // })
//     // tbody.append('p').html(data[0].artists)
//     console.log(data.filter(data => data.artists === 'Ed Sheeran'))
//     test2 = data.filter(data =>data.artists === 'Ed Sheeran')
//     test3 = test2.forEach((song) => {
//         Object.entries(song).forEach(([key,value]) => {
//             console.log(value)

//         })
//         console.log('-------')
//     })
// })

///////////////////////////////////
//////// Initialize Table /////////
///////////////////////////////////

// test
d3.json(dataURL, data => {
    test2 = data.filter(data => data.name === 'Shape of You')
    test3 = test2[0].acousticness
    test4 = typeof test3
    console.log(test3)
    console.log(test4)
});


// initialize table with data
function init() {
    d3.json(dataURL, data => {
    // d3.event.preventDefault();
        data.forEach((song) => {


            var row = tbody.append("tr");
            Object.entries(song).forEach(([key, value]) => {
                var cell = row.append("td");
                if (typeof value == 'number'){
                    cell.text(value.toFixed(3))
                }
                else {
                    cell.text(value);
                }
            })
            })
    })
};

// call init
init()

///////////////////////////////////
///////// Filter Function /////////
///////////////////////////////////




function handleSubmit() {
    d3.event.preventDefault();

    // Select Input Values From Form
    var inputSong = d3.select("#songs").property("value");
    var inputArtist = d3.select("#artists").property("value");
    var inputGenre = d3.select("#genres").property("value");
    var inputYear = parseInt(d3.select("#years").property("value")); // Convert to int to match the value type in the database

    // Clear Table Body
    tbody.html("")

    // Filter
    d3.json(dataURL, data => {
        console.log(data.filter(data => data.name === 'Shape of You'))

        // Checker For Filter
        // CHecker For Song
        if (inputSong){
        var filteredSong = data.filter(data => data.name === inputSong)
        }
        else {
        var filteredSong = data.filter(data => data.name)
        };
        // Checker For Artist
        if (inputArtist){
        var filteredArtist = filteredSong.filter(data => data.artists === inputArtist)
        }
        else {
        var filteredArtist = filteredSong.filter(data => data.artists)
        };
        // Checker For Genre
        if (inputGenre){
        var filteredGenre = filteredArtist.filter(data => data.genre === inputGenre)
        }
        else {
        var filteredGenre = filteredArtist.filter(data => data.genre)

        };
        // Checker For Year
        if (inputYear){
            var filteredYear = filteredGenre.filter(data => data.year === inputYear)
            console.log(inputYear)
        }
        else {
        var filteredYear = filteredGenre.filter(data => data.year)
        };

    // Append Table Data Based on Filter Checker
        filteredYear.forEach((song) => {
            var row = tbody.append("tr");
            Object.entries(song).forEach(([key, value]) => {
                var cell = row.append("td");
                // cell.html(`<p>${value}</p>`);
                // cell.text(value);
                cell.append("p").html(value);
            })
        })
    })

    // clear search inputs
    d3.select("#songs").node().value = "";
    d3.select("#artists").node().value = "";
    d3.select("#genres").node().value = "";
    d3.select("#years").node().value = "";
};
    
///////////////////////////
///// Event Listeners /////
///////////////////////////

d3.select("#filter-btn").on("click", handleSubmit);
d3.select("form").on("submit", handleSubmit);





///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////////// End Table Script /////////////////////////
///////////////////////////////////////////////////////////////////