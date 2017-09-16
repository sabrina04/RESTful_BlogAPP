var bodyParser 		= require("body-parser"),
	mongoose       	= require("mongoose"),
	express        	= require("express"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
	app            	= express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjR6N68h6bWAhVJ0iYKHTcQB0IQjRwIBw&url=http%3A%2F%2Fwww.planwallpaper.com%2Fwallpaper-scenery&psig=AFQjCNFDDP0rX7p8miUhh-K-JajdpwN5tA&ust=1505525976397145",
// 	body: "This is a beautiful picture"
// });

// RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    var blogNew = {title: req.body.title, image: req.body.image, body: req.body.description};
    Blog.create(blogNew, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
            //console.log(foundBlog);
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   req.body.description = req.sanitize(req.body.description);
   var blogUpdated = {title: req.body.title, image: req.body.image, body: req.body.description};
   Blog.findByIdAndUpdate(req.params.id, blogUpdated, function(err, updatedBlog){
      if(err){
          console.log(err);
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});

app.listen(3000, "localhost", function(){
    console.log("SERVER IS RUNNING!");
})