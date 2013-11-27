
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
        $ul.find('li.item:not(.prototype):not(.protoform):not(.header)').remove();
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
        //@TODO check & warn for any active forms
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
    $items.on('click', '.item:not(.form) .completed input', completed_click);


    var edit_click = function(event){
        event.preventDefault();
        var $this = $(this);
        var $item = $this.parents('.item');
        var $ul = $item.parent('.items');
        var $form = $ul.find('.item.protoform').clone().removeClass('protoform').addClass('form').show();
        $form.insertAfter($item);
        var item = $item.data('item');
        fill_form($form, item);
        $form.data('oitem', $item);
        $item.hide();
    };
    $items.on('click', '.item a.edit', edit_click);


    var fill_form = function($form, item) {
        $form.data('item', item);
        console.info(item);
        console.info(item.memo);
        $form
            .find('.completed input')
                .prop('checked', item.completed)
                .end()
            .find('.memo textarea')
                .val(item.memo)
                .end()
            .find('.due_date input')
                .val(item.due_date)
                .end()
            .find('.priority input')
                .val(item.priority)
                .end()
    };

    var parse_form = function($form) {
        return $.extend(true, $form.data('item'), {
            completed : $form.find('.completed input').is(':checked'),
            memo      : $form.find('.memo textarea').val(),
            due_date  : $form.find('.due_date input').val(),
            priority  : $form.find('.priority input').val()
        });
    };


    var cancel_click = function(event){
        event.preventDefault();
        var $this = $(this);
        var $form = $this.parents('.item.form');
        $form.data('oitem').show();
        $form.remove();
    };
    $items.on('click', '.item.form a.cancel', cancel_click);

    var save_click = function(event){
        event.preventDefault();
        var $this = $(this);
        var $form = $this.parents('.form');
        var old_item = $form.data('item');
        var new_item = parse_form($form);
        var $ul = $form.parents('.items');
        $.when(
            put_item(new_item),
            (function(){
                var dfd = $.Deferred();
                dfd.reject();
                //return dfd;
            })(),
            $.wait(500)  // sense of heavy, baby!
        ).done(function(data){
console.info('DATA:');
console.info(data);
            var i = items.indexOf(old_item);
            if (i > -1) {
                items.splice(i, 1);
            }
            items.push(data);
            items = sort_items(items, $ul);
            render_items(items, $ul);
        }).fail(function(data){
            console.info('FAIL');
            console.info(data);
            //@TODO render errors
        });
    };
    $items.on('click', '.item.form a.save', save_click);

    var put_item = function(item) {
        var dfd = $.Deferred();
        //item.priority=123;
        $.ajax({
            method: 'PUT',
            url: item.url,
            data : item
        })
        .done(function(data){
            dfd.resolve(data);
        }).fail(function(data){
                var errors;
                if (typeof data.responseJSON !== 'undefined') {
                    errors = data.responseJSON
                } else {
                    errors = ['unknown error!'];
                }
                dfd.reject(errors)
        });
        return dfd;
    };

    get_items()
        .done(function(data){
            items = sort_items(data, $items);
            render_items(items, $items);
        });



});