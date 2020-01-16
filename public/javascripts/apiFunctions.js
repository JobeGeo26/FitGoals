 $(document).ready(function(){
 var access_token = getCookie("token");
 $(function(){
    var url = window.location.href;
    if(url.includes("access_token")){
      access_token = url.split("#")[1].split("=")[1].split("&")[0];
      console.log(access_token);
      setCookie("token", access_token, 60);
    }

    if(url === "http://localhost:3000/" || url === "http://localhost:3000/index"){
      if (access_token === "NULL" || access_token === "") {
        document.getElementById("signInLink").setAttribute("href","https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22BCHF&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800&prompt=consent");
      } else {
        location = "/home";
      }
    }

});

$( "#logout" ).click(function() {
    var params = "token=" + access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.fitbit.com/oauth2/revoke');
    xhr.setRequestHeader("Authorization", 'Basic MjJCQ0hGOmM3NzRmNWRhNmRlMmU4ZTg2YWM1MjNiY2QxMjViYmEy');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            setCookie("token", "NULL")
            location.replace("index");
            //document.getElementById("signInLink").setAttribute("href","https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22BCHF&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800&prompt=login consent");
        } else {
          console.log("Status: " + xhr.status);
        }
    };
    xhr.send(params);


});
});


//Cookies https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
