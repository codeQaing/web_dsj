$(function () {
  let layer = layui.layer;
  let form = layui.form;
  //获取下拉列表数据
  initCate()
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          layer.msg('获取文章分类失败');
        }
        layer.msg('获取文章分类成功');
        // 渲染模板
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 由于下拉列表是layui提供的，需要调用一下form.render()方法刷新一下页面
        form.render();
      },
    });
  }

  // 调用富文本编辑器
  initEditor();

   // 1. 初始化图片裁剪器
   var $image = $('#image')
  
   // 2. 裁剪选项
   var options = {
     aspectRatio: 400 / 280,
     preview: '.img-preview'
   }
   
   // 3. 初始化裁剪区域
   $image.cropper(options)

  // 给选择按钮添加点击事件，触发file的input
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click();
  });
  //  监听文件框的change事件
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数据
    var files = e.target.files;
    console.log(files)
    // 判断用号是否选择了图片
    if (files.length === 0) {
      return;
    }
    // 根据文件创建url地址对象
    var newImgURL = URL.createObjectURL(files[0]);
    console.log(newImgURL)
    // 生成新的图片进行设置
    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
  });

  // 定义文章的状态
  var art_state = '已发布';
  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  });
  // 1.为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    // 2.阻止表单的默认提交事件
    e.preventDefault();
    // 3.创建formData对象
    var fd = new FormData($(this)[0]); //把jquery元素转换为原生dom
    // 4.把文章状态放到fd中
    fd.append('state', art_state);
    // fd.forEach(function(v,k){
    //   console.log(k,v)
    // })
    // 获取图片文件对象
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      });
  });
  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      url: '/my/article/add',
      data: fd,
      method:'post',
      //注意如果是向服务器提交的是formdata格式的数据
      // 必须添加下面2个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败');
        }
        layer.msg('发布文章失败!');
        // 发布文章成功后,跳转到文章列表页面
        location.href = '/dsj/dsj-code/artilce/art_list.html';
      },
    });
  }
});
