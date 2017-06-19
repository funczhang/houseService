(function(win, $) {
	/**
	 * 初始化学生列表
	 * @return null
	 */
	var initDataList = function() {
		dao.getAllJson().done(function(data) {
			if (data.flag) {
				// var html = template('studentListTemplate', data.playImg);
				// $('#studentList').html(html);
				var picUrl = new Array();
					picTitle = new Array();
				for(var i=0,len=data.playImg.length;i<len;i++){
					picUrl[i] = data.playImg[i].url;
					picTitle[i] = data.playImg[i].title;
				}
				window.top.showInfo(picUrl,picTitle);
				// 选择服务类型
				$('.service-type-list').html(template('serviceTypeTmpl',data.serviceType));
				//选择城市
				$('.city-list').html(template('cityListTmpl',data.city));

				$(document).on('click','.city-list li',function(){
					var text = $(this).text();
					$('.city-option').text(text);
					var index = $('.city-list li').index($(this));
					$('.area-list').html(template('areaListTmpl',data.city[index].childOption));
				});

				$('.worker-list').html(template('workerTmpl',data.worker));

				// console.log(data.provider);
				$('.provider-list').html(template('providerTmpl',data.provider));

			} else {
				alert(data.msg);
			}
		}).fail(function() {});
	};

	var addEvent = function() {};
	$(function() {
		initDataList();
	});
})(window, jQuery);