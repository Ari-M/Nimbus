# WeatherHUB
Weather Application for Project Two of GA-SEA WDI-15

[GitHub](https://github.com/Ari-M/hub) | [Live](https://thehubproject.herokuapp.com/) | [Tracker](https://docs.google.com/document/d/1cmicimhiACpX1AmQS5espdeHkPntn1rgG6TbY0-MVu8/edit?usp=sharing)

### ISSUES / IMPORTANT STUFF
> On deployed site there is an internal server error when you search for a city and state.
Due to the way Heroku is set up, I realized that you have to be very straight forward with your methods. In development, I rendered the results of that api request in a new ejs file the moment I pressed search. The code looked like this: 
```javascript
router.post('/search-weather', isLoggedIn, function(req, res) {
  var city = req.body.city;
  var state = req.body.state;
  var url = 'http://api.wunderground.com/api/' + key + '/conditions/q/' + state + '/' + city + '.json';
  request(url, function(error, response, body) {
    if(error) {
      console.log(error);
    } else {
      var weather = JSON.parse(body);
      db.preference.find({
        where: {userId: req.user.id}
      }).then(function(preference) {
        res.render('results', {user: req.user, preference, preference, url: url, weather: weather})
      })
    }
  });
})
```
While it worked in development, I can see how Heroku may not like this and so I will have to figure out a way to refactor that code so that it would be functional. Unfortunately, this search feature is a important part of the website and as a result, the rest of the functions involving the API do not work. 

> Weather tab is stuck loading
That is something that will be worked on soon. All it involves is a simple conditional.

> 

## Original Idea

If you look towards the beginning of the commit messages on the GitHub repo, you'll see that the original messages contained information pertaining towards social media, particularly using the Facebook Graph and Twitter API. The original idea for project two was a social media integration app. A website where you could see your twitter feed, facebook feed, and I was considering even using a news API. I made a google document as a sort of tracker where I could document daily everything that I did. However, with initally only a week to get everything to work, I quickly struggled to piece everything together in time. Even with additional time after I finished the course, when I tried to finish up and figure out a way to authenticate users through the API, I realized that it was a little overly complex and I wouldn't have been able to meet the deadline if I tried to continue this idea. This was mainly because of OAuth issues. As a result within about 12 hours of the deadline I had to almost completely refactor my entire codebase to accomadate another purpose, a weather app.

## MVP

The MVP is a barebones weather app, although not as cool, was still intricate to put together. I kept the customization features that I already had and 