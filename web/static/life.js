/**
 * Created by massimilianocannarozzo on 21/06/14.
 */

/* globals $, Clipboard, ga, Ladda, topApps, badgePath */
let imgSrc;
let img;
let code;
let packageIdInput;
let html;
let bbcode;
let mdown;
let buildButton;
let startTime;

$(function () {
    code = $('#badgeCode');
    packageIdInput = $('#packageIdInput');
    html = $('#html');
    bbcode = $('#bbcode');
    mdown = $('#mdown');

    $('#buildButton').click(function (event) {
        const packageId = packageIdInput.val();

        event.preventDefault();
        buildButton = Ladda.create(this);
        if (packageId) {
            if (imgSrc === null || img.attr('src') === undefined || img.attr('src').indexOf(packageId) < 0) {
                resetUi();
                startTime = new Date().getTime();
                fetchBadge(packageId);
            } else {
                showError('Again!?');
            }
        } else {
            showError('Unfortunately I couldn\'t read your mind :)');
        }
    });

    $('#badgeDiv').append('<img id="badgeImg">');

    img = $('#badgeImg');
    img.hide()
        .on('load',function () {
            imgSrc = img.attr('src');
            const packageId = packageIdInput.val();
            const storeUrl = 'https://play.google.com/store/apps/details?id=' + packageId;

            img.fadeIn(1000);
            code.fadeIn(1000);
            html.val('<a href="' + storeUrl + '"><img src="' + imgSrc + '"</a>');
            bbcode.val('[url=' + storeUrl + '][img]' + imgSrc + '[/img][/url]');
            mdown.val('[![Badge](' + imgSrc + ')](' + storeUrl + ')');

            ga('send', 'event', 'badge', 'loaded', packageId);
            ga('send', 'timing', 'badge', 'loaded', new Date().getTime() - startTime, packageId);

            $('meta[property="og:image"]').attr('content', imgSrc);

            resetUi();
        }).on('error', function () {
            const packageId = packageIdInput.val();
            imgSrc = null;
            ga('send', 'event', 'badge', 'error', packageId);
            ga('send', 'timing', 'badge', 'error', new Date().getTime() - startTime, packageId);
            showError('Aw, Snap! Check the package name and try again');
        });

    const carousel = $('#badgeCarousel');

    topApps.forEach(function (app, index) {
        if (index === 0) {
            return;
        }
        carousel.append('<div> <img data-lazy="' +
            badgePath + '?id=' + app.id +
            '" class="badgeCarouselItem"> </div>')
    });

    carousel.slick({
        infinite: true,
        lazyLoad: 'ondemand',
        fade: true,
        autoplay: true,
        arrows: false,
        draggable: false,
        swipe: false,
        touchMove: false,
        accessibility: false,
        onAfterChange: function (slide, index) {
            $('link[rel="shortcut icon"]').attr('href', topApps[index].image);
        },
        autoplaySpeed: 7000,
    });

    bindButton('html');
    bindButton('bbcode');
    bindButton('mdown');

    $('.modal').on('shown.bs.modal', function () {
        ga('send', 'event', 'modal', 'shown', this.id);
    }).on('hidden.bs.modal', function () {
        ga('send', 'event', 'modal', 'hidden', this.id);
    });

});

const resetUi = function () {
    packageIdInput.attr('disabled', false);
    buildButton.stop();
};

const showError = function (error) {
    resetUi();
    showMessage(error, true);
};

const showMessage = function (message, isError) {
    ga('send', 'event', 'message', 'show', message, isError ? 1 : 0);
    $.bootstrapGrowl(message, {
        ele: '#growlAnchor',
        type: isError ? 'danger' : 'success',
        align: 'center',
        width: 'auto',
        delay: 4000,
        allow_dismiss: false,
        stackup_spacing: 10,
    });
};

const afterCopy = function () {
    showMessage('Code copied to clipboard, paste, paste, paste!', false);
};

const copyError = function() {
    ga('send', 'event', 'code', 'copy', 'error');
    code.find('.input-group').removeClass();
    code.find('.input-group-btn').remove();
};

const bindButton = function (buttonId) {
    (new Clipboard('#copy-' + buttonId))
        .on('beforecopy', function () {
            ga('send', 'event', 'code', 'copy', buttonId);
        })
        .on('success', afterCopy)
        .on('error', copyError);
};

const fetchBadge = function (packageId) {
    packageIdInput.attr('disabled', true);
    buildButton.start();
    code.fadeOut(250);
    img.fadeOut(250, function () {
        img.attr('src', badgePath + '?id=' + packageId);
    });
};