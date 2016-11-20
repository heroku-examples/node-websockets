app.provider('Configs', function () {

  // 外に晒す設定値
  this.options = {
      IS_MAIN : location.pathname.includes('/main')
  };
  
  // こいつの返り値がcontrollerや他のserviceにInjectされる
  this.$get = function () {

    // これがInjectされる
    return this.options;
  }
});