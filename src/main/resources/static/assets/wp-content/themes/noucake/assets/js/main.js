(function ($) {
    'use strict';
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    }

    function masonry() {
        var masonryTrigger = $('.ps-masonry');
        if (masonryTrigger.length > 0) {
            masonryTrigger.imagesLoaded(function () {
                masonryTrigger.masonry({
                    columnWidth: '.grid-sizer',
                    itemSelector: '.grid-item'
                });
            });
            var filters = masonryTrigger.closest('.ps-section--masonry').find('.ps-masonry__filter');

            filters.on('click', 'a', function () {
                var selector = $(this).attr('data-filter');
                filters.find('a').removeClass('current');
                $(this).addClass('current');
                masonryTrigger.masonry({
                    itemSelector: '.grid-item',
                    masonry: {
                        columnWidth: '.grid-sizer'
                    },
                    filter: selector
                });

                return false;
            });
        }
    }

    function backgroundImage() {
        var databackground = $('[data-background]');
        databackground.each(function () {
            if ($(this).attr('data-background')) {
                var image_path = $(this).attr('data-background');
                $(this).css({
                    'background': 'url(' + image_path + ')'
                });
            }
        });
    }

    function parallax() {
        $('.bg--parallax').each(function () {
            var el = $(this),
                xpos = "50%",
                windowHeight = $(window).height();
            if (isMobile.any()) {
                $(this).css('background-attachment', 'scroll');
            } else {
                $(window).scroll(function () {
                    var current = $(window).scrollTop(),
                        top = el.offset().top,
                        height = el.outerHeight();
                    if (top + height < current || top > current + windowHeight) {
                        return;
                    }
                    el.css('backgroundPosition', xpos + " " + Math.round((top - current) * 0.15) + "px");
                });
            }
        });
    }

    function owlCarousel(target) {
        if (target.length > 0) {
            target.each(function () {
                var el = $(this),
                    dataAuto = el.data('owl-auto'),
                    dataLoop = el.data('owl-loop'),
                    dataSpeed = el.data('owl-speed'),
                    dataGap = el.data('owl-gap'),
                    dataNav = el.data('owl-nav'),
                    dataDots = el.data('owl-dots'),
                    dataAnimateIn = el.data('owl-animate-in'),
                    dataAnimateOut = el.data('owl-animate-out'),
                    dataDefaultItem = el.data('owl-item'),
                    dataItemXS = el.data('owl-item-xs'),
                    dataItemSM = el.data('owl-item-sm'),
                    dataItemMD = el.data('owl-item-md'),
                    dataItemLG = el.data('owl-item-lg'),
                    dataNavLeft = el.data('owl-nav-left'),
                    dataNavRight = el.data('owl-nav-right');

                el.owlCarousel({
                    animateIn: dataAnimateIn,
                    animateOut: dataAnimateOut,
                    margin: dataGap,
                    autoplay: dataAuto,
                    autoplayTimeout: dataSpeed,
                    autoplayHoverPause: true,
                    loop: dataLoop,
                    nav: dataNav,
                    mouseDrag: true,
                    touchDrag: true,
                    navText: [dataNavLeft, dataNavRight],
                    dots: dataDots,
                    items: dataDefaultItem,
                    responsive: {
                        0: {
                            items: dataItemXS
                        },
                        480: {
                            items: dataItemSM
                        },
                        768: {
                            items: dataItemMD
                        },
                        992: {
                            items: dataItemLG
                        },
                        1200: {
                            items: dataDefaultItem
                        }
                    }
                });
            });
        }
    }

    function syncCarousel(main, thumbnail, duration) {
        var flag = false;
        var target = thumbnail.find('.owl-item');
        target.first().addClass('current');
        main.on('changed.owl.carousel', function (e) {
            thumbnail.find('.owl-item').removeClass('current');
            thumbnail.find('.owl-item').eq(e.item.index).addClass('current');
            if (!flag) {
                flag = true;
                thumbnail.trigger('to.owl.carousel', [e.item.index, duration, true]);
                flag = false;
            }
        });
        thumbnail.on('click', '.owl-item', function () {
            main.trigger('to.owl.carousel', [$(this).index(), duration, true]);

        }).on('changed.owl.carousel', function (e) {
            if (!flag) {
                flag = true;
                main.trigger('to.owl.carousel', [e.item.index, duration, true]);
                flag = false;
            }
        });
    }

    function menuBtnToggle() {
        var toggleBtn = $('.menu-toggle');
        var sidebar = $('.header--sidebar');
        toggleBtn.on('click', function (event) {
            var self = $(this);
            if (!self.hasClass('menu-toggle--active')) {
                self.addClass('menu-toggle--active');
                sidebar.addClass('active');
                $('.page-wrap, .header').addClass('menu-sidebar--active');
            } else {
                self.removeClass('menu-toggle--active');
                sidebar.removeClass('active');
                $('.page-wrap, .header').removeClass('menu-sidebar--active');
            }
        });
        $('.page-wrap').on('click', function (e) {
            sidebar.removeClass('active');
            $('.page-wrap, .header').removeClass('menu-sidebar--active');
            toggleBtn.removeClass('menu-toggle--active');
        });
    }

    function subMenuToggle() {
        $('body').on('click', '.menu--mobile .menu-item-has-children > a > span', function (event) {
            event.preventDefault();
            var current = $(this).closest('.menu-item-has-children')
            current.children('.sub-menu').slideToggle(300);
            current.siblings().find('.sub-menu').slideUp(300);
        });
    }

    function resizeHeader() {
        var header = $('.header')
        var checkPoint = header.data('responsive');
        var windowWidth = $(window).innerWidth();
        // mobile
        if (checkPoint > windowWidth) {
            $('.menu').find('.sub-menu').hide();
            header.find('.menu').addClass('menu--mobile');
            $('.menu').prependTo('.header--sidebar');
            $('.menu .menu-item-has-children > a').append("<span></span>");
        } else {
            $('.menu').find('.sub-menu').show();
            header.removeClass('header--mobile');
            header.find('.menu').removeClass('menu--mobile');
            $('.menu--left').prependTo('.navigation__left');
            $('.menu--right').prependTo('.navigation__right');
            $('body').removeClass('menu-sidebar--active');
            $('.header--sidebar').removeClass('active');
            $('.menu-toggle').removeClass('menu-toggle--active');
        }
    }

    function stickyHeader() {
        var header = $('.header'),
            scrollPosition = 0,
            headerTopHeight = $('.header .header__top').outerHeight(),
            checkpoint = 300;
        $(window).scroll(function (event) {
            var currentPosition = $(this).scrollTop();
            if (currentPosition < scrollPosition) {
                // On top
                if (currentPosition == 0) {
                    header.removeClass('navigation--sticky navigation--unpin navigation--pin');
                    header.css("margin-top", 0);
                }
                // on scrollUp
                else if (currentPosition > checkpoint) {
                    header.removeClass('navigation--unpin').addClass('navigation--sticky navigation--pin');
                    $('.ps-mobile-nav').removeClass('active');
                }
            }
            // On scollDown
            else {
                if (currentPosition > checkpoint) {
                    header.addClass('navigation--unpin').removeClass('navigation--pin');
                    header.css("margin-top", -headerTopHeight);
                    $('.ps-mobile-nav').addClass('active');
                }
            }
            scrollPosition = currentPosition;
        });
    }

    function mapConfig() {
        var map = $('#contact-map');
        map.lazyLoadGoogleMaps({
            key: noubakery_theme_params.map_api,
            libraries: 'places',
            region: 'GB',
            callback: function (container, map) {
                var id_map = $('#contact-map'),
                    map_zoom_control = false;

                if (id_map.length) {

                    var icon_url = noubakery_theme_params.map_marker;
                    var address = id_map.data('address');
                    var type = id_map.data('type');

                    if (type == 'coordinates') {
                        var lat = id_map.data('lat');
                        var lng = id_map.data('lng');
                        var latlng = new google.maps.LatLng(lat, lng);
                        /* Map Option */
                        var mapOptions = {
                            zoom: id_map.data('zoom'),
                            center: latlng,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            scrollwheel: map_zoom_control,
                            draggable: map_zoom_control,
                            panControl: map_zoom_control,
                            zoomControl: map_zoom_control,
                            mapTypeControl: map_zoom_control,
                            scaleControl: map_zoom_control,
                            streetViewControl: false,
                            overviewMapControl: false,
                            zoomControlOptions: {
                                style: google.maps.ZoomControlStyle.SMALL
                            },
                            styles: [{
                                "featureType": "administrative",
                                "elementType": "all",
                                "stylers": [{"visibility": "on"}, {"lightness": 33}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "all",
                                "stylers": [{"color": "#f2e5d4"}]
                            }, {
                                "featureType": "poi.park",
                                "elementType": "geometry",
                                "stylers": [{"color": "#c5dac6"}]
                            }, {
                                "featureType": "poi.park",
                                "elementType": "labels",
                                "stylers": [{"visibility": "on"}, {"lightness": 20}]
                            }, {
                                "featureType": "road",
                                "elementType": "all",
                                "stylers": [{"lightness": 20}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry",
                                "stylers": [{"color": "#c5c6c6"}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{"color": "#e4d7c6"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [{"color": "#fbfaf7"}]
                            }, {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": [{"visibility": "on"}, {"color": "#acbcc9"}]
                            }]
                        };

                        /* Create Map*/
                        var map = new google.maps.Map(document.getElementById('contact-map'), mapOptions);

                        if (icon_url == '') {

                            var marker_options = {
                                position: latlng,
                                map: map,
                                title: id_map.data('address'),
                                draggable: false,

                            };

                        } else {

                            var marker_options = {
                                position: latlng,
                                map: map,
                                title: id_map.data('address'),
                                draggable: false,
                                icon: {url: icon_url},
                                animation: google.maps.Animation.BOUNCE

                            };

                        }
                        var infowindow = new google.maps.InfoWindow({
                            content: ""
                        });
                        var marker = new google.maps.Marker(marker_options);
                        marker.addListener('click', function () {
                            infowindow.open(map, marker);
                            infowindow.setContent(id_map.data('address'));
                        });
                    } else {

                        var geocoder = new google.maps.Geocoder();

                        geocoder.geocode({'address': address}, function (results, status) {

                            if (status == google.maps.GeocoderStatus.OK) {

                                var lat = results[0].geometry.location.lat();
                                var lng = results[0].geometry.location.lng();

                            } else {

                                var lat = '39.0928745';
                                var lng = '-94.5763632';
                            }


                            var latlng = new google.maps.LatLng(lat, lng);

                            /* Map Option */
                            var mapOptions = {
                                zoom: id_map.data('zoom'),
                                center: latlng,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                                scrollwheel: map_zoom_control,
                                draggable: map_zoom_control,
                                panControl: map_zoom_control,
                                zoomControl: map_zoom_control,
                                mapTypeControl: map_zoom_control,
                                scaleControl: map_zoom_control,
                                streetViewControl: false,
                                overviewMapControl: false,
                                zoomControlOptions: {
                                    style: google.maps.ZoomControlStyle.SMALL
                                },
                                styles: [{
                                    "featureType": "administrative",
                                    "elementType": "all",
                                    "stylers": [{"visibility": "on"}, {"lightness": 33}]
                                }, {
                                    "featureType": "landscape",
                                    "elementType": "all",
                                    "stylers": [{"color": "#f2e5d4"}]
                                }, {
                                    "featureType": "poi.park",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#c5dac6"}]
                                }, {
                                    "featureType": "poi.park",
                                    "elementType": "labels",
                                    "stylers": [{"visibility": "on"}, {"lightness": 20}]
                                }, {
                                    "featureType": "road",
                                    "elementType": "all",
                                    "stylers": [{"lightness": 20}]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#c5c6c6"}]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#e4d7c6"}]
                                }, {
                                    "featureType": "road.local",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#fbfaf7"}]
                                }, {
                                    "featureType": "water",
                                    "elementType": "all",
                                    "stylers": [{"visibility": "on"}, {"color": "#acbcc9"}]
                                }]
                            };

                            /* Create Map*/
                            var map = new google.maps.Map(document.getElementById('contact-map'), mapOptions);

                            if (icon_url == '') {

                                var marker_options = {
                                    position: latlng,
                                    map: map,
                                    title: id_map.data('address'),
                                    draggable: false,

                                };

                            } else {

                                var marker_options = {
                                    position: latlng,
                                    map: map,
                                    title: id_map.data('address'),
                                    draggable: false,
                                    icon: {url: icon_url},
                                    animation: google.maps.Animation.BOUNCE

                                };

                            }
                            var infowindow = new google.maps.InfoWindow({
                                content: ""
                            });
                            var marker = new google.maps.Marker(marker_options);
                            marker.addListener('click', function () {
                                infowindow.open(map, marker);
                                infowindow.setContent(id_map.data('address'));
                            });
                        });
                    }

                }
            }
        });
    }

    function rating() {
        $('.ps-rating').barrating({
            theme: 'fontawesome-stars',
            emptyValue: '0',
            onSelect: function (value, text, event) {
                if (typeof (event) !== 'undefined') {
                    var $this = event.target,
                        parent = $($this).closest('.br-wrapper'),
                        rating = parent.find('select');
                    rating.find('option').removeAttr('selected');
                    rating.find('option').each(function () {
                        if ($(this).val() == value) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }
            }
        });
    }

    function niceSelect() {
        $('.ps-select').niceSelect();
    }

    function countDown() {
        //Call countdown plugin
        var time = $(".ps-countdown__time");
        time.each(function () {
            var el = $(this),
                value = $(this).data('time');
            var countDownDate = new Date(value).getTime();
            var timeout = setInterval(function () {
                var now = new Date().getTime(),
                    distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds = Math.floor((distance % (1000 * 60)) / 1000);
                // el.find('.days').html(days);
                el.find('.hours').html(days * 24 + hours);
                el.find('.minutes').html(minutes);
                el.find('.seconds').html(seconds);
                if (distance < 0) {
                    clearInterval(timeout);
                    el.closest('.ps-section').hide();
                }
            }, 1000);
        });
    }

    function magnificPopup() {

        $('.popup-modal').magnificPopup({
            type: 'inline',
            preloader: false,
            modal: true,
            midClick: true,
            closeBtnInside: true,
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
                open: function () {

                    $('#quickview-modal').block({
                        message: null,
                        overlayCSS: {
                            background: '#fff',
                            opacity: 0.6
                        }
                    });

                    this.st.mainClass = this.st.el.attr('data-effect');
                    var product_id = this.st.el.attr('data-product_id'),
                        product = $(this.st.el).closest('.product'),
                        data = {
                            action: 'noubakery_product_quick_view',
                            nonce: noubakery_theme_params.ajax_nonce,
                            product_id: product_id
                        };

                    $.ajax({
                        type: 'POST',
                        url: noubakery_theme_params.ajax_url,
                        data: data,
                        success: function (data) {
                            $('#quickview-modal').unblock();
                            if (data.status == 1) {
                                $('#quickview-modal .ps-product-modal').html(data.html);
                                var quickviewMain = $('#quickview-modal').find('.quickview--main'),
                                    quickviewThumbnail = $('#quickview-modal').find('.quickview--thumbnail');
                                owlCarousel(quickviewMain);
                                owlCarousel(quickviewThumbnail);
                                syncCarousel(quickviewMain, quickviewThumbnail, 1000);
                                rating();
                                niceSelect();
                                $('#quickview-modal').find('.cart .col-sm-6').removeClass('col-lg-6').addClass('col-lg-12');
                                $('#quickview-modal').find('.cart .col-sm-6').removeClass('col-lg-6').addClass('col-lg-12');
                                if (typeof wc_add_to_cart_variation_params !== 'undefined' && $('#quickview-modal .variations_form').length > 0) {
                                    $('#quickview-modal').find('.variations_form').each(function () {
                                        $(this).wc_variation_form();
                                    });
                                }
                            }
                        }
                    });

                    var quickviewMain = $('#quickview-modal').find('.quickview--main'),
                        quickviewThumbnail = $('#quickview-modal').find('.quickview--thumbnail');
                    owlCarousel(quickviewMain);
                    owlCarousel(quickviewThumbnail);
                    syncCarousel(quickviewMain, quickviewThumbnail, 1000);
                    rating();
                    niceSelect();
                    $('#quickview-modal').find('.cart .col-sm-6').removeClass('col-lg-6').addClass('col-lg-12');
                    $('#quickview-modal').find('.cart .col-sm-6').removeClass('col-lg-6').addClass('col-lg-12');
                    if (typeof wc_add_to_cart_variation_params !== 'undefined' && $('#quickview-modal .variations_form').length > 0) {
                        $('#quickview-modal').find('.variations_form').each(function () {
                            $(this).wc_variation_form();
                        });
                    }
                },
            }
        });
        if ($('#modal--subscribe').length > 0) {

            var isshow = localStorage.getItem('subscribe_isshow');
            if (isshow == null) {
                localStorage.setItem('subscribe_isshow', 1);

                // Show popup here
                setTimeout(function () {
                    $.magnificPopup.open({
                        items: {
                            src: '#modal--subscribe'
                        },
                        type: 'inline',
                        modal: true,
                    }, 0);
                }, noubakery_theme_params.subscribe_popup_delay);
            }


            $(document).on('click', '.modal-close', function (e) {
                e.preventDefault();
                localStorage.setItem('subscribe_isshow', 1);
                $.magnificPopup.close();
            });
        } else {
            $(document).on('click', '.modal-close', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
        }

    }

    function filterSlider() {
        var el = $('.ac-slider');
        var min = el.siblings().find('.ac-slider__min');
        var max = el.siblings().find('.ac-slider__max');
        var defaultMinValue = el.data('default-min');
        var defaultMaxValue = el.data('default-max');
        var maxValue = el.data('max');
        var step = el.data('step'),
            input_min = $('.frm-filter input[name="min_price"]'),
            input_max = $('.frm-filter input[name="max_price"]');

        if (el.length > 0) {
            el.slider({
                min: 0,
                max: maxValue,
                step: step,
                range: true,
                values: [defaultMinValue, defaultMaxValue],
                slide: function (event, ui) {
                    var $this = $(this),
                        values = ui.values;

                    min.text(woocommerce_price_slider_params.currency_format_symbol + values[0]);
                    max.text(woocommerce_price_slider_params.currency_format_symbol + values[1]);
                    input_min.val(values[0]);
                    input_max.val(values[1]);
                }
            });

            var values = el.slider("option", "values");
            min.text(woocommerce_price_slider_params.currency_format_symbol + values[0]);
            max.text(woocommerce_price_slider_params.currency_format_symbol + values[1]);
        } else {
            return false;
        }
    }

    function searchToggle() {
        var open = $('.ps-search-btn'),
            close = $('.ps-searchbox__remove'),
            body = $('body'),
            searchbox = $('.ps-searchbox');
        open.on('click', function (e) {
            e.preventDefault();
            searchbox.addClass('active');
            body.css({
                overflow: 'hidden'
            });
        });
        close.on('click', function (e) {
            e.preventDefault();
            searchbox.removeClass('active');
            body.css({
                overflow: 'auto'
            });
        });
    }

    function dateTimePicker() {
        $('.date-picker').datetimepicker({format: noubakery_theme_params.date_time_format});
        $('.time-picker').datetimepicker({format: noubakery_theme_params.date_time_format});
    }

    function backToTop() {
        var scrollPos = 0;
        var element = $('#back2top');
        $(window).scroll(function () {
            var scrollCur = $(window).scrollTop();
            if (scrollCur > scrollPos) {
                // scroll down
                if (scrollCur > 500) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            } else {
                // scroll up
                element.removeClass('active');
            }

            scrollPos = scrollCur;
        });

        element.on('click', function () {
            $('html, body').animate({
                scrollTop: '0px'
            }, 800);
        })
    }

    function slickConfig() {
        $('.slick.ps-cake-detail').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.slick.ps-cake-list',
            dots: false,
            arrows: false,

        });
        $('.slick.ps-cake-list').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            arrow: false,
            focusOnSelect: true,
            asNavFor: '.slick.ps-cake-detail',
            vertical: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        arrows: false,
                        slidesToShow: 4,
                        vertical: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 3,
                        vertical: false
                    }
                },
            ]
        });
    }

    function social_share_popup() {

        $('.noubakery-share-post').on('click', 'a.share', function () {
            var element = $(this),
                type = $(this).data('type'),
                message = $(this).closest('.noubakery-share-post').data('title'),
                url = $(this).closest('.noubakery-share-post').data('url'),
                share_url = '';

            switch (type) {

                case 'facebook':
                    share_url += 'http://www.facebook.com/sharer.php?u=' + url + '&t=' + encodeURIComponent(message);
                    break;
                case 'google':
                    share_url += 'https://plus.google.com/share?url=' + encodeURIComponent(message + ' ' + url);
                    break;
                case 'twitter':
                    share_url += 'https://twitter.com/home/?status=' + encodeURIComponent(message + ' ' + url);
                    break;
                case 'reddit':
                    share_url += 'http://reddit.com/submit?url=' + url + '&title=' + encodeURIComponent(message);
                    break;
                case 'linkedin':
                    share_url += 'http://linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + encodeURIComponent(message);
                    break;
                case 'tumblr':
                    share_url += 'http://www.tumblr.com/share/link?url=' + url + '&name=' + encodeURIComponent(message);
                    break;
                case 'pinterest':
                    share_url += 'http://pinterest.com/pin/create/button/?url=' + url + '&title=' + encodeURIComponent(message);
                    break;
                case 'vk':
                    share_url += 'http://vkontakte.ru/share.php?url=' + url + '&title=' + encodeURIComponent(message);
                    break;
                default:
                    share_url += 'mailto:?subject=' + message + '&body=' + url + '';
                    break;
            }

            window.open(share_url, '_blank');

            return false;
        });

    }

    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function newsletter() {
        if ($('.ps-subscribe__form').length > 0) {
            $('.ps-subscribe__form').on('click', 'button', function () {
                var val = $('.ps-subscribe__form input').val(),
                    submit = true;

                if (val == '') {
                    $.notify({
                        title: noubakery_theme_params.error_text,
                        message: noubakery_theme_params.email_empty_text
                    }, {
                        type: 'pastel-danger',
                        delay: noubakery_theme_params.notify_delay,
                        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                            '<span data-notify="title">{1}</span>' +
                            '<span data-notify="message">{2}</span>' +
                            '</div>'
                    });
                    submit = false;
                    return false;
                }

                if (!isEmail(val)) {
                    $.notify({
                        title: noubakery_theme_params.error_text,
                        message: noubakery_theme_params.email_invalid_text
                    }, {
                        type: 'pastel-danger',
                        delay: noubakery_theme_params.notify_delay,
                        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                            '<span data-notify="title">{1}</span>' +
                            '<span data-notify="message">{2}</span>' +
                            '</div>'
                    });
                    submit = false;
                    return false;
                }

                if (submit) {
                    $('.ps-subscribe__form').submmit();
                }

            });
        }
    }

    function contact() {
        $('.noubakery-contact__submit').on('click', function () {
            var $this = $(this),
                form = $(this).closest('form'),
                name = $('input[name="name"]').val(),
                email = $('input[name="email"]').val(),
                phone = $('input[name="phone"]').val(),
                content = $('textarea[name="content"]').val();

            if (name == '') {
                $.notify({
                    title: noubakery_theme_params.error_text,
                    message: noubakery_theme_params.name_empty_text
                }, {
                    type: 'pastel-danger',
                    delay: noubakery_theme_params.notify_delay,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title">{1}</span>' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                });
                return false;
            }

            if (email == '') {
                $.notify({
                    title: noubakery_theme_params.error_text,
                    message: noubakery_theme_params.email_empty_text
                }, {
                    type: 'pastel-danger',
                    delay: noubakery_theme_params.notify_delay,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title">{1}</span>' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                });
                return false;
            }

            if (content == '') {
                $.notify({
                    title: noubakery_theme_params.error_text,
                    message: noubakery_theme_params.content_empty_text
                }, {
                    type: 'pastel-danger',
                    delay: noubakery_theme_params.notify_delay,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title">{1}</span>' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                });
                return false;
            }

            if (!isEmail(email)) {
                $.notify({
                    title: noubakery_theme_params.error_text,
                    message: noubakery_theme_params.email_invalid_text
                }, {
                    type: 'pastel-danger',
                    delay: noubakery_theme_params.notify_delay,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title">{1}</span>' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                });
                return false;
            }


            var data = {
                action: 'noubakery_email_contact',
                nonce: noubakery_theme_params.ajax_nonce,
                name: name,
                phone: phone,
                email: email,
                content: content,
            };
            $.ajax({
                type: 'POST',
                url: noubakery_theme_params.ajax_url,
                data: data,
                beforeSend: function () {
                    if (form.hasClass('ps-delivery__form')) {
                        $this.html(noubakery_theme_params.btn_send_message_text + ' <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>');
                    } else {
                        $this.html('<i class="fa fa-spin fa-spinner" aria-hidden="true"></i> ' + noubakery_theme_params.btn_contact_text);
                    }
                },
                success: function (data) {
                    if (form.hasClass('ps-delivery__form')) {
                        $this.html(noubakery_theme_params.btn_send_message_text + ' <i class="fa fa-angle-right"></i>');
                    } else {
                        $this.html(noubakery_theme_params.btn_contact_text);
                    }
                    if (data.status == 1) {
                        $.notify({
                            title: noubakery_theme_params.success_text,
                            message: noubakery_theme_params.send_email_success_text
                        }, {
                            type: 'pastel-success',
                            delay: noubakery_theme_params.notify_delay,
                            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                '<span data-notify="title">{1}</span>' +
                                '<span data-notify="message">{2}</span>' +
                                '</div>'
                        });
                    } else {
                        $.notify({
                            title: noubakery_theme_params.error_text,
                            message: noubakery_theme_params.send_email_fail_text
                        }, {
                            type: 'pastel-danger',
                            delay: noubakery_theme_params.notify_delay,
                            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                '<span data-notify="title">{1}</span>' +
                                '<span data-notify="message">{2}</span>' +
                                '</div>'
                        });
                    }
                }
            });

            return false;
        });
    }

    function quick_order() {
        $('#product_quick_order').on('click', '.ps-btn', function () {
            var $this = $(this),
                form = $(this).closest('form'),
                name = form.find('input[name="name"]').val(),
                email = form.find('input[name="email"]').val(),
                address = form.find('input[name="address"]').val(),
                date = form.find('input[name="date"]').val(),
                phone = form.find('input[name="phone"]').val(),
                product_id = form.find('input[name="product_id"]').val(),
                product_qty = form.find('input[name="qty"]').val(),
                note = form.find('textarea[name="note"]').val(),
                submit = true;

            if (name == '') {
                form.find('input[name="name"]').addClass('error');
                submit = false;
            } else {
                form.find('input[name="name"]').removeClass('error');
            }

            if (email == '') {
                form.find('input[name="email"]').addClass('error');
                submit = false;
            } else {
                form.find('input[name="email"]').removeClass('error');
            }

            if (address == '') {
                form.find('input[name="address"]').addClass('error');
                submit = false;
            } else {
                form.find('input[name="address"]').removeClass('error');
            }

            if (phone == '') {
                form.find('input[name="phone"]').addClass('error');
                submit = false;
            } else {
                form.find('input[name="phone"]').removeClass('error');
            }

            if (!isEmail(email)) {
                form.find('input[name="email"]').addClass('error');
                submit = false;
            } else {
                form.find('input[name="email"]').removeClass('error');
            }

            if (submit == false) {
                $.notify({
                    title: noubakery_theme_params.error_text,
                    message: noubakery_theme_params.required_empty_text
                }, {
                    type: 'pastel-danger',
                    delay: noubakery_theme_params.notify_delay,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title">{1}</span>' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                });
                return false;
            }


            var data = {
                action: 'noubakery_quick_order',
                nonce: noubakery_theme_params.ajax_nonce,
                name: name,
                phone: phone,
                email: email,
                note: note,
                address: address,
                date: date,
                product_id: product_id,
                product_qty: product_qty,
            };

            $.ajax({
                type: 'POST',
                url: noubakery_theme_params.ajax_url,
                data: data,
                beforeSend: function () {
                    $this.html(noubakery_theme_params.btn_quick_order_text + ' <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>');
                },
                success: function (data) {
                    $this.html(noubakery_theme_params.btn_quick_order_text + ' <i class="fa fa-angle-right" aria-hidden="true"></i>');
                    if (data.status == 1) {
                        $.notify({
                            title: noubakery_theme_params.success_text,
                            message: noubakery_theme_params.quick_order_success_text
                        }, {
                            type: 'pastel-success',
                            delay: noubakery_theme_params.notify_delay,
                            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                '<span data-notify="title">{1}</span>' +
                                '<span data-notify="message">{2}</span>' +
                                '</div>'
                        });
                    } else {
                        $.notify({
                            title: noubakery_theme_params.error_text,
                            message: noubakery_theme_params.quick_order_fail_text
                        }, {
                            type: 'pastel-danger',
                            delay: noubakery_theme_params.notify_delay,
                            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                '<span data-notify="title">{1}</span>' +
                                '<span data-notify="message">{2}</span>' +
                                '</div>'
                        });
                    }
                }
            });

            return false;
        });
    }

    var remove_cart_header = function () {
        if ($('#noubakery_mini_cart').length > 0) {
            $('body').on('click', '.ps-cart-item .remove', function () {
                var btn = $(this),
                    data = {
                        product_id: $(this).data('product_id'),
                        cart_item_key: $(this).data('key'),
                        nonce: noubakery_theme_params.ajax_nonce,
                        action: 'noubakery_remove_product_from_cart'
                    };
                $.ajax({
                    type: "POST",
                    data: JSON.stringify({product_id: $(this).data('product_id')}),
                    url: '/remove/basket',
                    contentType: "application/json",
                    success: function (data) {
                        if (data) {
                            $('#noubakery_mini_cart').load('/basket',function(data){
                                $('#noubakery_mini_cart').html(data.html);
                            });
                        }
                    },
                });
                $.ajax({
                    type: "POST",
                    data: data,
                    url: noubakery_theme_params.ajax_url,
                    success: function (data) {
                        if (data.status == '1') {
                            $('#noubakery_mini_cart').html(data.html);
                        }
                    },
                });

                return false;
            });
        }
    }

    function productLightbox() {
        if (noubakery_theme_params.single_enable_lightbox) {
            $('.ps-product--detail .owl-slider').lightGallery({
                selector: '.ps-product__image a',
                thumbnail: true
            });
        }
        $('.ps-video').lightGallery();
    }


    function found_variation() {
        $('body').on('found_variation', function (e, variation) {
            var variation_id = $('.variation_id').val();
            if (variation_id == variation.variation_id) {
                if (variation.price_html != '') {
                    $('.price-for-default').hide();
                    $('.price-for-varian').html(variation.price_html).show();
                } else {
                    $('.price-for-default').show();
                    $('.price-for-varian').hide();
                }

                if (variation.variation_description != '') {
                    $('.desc-for-default').hide();
                    $('.desc-for-varian').html(variation.variation_description).show();
                } else {
                    $('.desc-for-default').show();
                    $('.desc-for-varian').hide();
                }

                if (variation.sku != '') {
                    $('.sku-for-default').hide();
                    $('.sku-for-varian').html(variation.sku).show();
                } else {
                    $('.sku-for-default').show();
                    $('.sku-for-varian').hide();
                }
            }

            if (variation.image != '') {
                var position = $('#owl-' + variation.image_id).data('position');
                if (position) {
                    $(".owl-slider.primary").trigger("to.owl.carousel", [position, 200, true]);
                }
            }
        });
    }

    $(document).ready(function () {

        $('.ps-pagination ul').addClass('pagination');
        $('.widget_price_filter').addClass('ps-widget--filter');
        $('.widget_products').addClass('ps-widget--best-seller');
        if ($("img.lazy").length > 0 && noubakery_theme_params.lazy_loading == 'yes') {
            $("img.lazy").lazyload();
        }
        $('.woocommerce-form-row .input-text').addClass('form-control');
        $('.ps-blog-detail table').addClass('table table-striped');
        $('.ps-widget select').addClass('form-control');
        $('.ps-blog-detail dl').each(function () {
            if (!$(this).hasClass('gallery-item')) {
                $(this).addClass('dl-horizontal');
            }
        });

        if ($('.widget_tag_cloud').length > 0) {
            $('.widget_tag_cloud').addClass('ps-widget--tags');
            $('.widget_tag_cloud ul').addClass('ps-tags');
        }
        $('select[name="product_per_page"]').on('change', function () {
            var form = $(this).closest('form');
            form.submit();
        });

        $('body').on('added_to_cart', function (e, fragments, cart_hash, button) {
            var product = $(button).closest('.product'),
                img = product.find('img').attr('src'),
                title = product.find('.ps-product__title').text(),
                url = product.find('.ps-product__title').attr('href');
            $.notify({
                icon: img,
                title: title,
                message: noubakery_theme_params.added_to_cart_text,
                url: url
            }, {
                type: 'minimalist',
                delay: noubakery_theme_params.notify_delay,
                icon_type: 'image',
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                    '<img data-notify="icon" class="img-circle pull-left">' +
                    '<span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span>' +
                    '</div>'
            });

            $.ajax({
                type: "POST",
                data: {nonce: noubakery_theme_params.ajax_nonce, action: 'noubakery_mobile_cart_content'},
                url: noubakery_theme_params.ajax_url,
                success: function (data) {
                    $('.mobile_cart_content').text(data.count);
                },
            });

            if ($(button).hasClass('remove-after-added')) {
                var product_id = $(button).data('product_id'),
                    type = $(button).data('type'),
                    data = {
                        product_id: product_id,
                        type: type,
                        nonce: noubakery_theme_params.ajax_nonce,
                        action: 'noubakery_remove_product_from_lists'
                    };
                $.ajax({
                    type: "POST",
                    data: data,
                    url: noubakery_theme_params.ajax_url,
                    success: function (data) {
                        product.remove();
                    },
                });
            }
        });

        if ($('.post-like').length > 0) {

            $('body').on('click', '.post-like', function () {

                var button = $(this),
                    wrap = $(this).closest('.noubakery-share-post'),
                    data = {
                        post_id: button.data('id'),
                        security: noubakery_theme_params.ajax_nonce,
                        action: 'noubakery_post_like'
                    };

                if (button.data('id') != '') {

                    $.ajax({
                        type: "POST",
                        data: data,
                        url: noubakery_theme_params.ajax_url,
                        success: function (data) {
                            wrap.html(data.button);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                        }

                    });

                }

                return false;

            });

        }

        if ($('.product-wishlist').length > 0) {

            $('body').on('click', '.product-wishlist', function () {

                var do_action = 'add';

                if ($(this).hasClass('delete-wishlist')) {
                    do_action = 'delete';
                }
                var button = $(this);
                var productId = button.data('product_id')


                console.log(productId);
                if (button.hasClass('added')) {
                    window.location.href = noubakery_theme_params.wishlist_page_url;
                    return false;
                }
                var product = button.closest('.product'),
                    img = product.find('img').attr('src'),
                    title = product.find('.ps-product__title').text(),
                    url = product.find('.ps-product__title').attr('href');

                $.ajax({
                    type: "POST",
                    url: "/products/add/favorite-product?productId=" + productId,
                    success: function (data) {
                        console.log("data", data);
                        button.addClass('added');
                        if (productId) {
                            button.html('<i class="fa fa-check" aria-hidden="true"></i>');
                            $.notify({
                                icon: img,
                                title: title,
                                message: data.html,
                                url: url
                            }, {
                                type: 'minimalist',
                                delay: noubakery_theme_params.notify_delay,
                                icon_type: 'image',
                                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                    '<a href="' + noubakery_theme_params.wishlist_page_url + '"><img data-notify="icon" class="img-circle pull-left"></a>' +
                                    '<span data-notify="title">{1}</span>' +
                                    '</div>'
                            });
                        } else {
                            $.notify({
                                title: noubakery_theme_params.error_text,
                                message: data.html
                            }, {
                                type: 'pastel-danger',
                                delay: noubakery_theme_params.notify_delay,
                                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                    '<span data-notify="title">{1}</span>' +
                                    '<span data-notify="message">{2}</span>' +
                                    '</div>'
                            });
                        }
                        setTimeout(function () {
                            button.html('<i class="ps-icon--heart"></i>');
                        }, 3000);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                    }
                });

                return false;

            });

        }

        if ($('.product-compare').length > 0) {

            $('body').on('click', '.product-compare', function () {

                var do_action = 'add';

                if ($(this).hasClass('delete-compare')) {
                    do_action = 'delete';
                }

                var button = $(this),
                    data = {
                        product_id: button.data('product_id'),
                        nonce: noubakery_theme_params.ajax_nonce,
                        action: 'noubakery_compare',
                        do_action: do_action
                    };

                if (button.hasClass('added')) {
                    window.location.href = noubakery_theme_params.compare_page_url;
                    return false;
                }

                var product = button.closest('.product'),
                    img = product.find('img').attr('src'),
                    title = product.find('.ps-product__title').text(),
                    url = product.find('.ps-product__title').attr('href');

                $.ajax({
                    type: "POST",
                    data: data,
                    url: noubakery_theme_params.ajax_url,
                    success: function (data) {
                        console.log(data);
                        button.addClass('added');
                        if (data.status == '1') {
                            button.html('<i class="fa fa-check" aria-hidden="true"></i>');
                            $.notify({
                                icon: img,
                                title: title,
                                message: data.html,
                                url: url
                            }, {
                                type: 'minimalist',
                                delay: noubakery_theme_params.notify_delay,
                                icon_type: 'image',
                                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                    '<a href="' + noubakery_theme_params.compare_page_url + '"><img data-notify="icon" class="img-circle pull-left"></a>' +
                                    '<span data-notify="title">{1}</span>' +
                                    '<span data-notify="message">{2}</span>' +
                                    '</div>'
                            });
                        } else {
                            $.notify({
                                title: noubakery_theme_params.error_text,
                                message: data.html
                            }, {
                                type: 'pastel-danger',
                                delay: noubakery_theme_params.notify_delay,
                                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                                    '<span data-notify="title">{1}</span>' +
                                    '<span data-notify="message">{2}</span>' +
                                    '</div>'
                            });
                        }
                        setTimeout(function () {
                            button.html('<i class="ps-icon--reload"></i>');
                        }, 3000);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                    }
                });

                return false;

            });

        }

        $('body').on('click', '.quantity button', function () {
            var button = $(this),
                parent = $(this).closest('.quantity'),
                input = parent.find('input'),
                number = parseInt(input.val());

            if (number >= 1) {
                if (button.hasClass('plus')) {
                    input.val(parseInt(number + 1));
                } else {
                    if (number > 1) {
                        input.val(parseInt(number - 1))
                    }
                    ;
                }
                input.trigger('change');
            }
        });

        $('body').on('click', '.nice-select .option', function (event) {
            var $option = $(this),
                $dropdown = $option.closest('.nice-select'),
                $select = $dropdown.prev('select');
            $select.val($option.data('value')).change();
        });

        $('body').on('click', '.reset_variations', function () {
            $('select.ps-select').niceSelect('update');
        });
        $('.ps-section--cart').on('click', '.ps-cart-listing__remove', function () {
            var product = $(this).closest('product'),
                url = $(this).data('url');
            product.remove();
            window.location.href = url;
        });
        $('.ps-searchbox__morelink').on('click', function () {
            $('#search_header').submit();
            return false;
        });

        $('form.ps-checkout').on('change', '#billing_city, #billing_state, #billing_postcode', function () {
            $(document.body).trigger('update_checkout');
        });

        $('.search_header_product').on('input', 'input[name="s"]', function () {
            var val = $(this).val();
            if (val.length > 2) {
                var data = {
                    key: val,
                    nonce: noubakery_theme_params.ajax_nonce,
                    action: 'noubakery_search_products',
                };
                $.ajax({
                    type: "POST",
                    data: data,
                    url: noubakery_theme_params.ajax_url,
                    beforeSend: function () {
                        $('#search_header button').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
                    },
                    success: function (data) {
                        $('#search_header button').html('<i class="ps-icon--search" aria-hidden="true"></i>');
                        if (data.status == '1') {
                            $('.ps-searchbox__result').html(data.html);
                            $('.ps-searchbox__result').show();
                            if (data.count > 4) {
                                $('.ps-searchbox__morelink').show();
                            } else {
                                $('.ps-searchbox__morelink').hide();
                            }
                            if (data.count == 0) {
                                $('.ps-searchbox__result').html('<p>' + noubakery_theme_params.not_found_posts + '</p>');
                                $('.ps-searchbox__result p').css('color', '#FFF');
                            }

                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                    }

                });
            }
        });

        if ($('.post-password-form').length > 0) {
            $('.post-password-form').addClass('form-inline');
            $('.post-password-form input[name="post_password"]').addClass('form-control');
            $('.post-password-form input[type="submit"]').addClass('ps-btn ps-btn--sm btn-black');
        }

        $(".ps-blog-listing .ps-post__thumbnail img").each(function () {
            var width = $(this).width(),
                parent = $(this).closest('.ps-post__thumbnail');
            parent.css('width', width);
        });

        if ($('.wp-block-latest-posts').length > 0) {
            $('.wp-block-latest-posts').addClass('ps-list--arrow');
        }

        backgroundImage();
        parallax();
        menuBtnToggle();
        subMenuToggle();
        masonry();
        rating();
        mapConfig();
        niceSelect();
        countDown();
        owlCarousel($('.owl-slider'));
        syncCarousel($('.primary'), $('.second'), 1000);
        syncCarousel($('.ps-cake-detail'), $('.ps-cake-list'), 1000);
        magnificPopup();
        filterSlider();
        searchToggle();
        dateTimePicker();
        backToTop();
        slickConfig();
        social_share_popup();
        newsletter();
        contact();
        quick_order();
        remove_cart_header();
        productLightbox();
        found_variation();

    });

    $(window).on('load', function () {
        $('.loader').addClass('active');
    });

    $(window).on('load resize', function () {
        resizeHeader();
        if (noubakery_theme_params.menu_desktop_fixed == 'yes') {
            stickyHeader();
        }
    });

})(jQuery);
