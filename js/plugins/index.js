;(function(win){
//----------------图片循环播放-----------------
	window.top.showInfo = function(urlArr,titleArr){
		var num = 0;
		var	timer = setInterval(go,2000);
		function go(){
			num++;
			if(num == 5){
				num = 0;
			}
			$('.pic-show-panel img').attr('src',urlArr[num]);
			$('#picStatement').text(titleArr[num]);
			$('#page').text(num+1);
		}
		$('.pic-show-panel').hover(function(){
			clearInterval(timer);
			$('.left-arrow,.right-arrow').css('background','rgba(0,0,0,.5)');
		},function(){
			$('.left-arrow,.right-arrow').css('background','rgba(0,0,0,.1)');
			timer = setInterval(function(){
			go(num);
		},2000);
		});
		$(document).on('click','.left-arrow',function(){
			if(num == 0){
				num = 3
			}else{
				num = num -2;
			}
			go(num);
		});
		$(document).on('click','.right-arrow',function(){
			go(num);
		});
	}
//------------------------- 输入框提示文字效果--------------------------
	function inputFocus(selector1,selector2){
		selector1.focus(function(){
			selector2.hide();
		});
		selector1.blur(function(){
			var val = selector1.val();
			if(val.length <= 0){
				selector2.show();
			}
		});
	}
	inputFocus($('#searchByKeyword'),$('.search-by-keyword'));
	inputFocus($('.input-phone'),$('.phone-tip'));
	inputFocus($('.input-address'),$('.address-tip'));
//-------------------------------- 快速搜索选项------------------------------------
			$('.fast-service a').click(function(){
				var text = $(this).text();
				$('#searchByKeyword').focus().val(text);
			});
//-------------------------下拉框------------------------------
		$(document).on('click',function(event){
			var ev = event.target,
		    	selectType = $('.select-service-type')[0],
		    	selectCity	= $('.city-option')[0],
		    	selectArea = $('.area-option')[0];
		    	if(ev == selectType){
		    		$('.service-type-list').show();
		    	}else if(ev == selectCity){
		    		$('.city-list').show();
		    	}else if(ev == selectArea){
		    		$('.area-list').show();
		    	}else{
		    		$('.service-type-list').hide();
		    		$('.city-list').hide();
		    		$('.area-list').hide();
		    	}
		});
		$(document).on('click','.service-type-list li',function(){
			var text = $(this).text();
			$('.select-service-type').text(text);
		});

		$(document).on('click','.area-list li',function(){
			var text = $(this).text();
			$('.area-option').text(text);
		});
		// $(document).on('click','.city-list li',function(){
		// 	var text = $(this).text();
		// 	$('.city-option').text(text);
		// });
		//选择城市

//-------------------轮播图--------------------------
	
})(window);