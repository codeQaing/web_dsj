$(function () {
  // 调用还是获取用户基本信息
  getUserInfo();
  // 点击退出登录
  var layer = layui.layer;
  $('#btnLogout').on('click', function () {
    // 弹框提示
    layer.confirm('您是否要退出?', { icon: 3, title: '提示' }, function (index) {
      //  清除token
      localStorage.removeItem('token');
      // 跳转到登录页面
      location.href = 'http://127.0.0.1:5500/dsj/dsj-code/login.html';
      // 关闭confirm弹框
      layer.close(index);
    });
  });
});

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    type: 'get',
    // 配置请求头
    //  headers:{
    // Authorization:localStorage.getItem('token')||''
    //  },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败');
      }
      renderAvatar(res.data);
    }
    // // 不论成功还是失败都会调用的回调函数
    // complete: function (res) {
    //   //  在res.responsJson中可以拿到响应的参数
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1.强制清除token
    //     localStorage.removeItem('token');
    //     // 跳转回登录
    //     location.href = 'http://127.0.0.1:5500/dsj/dsj-code/login.html';
    //   }
    // }
  })
}

function renderAvatar(user) {
  // 获取用户名
  let name = user.nickname || user.username;
  // 设置欢迎的名字
  $('.text-user').html('欢迎&nbsp;&nbsp;' + name);
  // 设置图片
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    $('.layui-nav-img').hide();
    // 设置字母的首字母大写
    let first = name[0].toUpperCase();
    $('.text-avatar').text(first).show();
  }
}
