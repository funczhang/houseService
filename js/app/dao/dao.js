(function(win, $) {
	win.dao = {};
	dao.getAllJson = function() {
		return utils.get('../../../json/data.json',function(data) {
			return data;
		});
	};
})(window,jQuery);