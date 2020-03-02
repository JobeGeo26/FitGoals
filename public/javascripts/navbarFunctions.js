
$(document).ready(function(){
    var access_token="";
    var userId = localStorage.getItem("userId");
    console.log(userId)
    $(function(){
        var current = location.pathname;
        $('.navbar-nav li a').each(function(){
            var $this = $(this);
            // if the current path is like this link, make it active
            if($this.attr('href').indexOf(current) !== -1){
                $this.addClass('active');
                
            }
        });
    });
    if(window.location.href.includes("/home") && window.location.href.includes("user_id")){
        userId = window.location.href.split("#")[1].split("=")[2].split("&")[0]; 
        var param = {user_id: userId,
            nutrition_val1:'N/A' , 
            nutrition_amount1:'N/A', 
            nutrition_val2:'N/A',
            nutrition_amount2:'N/A'};
            var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', '/addUser');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.response);
                
            }
            else{
                console.log("Status:"+xhr.status);
            }
        };
        console.log(param);
        xhr.send(JSON.stringify(param));
    }
            
                    






});
