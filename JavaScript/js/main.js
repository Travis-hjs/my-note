require.config({
  paths: {
    "JavaScript": "test",
    "qrCode": 'qrcode'
  }
});
require(['JavaScript', 'qrCode'], function (){
  // console.log($('#wrap'));
});
