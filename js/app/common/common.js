(function(win,$) {
    
	win.utils = {};
     /**
     * ajax get request
     * @param  {String} url      请求的url
     * @param  {Function} model    请求到的数据处理
     * @param  {String} dataType 请求类型
     * @return {Object}
     */
    utils.get = function(url,handler,dataType,data) {
        var dtd = $.Deferred(),
            datas;
        $.ajax({
            url: url,
            data: data || {},
            dataType: dataType || 'json',
            type: 'GET'
        }).done(function(data) {
            datas = handler ? handler(data) : data;
            dtd.resolve(datas);
        }).fail(function(a,b,c) {
            dtd.reject(datas);
        });
        return dtd.promise();
    };
})(window,jQuery);

