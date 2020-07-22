$(function () {
  // 定义一个查询的参数对象，将来请求数据的时候
  // 需要把请求参数对象提交到服务器
  var form = layui.form;
  var layer = layui.layer;
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //每一页显示几条数据
    cate_id: '', //文章分类的ID
    state: '', //文章的发布状态
  };
  // 定义一个美化时间的函数
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
  };

  // 定义一个补0的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  initTable();
  // 获取列表区域数据
  function initTable() {
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败');
        }
        // 渲染模板引擎
        let html = template('tpl_table', res);
        $('tbody').html(html);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }
  initCate();
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败');
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res);
        // 渲染到dom，但是由于js是后面执行的layui文件没有监听到所以这里不能直接渲染
        $('[name=cate_id]').html(htmlStr);
        // 通过调用layui提供的表单方法重新渲染表单数据
        form.render();
      },
    });
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象Q中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 重新发送请求
    initTable();
  });

  // 定义一个渲染分页的方法
  function renderPage(total) {
    // 调用layui通过的分页插件
    var laypage = layui.laypage;
    // 渲染分页
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每一页显示的条数
      curr: q.pagenum, //默认选中第几页
      layout: ['prev', 'count', 'limit', 'skip', 'page', 'next'], //自定义排班添加一些功能
      limits: [2, 3, 5, 10], //自己每一页可以选择显示的数量
      // 触发jump回调的方式有2种:
      // 1.点击页码的时候，会触发jump回调
      // 2.只要调用了laypage.render()方法，就会触发jump的回调
      // 通过first的值进行判断如果是true就是方式2触发，否则是方式1
      jump: function (obj, first) {
        //切换分页的回调函数，可以拿到最新的页码值
        // 把最新的页码值赋值给q
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到q这个查询参数中怕gesize上
        q.pagesize = obj.limit;
        // 重新发送请求渲染模板，直接发送会造成死循环的问题,因为分页是在initTable中生成的
        // console.log(obj.curr);
        // console.log(first);
        // 把最新的页码值，赋值到Q这个查询参数对象中
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 通过代理的形式，为删除按钮绑定点击事件，处理函数
  $('body').on('click', '#btn-delete', function () {
    // 获取页面上删除按钮的个数，进行判断，如果页面上还有一个删除按钮就把页码-1，
    let len = $('.btn-delete').length;
    // 拿到ID发送请求
    let id = $('#btn-delete').attr('data-id');
    $.ajax({
      url: '/my/article/delete/' + id,
      method: 'get',
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          layer.msg('删除文章失败!');
        }
        layer.msg('删除文章成功');
        // 重新渲染模板，更新视图
        // 解决页面上没有数据了，页码跳转了数据没有出来的问题,
        // 通过删除按钮的数量进行判断，如果还有一个删除按钮就直接pagenum-1
        if (len === 1) {
          //如果len的值等于1，证明删除完毕之后，页面上没有任何数据了
          q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
        }
        initTable();
      },
    });
  });

});
