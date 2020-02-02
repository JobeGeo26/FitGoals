$(document).ready(function(){
    var access_token = getCookie("token");
function getProfile(){
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/profile.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    document.getElementById("profpic").src=data.user.avatar;
    document.getElementById("username").textContent=data.user.displayName;
    document.getElementById("full-name").textContent=data.user.fullName;
    document.getElementById("age").textContent="Age: "+data.user.age;
    document.getElementById("joinDate").textContent="Member since "+formatDate(data.user.memberSince);
     let name = (data.user.fullName).split(" ");
     let firstName = name[0];
     let lastName = name[1];

    $("#profileFirstName").val(firstName);
    $("#profileLastName").val(lastName);
    $("#profileGender").val(data.user.gender);
    $("#profiledob").val(formatDate(data.user.dateOfBirth));
    $("#profileHeight").val((data.user.height).toFixed(2));
    $("#profileWeight").val(data.user.weight);
    $("#startDay").val(data.user.startDayOfWeek);


   
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();



}

function getLifeTimeStats(){
    
    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('GET', 'https://api.fitbit.com/1/user/-/activities.json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);
    let best = data.best.total;
    let life = data.lifetime.total;
                    if(best.length === 0){
                       
    
                    }
                    if(best.length !== 0){
                   document.getElementById("bestDist").textContent = (best.distance.value).toFixed(2)+" km on " +formatDate(best.distance.date);
                   document.getElementById("bestFloors").textContent = (best.floors.value).toFixed(0)+" floors on " +formatDate(best.floors.date);
                   document.getElementById("bestSteps").textContent = (best.steps.value).toFixed(0)+" steps on " +formatDate(best.steps.date);
                  if(life.length === 0){
                  }
                  if(life.length !== 0){
                   document.getElementById("lifeDist").textContent = (life.distance).toFixed(2)+" km";
                   document.getElementById("lifeFloors").textContent = (life.floors).toFixed(0)+" floors";
                   document.getElementById("lifeSteps").textContent = (life.steps).toFixed(0)+" steps";
                  }
}
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();
}

$("#saveBtn").click(function(){
    let fname = $("#profileFirstName").val();
    let sname = $("#profileLastName").val();
    let gender = $("#profileGender").val();
    let dob = formatDate($("#profiledob").val());
    let height = $("#profileHeight").val();
    let weight = $("#profileWeight").val();
    let start = $("#startDay").val(); 
   // console.log(fname+sname+gender+dob+height+weight+start);
    var param = "fullname="+fname+" "+sname+"&gender="+gender+"&birthday="+dob+"&height="+height
    +"&weight="+weight+"&startDayOfWeek="+start

    var xhr = new XMLHttpRequest();
    xhr.responseType= 'json';
    xhr.open('POST', 'https://api.fitbit.com/1/user/-/profile.json?'+param);
    xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
   xhr.onload = function () {
if (xhr.status === 200) {
    const data = xhr.response;
    console.log(data);

   
}
else{
    console.log("Status:"+xhr.status);
}
};
xhr.send();


setTimeout(function(){
    getProfile();
},1000);


});

getProfile();
getLifeTimeStats();

});

function formatDate(date){
    let split = date.split("-");
    let formattedDate = split[2]+'-'+split[1]+'-'+split[0];
    return formattedDate;
}