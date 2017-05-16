      　//即時関数
    var url = "https://fantasticrunner.herokuapp.com/"; 
    var socket = io.connect(url);
      (function () {
          
        

    //接続
    socket.on('connect', function() {
        
        localStorage.setItem("userid", 4);
        var user_id = Number(localStorage.getItem("userid"));
        
            socket.emit("rank", { "userid" : user_id });
    

        //useridを送った後のreturnを受け取る
        socket.on("rank_back", function(data){
            //alert("rank_backソケットだよ");
            for (var i = 0; i < data.length; i++) {
                console.log("user" + i + "'s data!\n");
                console.log("Userid : " + data[i].Userid+"\n");
                console.log("Name : " + data[i].Name+"\n");
                console.log("Time : " + data[i].Time+"\n");
                console.log("Dist : " + data[i].Dist+"\n");
                console.log("Cheer : " + data[i].Cheer+"\n");
                
                localStorage.setItem("name"+i, data[i].Name);
                $("#name"+i).text(localStorage.getItem("name"+i));
                
                localStorage.setItem("time"+i, data[i].Time);
                $("#time"+i).text(localStorage.getItem("time"+i));
                
                 localStorage.setItem("dist"+i, data[i].Dist);
                $("#dist"+i).text(localStorage.getItem("dist"+i));
                
                
            }
        });
        /*
         $("#name0").text(localStorage.getItem("name0"));
         $("#name1").text(localStorage.getItem("name1"));
         $("#name2").text(localStorage.getItem("name2"));
         $("#name3").text(localStorage.getItem("name3"));
         $("#name4").text(localStorage.getItem("name4"));
         */
         
        
        
     });
}());
