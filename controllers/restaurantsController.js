var Restaurant = require('../models/restaurant');
var User = require('../models/user');
var yelp = require('../utilities/yelp');

function show(req, res, next) {
  //if no location, text field required? default LA?
  var location = req.body.location || req.query.location || req.user.location;
  yelp.randomRestaurant(location).then(function(restaurant) {
    res.render('show', { user: req.user, restaurant, location });
  });
}

function like(req, res) {
  Restaurant.findOne({ yelpId: req.params.yelpId }, function(err, restaurant) {
    if (restaurant) {
      req.user.favorites.push(restaurant._id);
      req.user.save(function(err) {
        res.redirect('/favorites')
      }); 
    } else {
      yelp.getRestaurantById(req.params.yelpId).then(function(rest) {
        Restaurant.create({
          yelpId: rest.id, 
          name: rest.name,
          image: rest.image_url,
          address: rest.location.display_address.join(', '),
          categories: rest.categories.map(cat => cat.title),
          coordinates: {latitude: rest.coordinates.latitude, longitude: rest.coordinates.longitude}, 
          rating: rest.rating,
          reviewCount: rest.review_count,
        }, function(err, restDoc) {
          req.user.favorites.push(restDoc._id); 
          req.user.save(function(err) {
            res.redirect('/favorites')
          }); 
        });
      });
    }
  });
}

function unlike(req, res) {
  req.user.favorites.remove(req.params.id);
  req.user.save(function(err, user) {
    res.redirect('/favorites'); 
  });
}

function favorites(req, res) {
  // if (!req.user) return res.redirect('/'); // TODO - put this in middleware
  req.user.populate('favorites', function(err, user) {
    res.render('users/favorites', { user }); 
  });
}

function postNote(req, res) {
  Restaurant.findById(req.params.id, function(err, rest) {
    rest.notes.push({ content: req.body.content })
    rest.save();
    res.redirect('/favorites');
  });
}

function deleteNote(req, res) {
  Restaurant.findById(req.params.restId, function(err, rest) {
    rest.notes.remove(req.params.noteId);
    rest.save();
    res.redirect('/favorites');
  });
}

function updateNote(req, res) {
  Restaurant.findById(req.params.restId, function(err, rest) {
    rest.notes[0].content = req.body.content;
    rest.save();
    res.redirect('/favorites');
  });
}

module.exports = {
  show,
  like,
  favorites,
  unlike,
  postNote,
  deleteNote,
  updateNote
}