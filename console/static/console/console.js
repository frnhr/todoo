
jQuery.wait = function(time) {
    return $.Deferred(function(dfd) {
        setTimeout(dfd.resolve, time);
    });
};



// Format examples, is up to you how to retrieve these formats, and to decide how many formats you need
var dateFormats = {
    "usa" :{
        "D" : ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"],
        "l" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "M" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "F" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "format" : "%l, %F %d, %Y %h:%i:%s %A"
    },

    "usa_short" :{
        "D" : ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"],
        "l" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "M" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "F" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "format" : "%M %j. %Y"
    },

    "ita": {
        "D" : ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
        "l" : ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
        "M" : ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        "F" : ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno","Luglio","Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        "format" : "%l %d %F %Y %H:%i:%s"
    },

    "spa" : {
        "D" : ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
        "l" : ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
        "M" : ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
        "F" : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        "format" : "%l %d de %F de %Y %H:%i:%s"
    },

    "rus" : {
        "D" : ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
        "l" : ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
        "M" : ["янв.", "февр.", "марта", "апр.", "мая", "июня", "июля", "авг.", "сент.", "окт.", "нояб.", "дек."],
        "F" : ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
        "format" : "%l, %d %F %Y г. %H:%i:%s"
    },

    "zho" : {
        "D" : ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        "l" : ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        "M" : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "F" : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "ampm" : ["上午", "下午"],
        "format" : "%Y年%F%d%l %a%g:%i:%s"
    },

    "jpn" : {
        "D" : ["日", "月", "火", "水", "木", "金", "土"],
        "l" : ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
        "M" : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "F" : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "format" : "%Y年%F%d%l %G:%i:%s"
    }
};

function mysql2Date( mysql_timestamp ) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = mysql_timestamp.split(/[- :]/);
    var d = null;
    if ( t.length < 4 ) {
        d = new Date(t[0], t[1]-1, t[2]);
    } else if ( t.length < 6 ) {
        d = new Date(t[0], t[1]-1, t[2], t[3], t[4]);
    } else if ( t.length < 7 ) {
        d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    }
    return d;
}


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
                .find('.priority')
                    .html(item.priority)
                    .end()
                .data('item', item);
            if ( item.due_date ) {
                $item.find('.due_date')
                    .data('value', item.due_date)
                    .i18Now(dateFormats.usa_short)
                    .i18Now('setCustomDate', mysql2Date(item.due_date));
            }
            $item.appendTo($ul);
        });
        $ul.removeClass('with_active_form');
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
        $ul.addClass('with_active_form');
    };
    $items.on('click', '.item a.edit', edit_click);


    var fill_form = function($form, item) {
        $form.data('item', item);
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
        var $ul = $form.parent();
        $form.data('oitem').show();
        $form.remove();
        $ul.removeClass('with_active_form');
    };
    $items.on('click', '.item.form a.cancel', cancel_click);

    var save_click = function(event){
        event.preventDefault();
        var $this = $(this);
        var $form = $this.parents('.form');
        var old_item = $form.data('item');
        var new_item = parse_form($form);
        var $ul = $form.parents('.items');
        $form.addClass('working');
        $.when(
            put_item(new_item),
            (function(){
                var dfd = $.Deferred();
                dfd.reject();
                //return dfd;
            })(),
            $.wait(500)  // sense of heavy, baby!
        ).done(function(data){
            var i = items.indexOf(old_item);
            if (i > -1) {
                items.splice(i, 1);
            }
            items.push(data);
            items = sort_items(items, $ul);
            render_items(items, $ul);
        }).fail(function(data){
            console.error('FAIL');
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