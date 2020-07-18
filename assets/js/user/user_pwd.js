$(function () {
  let form = layui.form;
  let layer = layui.layer;
  // 定义密码验证规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samepwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能重复';
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=rePwd]').val()) {
        return '2次密码输入不一样';
      }
    },
  });
  // 修改密码
  $('.layui-form').on('submit', function (e) {
    //  阻止表单默认提交事件
    e.preventDefault();
    // 发送ajax请求
    $.ajax({
      url: '/my/updatepwd',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改密码失败');
        }
        layer.msg('更新密码成功');
        // 重置表单，调用form表单的原生方法reset,把阿贾克斯获取的form表单转换为原生form表单
        $('.layui-form')[0].reset();
      },
    });
  });
});
