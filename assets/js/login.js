$(function () {
  $('#link-reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  $('#reg-login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // 使用layui提供的表单验证规则，拿到layui里面的form对象
  var form = layui.form;
  var layer = layui.layer;
  // 使用verify的验证规则
  form.verify({
    //自定义一个验证规则
    pas: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repas: function (val) {
      var reval = $('.reg-box [name=password]').val();
      if (val != reval) {
        return '2次密码不一致，请重新输入';
      }
    },
  });
   //注册页面进行验证发送请求
  // 验证成功发送请求
  $('#form_reg').on('submit', function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    // 拿到数据发送请求
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    };
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功，请登录');
          // 模拟人的点击行为
          $('#reg-login').click()
    });
  });

  // 登录到index页面
  $("#form_login").on('submit',function(e){
       // 阻止表单默认提交
       e.preventDefault();
      $.ajax({
        url:'/api/login',
        method:'POST',
        data:$(this).serialize(),
          success:function(res){
            if(res.status!==0){
             return layer.msg('登录失败，请重新输入')
            }
            layer.msg('登录成功')
            // 保存token值
            localStorage.setItem('token',res.token)
            // 跳转到后台index页面,注意拼接的路径
            location.href="/dsj/dsj-code/index.html"
          }
      })
  })
});
