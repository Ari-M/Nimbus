
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1480103738725569',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.10'

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  });
  //   FB.AppEvents.logPageView();   
  // };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function statusChangeCallback (response) {
    if (response.status === 'connected') {
      console.log('Facebook is now connnected')
    } else {
      console.log('Facebook connection failure')
    }
  }