var Restaurant = ('./models/restaurant');

// function index (req,res){
//     // Restaurant.findById({yelpId}, function(err, restaurant){
//     //     if (err) return res.status(err.statusCode || 500).json(err);
//     //     res.json(restaurant);
//     // });
// }


function index (req,res){
    var options = {
        url: "https://api.yelp.com/v3/businesses/search?term=restaurant&location=boulder",
        headers: {
          'Authorization': 'Bearer ' + process.env.access_token
        }
      };
        
};

 


// var options = {
//     url: rootURL + 'search/users?q=' + req.body.search + ' in:fullname',
//     headers: {
//       'Authorization': 'Bearer ' + process.env.access_token
//     }
//   };





module.exports = {
    index, 
}