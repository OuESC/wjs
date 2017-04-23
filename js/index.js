/*
* @Author: Administrator
* @Date:   2017-01-17 16:53:45
* @Last Modified by:   Administrator
* @Last Modified time: 2017-01-20 09:20:56
*/

'use strict';
//　需求 ：在手机上需要换成小图，并且让小图的宽度是默认百分比，高度随着宽度等比例缩放

/*思路： 
 （1）绑定resize事件 只要窗口一旦发生改变立马触发，重新去获取整个屏幕的宽度
 （2）检测是否处于小屏或者大屏，如果是小屏幕，就改变img的src的值
 （3）将img的不同的src的值作为自定义的属性放到了每一个的IMG的标签上面
 （4）动态获取img的自定义src属性，去替换img真正的src
 （5）改变不同屏幕下面的css*/

$(function(){

	// 原生也是支持的
	// dom.addEventListener('resize', function(){})
	// 获取所有的图片
	var imgAll = $('.carousel-inner img');
	var item = $('.carousel-inner .item');


	// 检测每一个li的宽度 进行累加 将得到的总宽赋值给ul
	var srcollWrap = $('.srcoll-wrap');
	// 获取srcollWrap下面的ul
	var srcollWrapUl = $('ul',srcollWrap);
	var srcollWrapLi = $('li',srcollWrap);
	var allWidth = 0;
	srcollWrapLi.each(function(index, el) {
		var _el = $(el);
		allWidth += _el.width();
	});
	srcollWrapUl.width(allWidth);


	// resize 事件 指的是只要浏览器窗口发生改变的情况下，持续触发
	// 利用trigger自动初始化
	$(window).resize(_resize).trigger('resize');
	// 未优化版本
	/*function _resize (){

		// 动态去获取屏幕的宽度
		var windowWidth = $(this).width();
		// 检测是否是小屏幕
		var isSmallScreen = windowWidth < 640;
		if(isSmallScreen){
			imgAll.each(function(index, el) {
				var _el = $(el);
				// 获取当前的那张图片里面的ssrc 小图片的路径
				var src = _el.data('ssrc');
				// console.log(src);
				// 替换原来的src
				//_el.src = src; //不能直接用src去替换 因为这是一个JQ对象
				_el.attr('src',src);

				// 改变小图的css
				_el.css({
					height : 'auto',
					position : 'static',
					transform : 'none',
					width : '100%'
				})
			});
			item.height('auto');
		}else{
			imgAll.each(function(index, el) {
				var _el = $(el);
				// 获取当前的那张图片里面的ssrc 大图片的路径
				var src = _el.data('bsrc');
				// console.log(src);
				// 替换原来的src
				//_el.src = src; //不能直接用src去替换 因为这是一个JQ对象
				_el.attr('src',src);

				// 改变小图的css
				_el.css({
					height : 410,
					position : 'absolute',
					transform : 'translateX(-50%)',
					width : 'auto'
				})
			});
			item.height(410);
		}

	}*/
	// 优化版本
	function _resize (){
		// 动态去获取屏幕的宽度
		var windowWidth = $(this).width();
		// 检测是否是小屏幕
		var isSmallScreen = windowWidth < 640;
		
		imgAll.each(function(index, el) {
			var _el = $(el);
			// 获取当前的那张图片里面的ssrc 小图片的路径
			var src = _el.data(isSmallScreen ? 'ssrc' : 'bsrc');
			// console.log(src);
			// 替换原来的src
			//_el.src = src; //不能直接用src去替换 因为这是一个JQ对象
			_el.attr('src',src);
			// 改变小图的css
			_el.css({
				height : isSmallScreen ? 'auto' : 410,
				position : isSmallScreen ? 'static' : 'absolute',
				transform : isSmallScreen ? 'none' : 'translateX(-50%)',
				width : isSmallScreen ? '100%' : 'auto'
			})	
		})
		item.height(isSmallScreen ? 'auto' : 410);
		console.log(srcollWrap)
		// 根据屏幕的大小情况判断是否需要给srcollWrap添加滚动条
		srcollWrap.css('overflow',isSmallScreen ? 'scroll' : 'visible')
	}
	
	// $('.login').click(function(){
	// 	alert(1);
	// }).trigger('click');
	

	// 在手机端滑动的时候去轮播图片

	var carousel = $('.carousel');
	var startX = 0;  // 记录手指开始的落点
	// 在JQ里面 所有的touch事件都用ON去绑定
	carousel.on('touchstart',function(e){
		// 在JQ里面 针对event事件对象包装过了，如果想要获得原生的event事件对象，需要通过originalEvent去获取
		startX = e.originalEvent.touches[0].pageX;
	})
	carousel.on('touchend',function(e){
		// 在touchend事件里面只能获取changedTouches手指数组列表
		var dx = e.originalEvent.changedTouches[0].pageX - startX;
		// 判断滑动的距离
		if(Math.abs(dx) > 50){
			// 判断方向
			if(dx > 0){
				// 看到上一张
				carousel.carousel('prev');
			}else{
				// 看到下一张
				carousel.carousel('next');
			}
		}

	})

})