$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArtCateList();
  // 获取分类数据
  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: function (res) {
        let html = template('pl-table', res);
        $('#tbody').html(html);
      },
    });
  }

  // 添加按钮弹出层
  var indexAdd = null;
  $('#addBtncate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });
  // 绑定事件委托，给表单的submit绑定提交事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止表单的默认提交事件
    e.preventDefault();
    // 发送ajax请求
    $.ajax({
      url: '/my/article/addcates',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败!');
        }
        // 成功就刷新页面
        initArtCateList();
        // 关闭弹出层
        layer.close(indexAdd);
      },
    });
  });

  // 给编辑按钮绑定点击事件，通过事件委托,获取编辑数据
  var indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });
    //根据id进行修改
    let id = $(this).attr('data-id');
    // 发送ajax
    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'get',
      success: function (res) {
        form.val('form-edit', res.data);
      },
    });
  });

  // 确认修改信息，发送请求，刷新页面,关闭弹层
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止表单默认提交事件
    e.preventDefault();
    $.ajax({
      url: '/my/article/updatecate',
      method: 'post',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据的失败!');
        }
        layer.msg('更新分类数据成功!');
        //更新数据
        initArtCateList();
        // 关闭弹层
        layer.close(indexEdit);
      },
    });
  });

  // 根据ID删除对应的信息
  $('body').on('click','.btn-delete',function(){
  //  获取对应的id
  let id=$(this).attr('data-id')
  // 让用户确认是否删除,发送删除请求
  layer.confirm('确认删除?',{icon:3,title:'提示'},function(index){
    $.ajax({
      method:'get',
      url:'/my/article/deletecate/'+id,
      success:function(res){
        if(res.status!==0){
          return layer.msg('删除失败!')
        }
        layer.msg('删除分类成功')
        // 关闭弹出层
        layer.close(index)
        // 刷新数据
        initArtCateList() 
   }
    })
  })

  })
});
