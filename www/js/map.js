
var map;
var marker, marker2;;
var lat = 41.8418174;
var lng = 140.7669687;
var mypoints = new Array();
var otherpoints = new Array();
var pre_line = [[]];
var PolylineOptions;
var measureOn = false;
var tmp=[];

var width = 25;
var height = 30;
var uluru = {
    lat: lat,
    lng: lng
};

var uluru_old = {
    lat: 41.8418174,
    lng: 140.7669687
};
var uluru_new = {
    lat: 41.8418174,
    lng: 140.7669687
};


$(function(){
    initMap();
    setInterval(function(){
        updateMap();
    }, 1 * 1000);
    
    setInterval(function(){
        updateMap2();
    }, 5 * 1000);
    //5秒ごとに送るデータを送った後のreturnを受け取る
    socket.on("map_back", function(data){
        var locationInfo = [];
        for (var i = 0; i < data.length; i++) {
            var str = "";
            //console.log("user" + i + "'s lines!\n");
            for (var j = 0; j < data[i].length; j++) {
                //console.log("lat : " + data[i][j].Lat+"\n");
                //console.log("lon : " + data[i][j].Lon+"\n");
                if(data[i][j].Lat != null && data[i][j].Lon != null){
                    str += (data[i][j].Lat + ", ");
                    str += (data[i][j].Lon + ", ");
                }                }
            str = str.substr(0, str.length - 2);
            locationInfo.push(str);
        }
    //alert(locationInfo.length);
    tmp=locationInfo;
    //alert(tmp);
    });
});

/*
マーカを複数にする場合はmarkerの配列を作ってあげて
    new google.maps.Marker({
        position: uluru,
        map: map
    });
    を適用する
*/
function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        center: uluru,
        zoom: 17
    });
    
    marker = new google.maps.Marker(createMarker(uluru, 'img/nanaumi.png'));
    marker2 = new google.maps.Marker(createMarker(uluru_new, 'img/watanabe.png'));
    
    
    SendRunningInfoToMap(Number(localStorage.userid), lat, lng);
    /*サーバからの履歴を線として表示できる*/
   // tmp=["37.772323, -122.214897,21.291982, -157.821856,-18.142599, 178.431,-27.46758, 153.027892","-9.737363797981372, -54.62325150000004, 21.671578686773664, 79.32206099999996"];
    /*tmp=localStorage.myrecord;
    tmp=tmp.replace(/\(|\)/g,"");
    */
    //alert(tmp);
    
    
    set_uluru(lat+0.001, lng+0.001, uluru_new);
    for(var i = 0; i < tmp.length; i++)
    pre_line[i] = changeLatLng(tmp[i]);
}

function updateMap(){
    //ローカルストレージの値からlat lngを取得
    if (!((lat=localStorage.getItem("latitude")) === void 0)){
        lat = Number(lat);
        lng = Number(localStorage.getItem("longitude"));
    }
    //一つ前と今の緯度経度をセット
    set_uluru(uluru.lat, uluru.lng, uluru_old);
    set_uluru(lat, lng, uluru);
    
    //マーカーの位置を動的に変更
    marker.setPosition(new google.maps.LatLng(uluru));
    //マーカーをマップに追加でセットする時に利用
    //marker.setMap(map);
    //マーカーの位置にマップの中央を移動
    if(Math.abs(uluru_old.lat-uluru.lat)>0.00001||Math.abs(uluru_old.lng-uluru.lng)>0.00001)
    map.setCenter(new google.maps.LatLng(uluru));
    //計測時履歴線を表示
    if (measureOn) polyLine();
}

function updateMap2(){
    set_uluru(uluru_new.lat+0.0001, uluru_new.lng+0.0001, uluru_new);
    marker2.setPosition(new google.maps.LatLng(uluru_new));
    otherPolyLine();
}

//マーカー作成関数
function createMarker(ulu, path){
    MarkerOptions={
        position: uluru,
        map: map,
        icon: markerIcon(path)
    };
    return MarkerOptions;
}

/*履歴を線で表示*/
function polyLine(){
    mypoints.push(new google.maps.LatLng(lat, lng));
    PolylineOptions = {
        map: map,
        path: mypoints,
        strokeColor: "orange",
    };
    new google.maps.Polyline(PolylineOptions);
}

function otherPolyLine(){
    otherpoints.push(new google.maps.LatLng(uluru_new.lat, uluru_new.lng));
    PolylineOptions = {
        map: map,
        path:otherpoints,
        strokeColor: "purple",
    };
    new google.maps.Polyline(PolylineOptions);
    
    //pre_line.push(new google.maps.LatLng());
    for(var i=0;i<pre_line.length;i++){
    PolylineOptions[i] = {
        map: map,
        path: pre_line[i],
    };
    new google.maps.Polyline(PolylineOptions[i]);
    }
}

//緯度経度のセット関数
function set_uluru(en_lat, en_lng, dis){
        dis.lat=en_lat,
        dis.lng=en_lng
}

//markerのアイコンを変更 path：画像のurl
function markerIcon(path){
    var Image = new google.maps.MarkerImage(path, 
    new google.maps.Size(300, 300), 
    new google.maps.Point(0, 0), 
    new google.maps.Point(width,height), 
    new google.maps.Size(width, height)
    );
    return Image;
}

function changeLatLng(latlng){
    var la, ln;
    var laln = new Array();
    var p = String(latlng).split(",");
    for(var i=0;i<p.length;i+=2){
        laln.push(new google.maps.LatLng(Number(p[i]),Number(p[i+1])));
        }
    return     laln;
}

/*計測開始/停止*/
function start(){
    measureOn = true;
}


function stop(){
    measureOn = false;
    var userid = Number(localStorage.getItem("userid"));
    SendStopSignal(userid);
    alert("stop send");
}

function SendRunningInfoToMap(user_id, current_lat, current_lon){
        socket.emit("map", { "userid" : user_id , "lat" : current_lat, "lon" : current_lon});
}

function SendStopSignal(userid) {
    socket.emit('map_stop', userid);
    }