// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });


    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if ( filename == '' ) {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text( placeholder.attr('data-label') );
            }
            
        });
    });

    /*---------------------------
                                  Custom select
    ---------------------------*/
    $('.custom-select').each(function(index, el) {
        makeSelect( $(this) );
    });


    /**
     *
     * Creates custom select
     *
     * @param select {Object} jQuery object ( $('.custom-select') )
     *
     * @return n/a
     *
    */
    function makeSelect( select ) {
        select.css('display', 'none');
        select.wrap('<div class="select"></div>')
        select.parent().prepend('<ul class="cs-list"></ul>');
        select.parent().prepend('<a class="cs-button btn" tabindex="-1"></a>');
        var list = select.siblings('.cs-list');
        var button = select.siblings('.cs-button');
        button.text( select.attr('data-placeholder') );

        select.find('option').each(function(index, el) {
            var c = $(this).is(':selected') ? 'selected' : '';
            if ( $(this).is(':selected') ) {
                button.text( $(this).text() );
            }
            list.append('<li class="'+c+'"><a href="#" data-value="'+$(this).attr('value')+'">'+$(this).text()+'</a></li>')
        });

        if ( !select.hasClass('links-select') ) {
            list.find('a').on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                var val = $(this).attr('data-value');
                var text = $(this).text();
                button.text(text);
                select.val(val);
                list.find('li').removeClass('selected');
                $(this).parents('li').addClass('selected')
                list.removeClass('is-active');
                button.removeClass('is-active');
            });
        } else {
            list.find('a').on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.location.href = $(this).attr('data-value');
                list.removeClass('is-active');
                button.removeClass('is-active');
            })
        }

        button.on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('.cs-button').not($(this)).removeClass('is-active');
            $('.cs-list').not(list).removeClass('is-active');

            $(this).toggleClass('is-active');
            list.toggleClass('is-active');
        });
    }
    /* close all selects if user clicked somwhere on the page */
    $(window).click(function() {
        $('.cs-button, .cs-list').removeClass('is-active');
    });


    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });

    $('.js-close-popup').on('click', function(event) {
        event.preventDefault();
        $.fancybox.close();
    });



    /*---------------------------
                                  Widget show more
    ---------------------------*/
    $('.js-widget-show-more').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('.advanced').slideToggle();

        if ( $(this).hasClass('is-active') ) {
            $(this).text( $(this).attr('data-less') )
        } else {
            $(this).text( $(this).attr('data-more') )
        }
    });


    /*---------------------------
                                  Slider on details pages
    ---------------------------*/
    $('.details-slider').slick({
        arrows: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        lazyLoad: 'ondemand',
        infinite: false     
    })



    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }



    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*---------------------------
                                  Google map init
    ---------------------------*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var styles = [];

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 16,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var styledMapType=new google.maps.StyledMapType(styles,{name:'Styled'});
        map.mapTypes.set('Styled',styledMapType);
        map.setMapTypeId('Styled');

        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Site Title"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file