$(function(){
let form=layui.form
let layer=layui.layer
form.verify({
  //自定义一个验证规则
   nickname:function (value) { 
     if(value.length>6){
       return '昵称长度必须要在1-6个字符之间'
     }
    }
});

initUserInfo()
function initUserInfo(){
  $.ajax({
    url:'/my/userinfo',
    method:'get',
    success:function(res){
      if(res.status!==0){
      return layer.msg('获取用户信息失败!')
      }
      form.val('formUserInfo', res.data);
    }
  })
}
// 重置表单
$("#btnReset").on('click',function(e){
  // 阻止表单默认重置事件
  e.preventDefault()
  // 在次调用获取请求方法
  initUserInfo()
})

// 修改表单
$('.layui-form').on('submit',function(e){
  // 阻止表单默认提交事件
  e.preventDefault()
  // 发送ajax请求
  $.ajax({
    url:'/my/userinfo',
    method:'post',
    data:$(this).serialize(),
    success:function (res) {
      if(res.status!==0){
        return layer.msg('更新用户信息失败')
      }
      layer.msg('更新用户信息成功')
      // 调用父页面中的方法，参数渲染用户的头像和优化的信息
      // 通过window对象提供的window.paren方法返回父页面调用父页面的方法
      window.parent.getUserInfo()
    }
  })
})
})

