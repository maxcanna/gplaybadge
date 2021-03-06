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

$(() => {
    code = $('#badgeCode');
    packageIdInput = $('#packageIdInput');
    html = $('#html');
    bbcode = $('#bbcode');
    mdown = $('#mdown');

    $('#buildButton').click(event => {
        const packageId = packageIdInput.val();

        event.preventDefault();
        buildButton = Ladda.create(document.querySelector('#buildButton'));
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
        .on('load', () => {
            imgSrc = img.attr('src');
            const packageId = packageIdInput.val();
            const storeUrl = `https://play.google.com/store/apps/details?id=${packageId}`;

            img.fadeIn(1000);
            code.fadeIn(1000);
            html.val(`<a href="${storeUrl}"><img src="${imgSrc}"></a>`);
            bbcode.val(`[url=${storeUrl}][img]${imgSrc}[/img][/url]`);
            mdown.val(`[![Badge](${imgSrc})](${storeUrl})`);

            ga('send', 'event', 'badge', 'loaded', packageId);
            ga('send', 'timing', 'badge', 'loaded', new Date().getTime() - startTime, packageId);

            $('meta[property="og:image"]').attr('content', imgSrc);

            resetUi();
        }).on('error', () => {
            const packageId = packageIdInput.val();
            imgSrc = null;
            ga('send', 'event', 'badge', 'error', packageId);
            ga('send', 'timing', 'badge', 'error', new Date().getTime() - startTime, packageId);
            showError('Aw, Snap! Check the package name and try again');
        });

    const carousel = $('#badgeCarousel');

    topApps.forEach((app, index) => {
        if (index === 0) {
            return;
        }
        carousel.append(`<div> <img data-lazy="${badgePath}?id=${app.id}" class="badgeCarouselItem"> </div>`)
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
        onAfterChange: (slide, index) => $('link[rel="shortcut icon"]').attr('href', topApps[index].image),
        autoplaySpeed: 7000,
    });

    bindButton('html');
    bindButton('bbcode');
    bindButton('mdown');

    $('.modal')
        .on('shown.bs.modal', () => ga('send', 'event', 'modal', 'shown'))
        .on('hidden.bs.modal', () => ga('send', 'event', 'modal', 'hidden'));
});

const resetUi = () => {
    packageIdInput.attr('disabled', false);
    buildButton.stop();
};

const showError = error => {
    resetUi();
    showMessage(error, true);
};

const showMessage = (message, isError) => {
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

const afterCopy = () => {
    showMessage('Code copied to clipboard, paste, paste, paste!', false);
};

const copyError = () => {
    ga('send', 'event', 'code', 'copy', 'error');
    code.find('.input-group').removeClass();
    code.find('.input-group-btn').remove();
};

const bindButton = buttonId => {
    (new Clipboard(`#copy-${buttonId}`))
        .on('beforecopy', () => {
            ga('send', 'event', 'code', 'copy', buttonId);
        })
        .on('success', afterCopy)
        .on('error', copyError);
};

const fetchBadge = packageId => {
    packageIdInput.attr('disabled', true);
    buildButton.start();
    code.fadeOut(250);
    img.fadeOut(250, () => img.attr('src', `${badgePath}?id=${packageId}`));
};
