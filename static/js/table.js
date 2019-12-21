///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
/////////////////////// Dynamic Filter Table //////////////////////
///////////////////////////////////////////////////////////////////


///////////////////////////////////
///////// Global Variables ////////
///////////////////////////////////

var dataURL = '/top_data'
var tbody = d3.select(".test");



  // append html to table after search filters
// tbody.append('p').html("test");
// tbody.append('p').html(dataURL);

// test to pull data
d3.json(dataURL, data => {
    data.forEach(song =>{
        tbody.append('p').html(song.artists)
    })
    console.log(data[0])
})

  // append html to table after search filters
//   filteredShape.forEach((ufoSighting) => {
//     var row = tbody.append("tr");
//     Object.entries(ufoSighting).forEach(([key, value]) => {
//       var cell = row.append("td");
//       cell.text(value);
//     })
// });

// ///////////////////////////////////
// ///////// Filter Function /////////
// ///////////////////////////////////

// function handleSubmit() {
//   // Prevent the page from refreshing
//   d3.event.preventDefault();

//   // Select the new input values from the form
//   var inputValue = d3.select("#datetime").property("value");
//   var inputCity = d3.select("#cities").property("value").toLowerCase();
//   var inputState = d3.select("#states").property("value").toLowerCase();
//   var inputCountry = d3.select("#countries").property("value").toLowerCase();
//   var inputShape = d3.select("#shapes").property("value").toLowerCase();

//   // clear the table to prepare for new data filter
//   tbody.html("")

//   // Begin filters 
//     // filters by each input which may or may not have values

//     // filter check based on date
//     if (inputValue){
//       var filteredDate = tableData.filter(data => data.datetime === inputValue)
//     }
//     else {
//       var filteredDate = tableData.filter(data => data.datetime)
//     };
//     // then filter check for city
//     if (inputCity){
//       var filteredCity = filteredDate.filter(data => data.city === inputCity)
//     }
//     else {
//       var filteredCity = filteredDate .filter(data => data.datetime)
//     };
//     // then filter check for state
//     if (inputState){
//       var filteredState = filteredCity.filter(data => data.state === inputState)
//     }
//     else {
//       var filteredState = filteredCity.filter(data => data.state)

//     };
//     // then filter check for country
//     if (inputCountry){
//         var filteredCountry = filteredState.filter(data => data.country === inputCountry)
//     }
//     else {
//       var filteredCountry = filteredState.filter(data => data.country)
//     };
//     // then filter check for shape
//     if (inputShape){
//         var filteredShape = filteredCountry.filter(data => data.shape === inputShape)
//     }
//     else {
//       var filteredShape = filteredCountry.filter(data => data.shape)
//     };


//   // append html to table after search filters
//   filteredShape.forEach((ufoSighting) => {
//       var row = tbody.append("tr");
//       Object.entries(ufoSighting).forEach(([key, value]) => {
//         var cell = row.append("td");
//         cell.text(value);
//       })
//   });
      


//   // clear search inputs
//   d3.select("#datetime").node().value = "";
//   d3.select("#cities").node().value = "";
//   d3.select("#states").node().value = "";
//   d3.select("#countries").node().value = "";
//   d3.select("#shapes").node().value = "";
// };
    
// ///////////////////////////
// ///// Event Listeners /////
// ///////////////////////////

// d3.select("#filter-btn").on("click", handleSubmit);
// d3.select("form").on("submit", handleSubmit);




























///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////////// End Table Script /////////////////////////
///////////////////////////////////////////////////////////////////