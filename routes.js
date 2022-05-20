const passport = require('passport');
module.exports = function (app, myDataBase) {

    app.route('/').get((req, res) => {
        //Change the response to render the Pug template
        res.render('pug', {
            title: 'Connected to Database',
            message: 'Please login',
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });

    //add the route 'login' to accept a POST request.
    //to authenticate on this rouate, add middleware: 'passport.authenticate('local')
    app.route("/login").post(passport.authenticate("local", { failureRedirect: '/' }),
        (req, res) => {
            res.render('/profile');
        }
    );

    app.route('/register')
        .post((req, res, next) => {
            myDataBase.findOne({ username: req.body.username }, (err, user) => {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    const hash = bcrypt.hashSync(req.body.password, 12);
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    },
                        (err, doc) => {
                            if (err) {
                                res.redirect('/');
                            } else {
                                // The inserted document is held within
                                // the ops property of the doc
                                next(null, doc.ops[0]);
                            }
                        }
                    )
                }
            })
        },
            passport.authenticate('local', { failureRedirect: '/' }),
            (req, res, next) => {
                res.redirect('/profile');
            }
        );

    //prevent user from just jumping to /profile without being logged in -- 
    //create ensureAuthenticated middleware, GET this in the /profile route
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };

    app.route('/profile')
        .get(ensureAuthenticated, (req, res) => {
            res.render(process.cwd() + '/views/pug/profile', { username: req.user.username });
        });


    app.route("/auth/github").get(passport.authenticate('github'));

    app.route("/auth/github/callback").get(passport.authenticate('github', { failureRedirect: '/' }),
        (req, res) => {
            req.session.user_id = req.user.id
            res.redirect('/chat');
            
        }
    );

    app.route('/chat')
        .get(ensureAuthenticated, (req, res) => {
            res.render(process.cwd() + '/views/pug/chat.pug', { user: req.user });
        });

    app.route('/logout')
        .get((req, res) => {
            req.logout();
            res.redirect('/');
        });

    app.use((req, res, next) => {
        res.status(404)
            .type('text')
            .send('Not Found');
    });
}
