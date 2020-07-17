// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url;
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    };
  }
  options.complete = function (res) {
    // 不论成功还是失败都会调用的回调函数
    //  在res.responsJson中可以拿到响应的参数
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1.强制清除token
      localStorage.removeItem('token');
      // 跳转回登录
      location.href = 'http://127.0.0.1:5500/dsj/dsj-code/login.html';
    }
  };
});
