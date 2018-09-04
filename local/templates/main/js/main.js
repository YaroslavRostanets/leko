$(document).ready(function(){
    /*--Определение двайса--*/
    var state = {
        _device: "",
        _mobInit: function(){
            runMobile();
        },
        _tabletInit: function() {
            runTablet();
        },
        _descInit: function() {
            runDesctop();
        },
        _preWindowWidth: $(window).width(),
        _windowIncreases: function() {
            if(state._preWindowWidth > $(window).width()){
                state._preWindowWidth = $(window).width();
                return false;
            } else if (state._preWindowWidth < $(window).width()){
                state._preWindowWidth = $(window).width();
                return true;
            }
        }
    };

    (function( $ ) {
        $.fn.getDevice = function(braikPointMob,braikPointTablet) {
            Object.defineProperty(state, "device", {

                get: function() {
                    return this._device;
                },

                set: function(value) {
                    this._device = value;
                    if(value == "desctop"){
                        state._descInit();

                    } else if (value == "tablet"){
                        state._tabletInit();
                    } else if (value == "mobile"){
                        state._mobInit();
                    }
                }
            });

            $(this).on("resize load", function(){
                if($(this).width() < braikPointMob && state.device != "mobile"){
                    state.device = "mobile";
                } else if($(this).width() > braikPointMob && $(this).width() < braikPointTablet && state.device != "tablet") {
                    state.device = "tablet";
                }
                else if ($(this).width() > braikPointTablet && state.device != "desctop") {
                    state.device = "desctop";
                }
            });
        };
    })(jQuery);

    function runMobile(){

    }

    function runTablet(){

    }

    function runDesctop(){

    }

    $(window).getDevice(768,1200);

    $('.js-banner-slider').slick({
        fade: true,
        arrows: false,
        dots: true
    });

    var indSlider = $('.js-industries-slider').slick({
        arrows: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    indSlider.find('.slick-active').last().addClass('opacity');

    indSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
        console.log(currentSlide, nextSlide);
        $(this).find('.opacity').removeClass('opacity');
        if(nextSlide > currentSlide){
            $(this).find('.slick-active').last().next().addClass('opacity');
        }
    });

    indSlider.on('afterChange', function(event, slick, currentSlide, nextSlide){
        $(this).find('.slick-active').last().addClass('opacity');
    });

    var newsListSlider = $('.js-news-list').slick({
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    newsListSlider.find('.slick-active').last().addClass('opacity');

    newsListSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
        console.log(currentSlide, nextSlide);
        $(this).find('.opacity').removeClass('opacity');
        if(nextSlide > currentSlide){
            $(this).find('.slick-active').last().next().addClass('opacity');
        }
    });

    newsListSlider.on('afterChange', function(event, slick, currentSlide, nextSlide){
        $(this).find('.slick-active').last().addClass('opacity');
    });



    $(window).scroll(function(){
        console.log();
        var h = $(window).height();
        if($(window).scrollTop() > h){
            $('.js-menu').removeClass('fix');
        } else {
            $('.js-menu').addClass('fix');
        }

    });

    $('.js-toggle-drop').on('click', function(){
        if($(this).hasClass('open')){
            $(this).siblings().removeClass('open');
            $(this).addClass('open');
        } else {
            $(this).siblings().removeClass('open');
            $(this).addClass('open');
            $(this).closest('.js-main').addClass('open-drop');
        }
    });

    $('.js-close-dropdown').on('click', function(){
        $('.js-main').removeClass('open-drop');
        $('.js-toggle-drop').removeClass('open');
    });

    (function( $ ) {
        $.fn.nicePlaceholder = function() {
            var inputCol = $(this);
            inputCol.each(function(i, item){
                var placeholder = $(this).attr('placeholder');
                $(this).attr('placeholder', '');
                $(item).closest('.form-group').prepend('<div class="placeholder">' + placeholder + '</div>');
                $(item).closest('.form-group').find('input').focusin(function(){
                   $(this).closest('.form-group').addClass('focused');
                });
                $(item).closest('.form-group').find('input').focusout(function(){
                    if(!$(this).val()){
                        $(this).closest('.form-group').removeClass('focused');
                    }

                });
                console.log(item);
            });
            console.log();

        };
    })(jQuery);

    $('[data-nice-placeholder]').nicePlaceholder();

    $(window).scroll(function(){
        if($(window).scrollTop() > 60){
            $('.js-top-flex').addClass('white');
        } else {
            $('.js-top-flex').removeClass('white');
        }
        console.log($(window).scrollTop());
    });

    $('.js-menu-btn').on('click', function(){
        var main = $('.js-main');
        if (main.hasClass('menu-open')){
            closeMenu();
        } else {
            main.addClass('menu-open');
            $('.js-main .struct').fadeIn(150);
            $('body').addClass('lock');
            $('.content-wrap').append('<div class="overlay"></div>');
            $('.overlay').on('click', function () {
               closeMenu();
            });
        }

        function closeMenu() {
            console.log('close');
            main.removeClass('menu-open');
            $('body').removeClass('lock');
            $('.js-main .struct').fadeOut(150);
            $('.overlay').remove();
        }
    });

    $('.js-callback').on('click', function(){
        $('#request-call').modal({
            fadeDuration: 100,
            fadeDelay: 0.1
        });
    });

    $('.js-sign-in, .js-sign-in-btn').on('click', function(){
        $('#sign-in').modal({
            fadeDuration: 200,
            fadeDelay: 0.2
        });
    });

    $('.js-sign-up, .registration').on('click', function(){
        $('#sign-up').modal({
            fadeDuration: 200,
            fadeDelay: 0.2
        });
    });

});