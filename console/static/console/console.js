

jQuery(function($){

    $('.nojs').hide();
    $('.yesjs').show();

    var items;
    var $items = $('ul.items');
    $items.data('sortby', 'priority');
    $items.data('sortdir', -1);

    var get_items = function() {
        var items = [];
        var defer = $.Deferred();
        $.ajax({
            url: "/api/items/" //@TODO pass dynamically
        })
        .done(function(data) {
            //@TODO error handling
            //@TODO pagination
            items = items.concat(data.results);
            defer.resolve(items);
        });
        return defer;
    };

    var sort_by = function(field, direction) {
        if (typeof direction === 'undefined') {
            direction = 1;
        }
        return function(a, b) {
            var aName = a[field];
            var bName = b[field];
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0)) * direction;
        }
    };

    var sort_items = function(items, $ul) {
        return items.sort(sort_by($ul.data('sortby'), $ul.data('sortdir')));
    };

    var render_items = function(items, $ul) {
        $ul.find('li:not(.prototype):not(.form)').remove();
        var $prototype = $ul.find('li.prototype');
        $.each(items, function(i, item){
            $item = $prototype.clone();
            $item
                .find('.completed input')
                    .prop('checked', item.completed)
                    .end()
                .find('.title')
                    .html(item.title)
                    .end()
                .find('.due_date')
                    .html(item.due_date)
                    .end()
                .find('.priority')
                    .html(item.priority)
                    .end()
                .data('item', item);
            $item.appendTo($ul);
        });
    };

    get_items()
        .done(function(data){
            items = sort_items(data, $items);
            l = items; $l = $items;
            render_items(items, $items);
        });



});