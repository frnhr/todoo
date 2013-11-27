
jQuery.wait = function(time) {
    return $.Deferred(function(dfd) {
        setTimeout(dfd.resolve, time);
    });
};


jQuery(function($){

    $('.nojs').hide();
    $('.yesjs').show();

    var items;
    var $items = $('ul.items');
    $items.data('sortby', 'priority');
    $items.data('sortdir', -1);

    $.ajaxSetup({
        headers: { 'X-CSRFToken': $.cookie('csrftoken') }
    });

    var get_items = function() {
        var items = [];
        var dfd = $.Deferred();
        $.ajax({
            url: "/api/items/" //@TODO pass dynamically
        })
        .done(function(data) {
            //@TODO error handling
            //@TODO pagination
            items = items.concat(data.results);
            dfd.resolve(items);
        });
        return dfd;
    };

    var sort_by = function(field, direction) {
        if (typeof direction === 'undefined') {
            direction = 1;
        }
        return function(a, b) {
            var aName = a[field];
            var bName = b[field];
            if (aName == null) aName = '0';
            if (bName == null) bName = '0';
            var compare =  ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0)) * direction;
            if (compare === 0) {
                compare = ((a.url < b.url) ? -1 : ((a.url > b.url) ? 1 : 0)) * direction;
            }
            return compare

        }
    };

    var sort_items = function(items, $ul) {
        $ul.find('.header').find('.sortdir_U, .sortdir_D').removeClass('sortdir_U sortdir_D');
        var sortby = $ul.data('sortby');
        var sortdir = $ul.data('sortdir');
        $ul.find('.header .'+sortby).addClass( 'sortdir_' + (sortdir === 1 ? 'U' : 'D' ) );
        return items.sort(sort_by(sortby, sortdir));
    };

    var render_items = function(items, $ul) {
        $ul.find('li.item:not(.prototype):not(.form):not(.header)').remove();
        var $prototype = $ul.find('li.prototype');
        $.each(items, function(i, item){
            $item = $prototype.clone().removeClass('prototype');
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

    var change_order_click = function(event) {
        event.preventDefault();
        var $this = $(this);
        var $ul = $this.parents('.items');
        var current_sortby = $ul.data('sortby');
        var current_sortdir = $ul.data('sortdir');
        var new_sortby = $this.data('sortby');
        var new_sortdir = $this.data('sortdir');
        if (current_sortby === new_sortby) {
            new_sortdir = -1 * current_sortdir
        }
        $ul.data('sortby', new_sortby);
        $ul.data('sortdir', new_sortdir);
        items = sort_items(items, $ul);
        render_items(items, $ul);
    };
    $items.on('click', '.header .sortable', change_order_click);

    var completed_click = function() {
        var $this = $(this);
        var $item = $this.parents('.item');
        var item = $item.data('item');
        item.completed = $this.is(':checked');
        $this.attr('disabled', 'disabled');
        $.when(
            $.ajax({
                method: 'PUT',
                url: $item.data('item').url,
                data : item
            }),
            $.wait(500)  // sense of heavy, baby!
        )
        .done(function(data){
            $this.prop('checked', data.checked);
            $this.attr('disabled', false);
        });
    };
    $items.on('click', '.item .completed input', completed_click);

    get_items()
        .done(function(data){
            items = sort_items(data, $items);
            render_items(items, $items);
        });



});