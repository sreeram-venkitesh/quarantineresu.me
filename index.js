const express = require('express')
const path = require('path')
const Deta = require("deta")

const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');
const favicon = require('express-favicon');
const sslRedirect = require('heroku-ssl-redirect')
const redirect = require('express-redirect')
const session = require('express-session')
const { check, validationResult, matchedData } = require('express-validator');

const app = express()
redirect(app)


app.use(favicon(__dirname + '/favicon' +'/favicon.ico'));

app.use(cors())
app.use(express.static(__dirname + '/views'));

app.use(sslRedirect())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieSession({
    maxAge: 1000 * 60 * 30,
    name: 'quarantine-resume-session',
    keys: ['key1']
  }))


// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/privacypolicy',(req,res)=>{
    res.render('privacy')
})

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/failed', (req, res) => res.send('You Failed to log in!'))
// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))
app.get('/login', isLoggedIn, (req, res) => res.send(`Welcome Back mr ${req.user.displayName}!`))


app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    const deta = new Deta("project_key")
    const db = deta.Base("base_name")
    const resDb = deta.Base("base_name")
    //console.log(req.user)
    console.log(typeof(req.user.emails[0]['value']))
    console.log(req.user.emails[0]['value'].split('@')[0])
    
    async function getFunction(userKey){
        const user = await db.get(userKey)
        const resume = await resDb.get(userKey)
        console.log(`user is ${user}`)

        if((user===null && resume===null) || (user!=null && resume===null)){
            db.put({
                name:req.user.displayName,
                key:req.user.emails[0]['value'].split('@')[0]
            })
            res.render('resumeFirstTime',{name:req.user.displayName.split(" ")[0],firstLogin:true})
        }
        else if(user!=null && resume!=null){
            res.render('resume',{
                name:req.user.displayName.split(" ")[0],
                firstLogin:false,
                key:req.user.emails[0]['value'].split('@')[0],
                resumeName:resume.resumeName,
                bio:resume.bio,
                socials:resume.socials,
                projects:resume.projects,
            })
        }
    }
    getFunction(req.user.emails[0]['value'].split('@')[0])
  }
);


app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


app.post(
    "/resume_write",
    [
      check("name")
        .isLength({ min: 1 })
        .trim(),
      check("bio")
        .isLength({min:1})
        .bail()
        .trim(),
        check("hiddenSocials"),
        check("hiddenProjects")
        
    ],
    (req, res) => {
      console.log(req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send({
          data: req.body,
          errors: errors.mapped()
        });
      }
  
      const data = matchedData(req);
      console.log("Sanitized: ", data);
      console.log(req.user.displayName)
      console.log(req.user.email)
      

      const deta = new Deta("project_key")
      const db = deta.Base("base_name")

      db.put({
          name:req.user.displayName,
          key:req.user.emails[0]['value'].split('@')[0],
          resumeName:req.body.name,
          bio:req.body.bio,
          socials:req.body.hiddenSocials,
          projects:req.body.hiddenProjects
      })
      var redirectUrl = "/" + req.user.emails[0]['value'].split('@')[0]
      res.redirect(redirectUrl);
    }
  );

app.get('/:id', (req, res, next) => {

    const deta = new Deta("project_key")
    const db = deta.Base("base_name")
    const resDb = deta.Base("base_name")

    const userID = req.params.id
    console.log(`userID is ${userID}`)
    
    async function getIdFunction(userKey){
        console.log('inside the getidfucntion')
        const user = await db.get(userKey)
        const resume = await resDb.get(userKey)
        console.log(`collected user is ${user}`)
        
        if(user!=null && resume!=null){ 
            console.log('redirect cheyan ponee')
            console.log(user)
            
            res.render('resumeView',{
                name:user.name,
                resumeName:resume.resumeName,
                bio:resume.bio,
                socials:resume.socials,
                projects:resume.projects
            })

        }else{
            res.render('fourofour')
        }
    }
    getIdFunction(userID)
});

app.use(function(error, req, res, next) {
    res.status(500).render('fivehundred.ejs');
});

app.redirect("https://quarantine-resume.herokuapp.com","https://www.quarantineresu.me",301)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('listening to port 3000')
})