require.config({
  paths: {
    "JavaScript": "module",
    "qrCode": 'qrcode'
  }
});
require(['JavaScript', 'qrCode'], function (){
  // console.log($('#wrap'));
});
