var methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    express        = require("express"),
    flash          = require("connect-flash"),
    User           = require(__dirname + "/models/user"), 
    app            = express();

var campgroundRoutes = require(__dirname + "/routes/campgrounds"),
    commentRoutes    = require(__dirname + "/routes/comments"),
    indexRoutes      = require(__dirname + "/routes/index");

// seed the database
// seedDB();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://frederik:foss2812@ds115625.mlab.com:15625/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "World of Warcraft er et fantastisk spil",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes Configurations
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("YelpCamp has started!!!");
});