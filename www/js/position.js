$(function () {

  document.addEventListener("deviceready", onDeviceReady, false);
  var watchID = null;


  // device APIs are available
  //
  function onDeviceReady() {
    // Throw an error if no update is received every 30 seconds
    //最大の精度と最小の時間間隔
    var options = {
      enableHighAccuracy : true, //精度を高める
      timeout : 30000, //タイムアウトは30秒
      maximumAge : 0 //キャッシュはさせない
    };
    watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
  }


  // onSuccess Geolocation
  //
  function onSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var geoData = latitude + ',' + longitude;
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('geoData', geoData);
    //alert(geoData);
  }


  // onError Callback receives a PositionError object
  //
  function onError(error) {
    Materialize.toast('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n', 2000,'red');
  }
});
