var express 	= require("express");
var router  	= express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware/");


//=====================================
//		CAMPGROUND ROUTES
//=====================================

// INDEX - Show all campgrounds
router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});	
});

//CREATE - All new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and ad to campgrounds array
	var name 			= req.body.name;
	var price			= req.body.price;
	var image 			= req.body.image;
	var description 	= req.body.description
	var author 			= {
			id: req.user._id,
			username: req.user.username
	};
	var newCampground 	= {name: name, price: price, image: image, description: description, author: author};
	// Create a new campground and save to database
	Campground.create(newCampground, function (err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page default is to GET
			//

			res.redirect("/campgrounds")
		}
	});
}); 

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn , function(req, res){
	res.render("campgrounds/new")
});

// SHOW- shows more info about a campground
router.get("/:id", function(req, res){
	//find the campground id with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


// EDIT - Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});	
	});
});
							
				


// UPDATE - Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcampground){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY - Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){

	// find and delete
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground successfully deleted");
			res.redirect("/campgrounds");
		}
	})

	//redirect to campground page
});







module.exports = router;