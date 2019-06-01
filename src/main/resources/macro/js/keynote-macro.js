//DATA
AJS.toInit(function () {
    window._$keynotePopup = null;

    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    (function ($) {
        if (window._keynoteWindowEventMessageAdded || !$) {
            return;
        }

        var $header = $('#main-header h1');
        var $content = $('#main-content');

        function cleanup() {
            if (window._$keynotePopup) {
                window._$keynotePopup.remove();
                window._$keynotePopup = null;
            }
        }

        function initKeynote(pageTitle, $mainContent, iframeUrl, theme) {
            if (!iframeUrl) {
                throw "IFrame URL not found";
            }
            var confluenceBaseUrl = ($('meta[name="confluence-base-url"]').attr('content') || '');
            var pageId = ($('meta[name="ajs-latest-page-id"]').attr('content') || $('meta[name="ajs-page-id"]').attr('content') || '');
            var contentUrl = confluenceBaseUrl + '/rest/api/content/' + pageId + '?expand=body.view';
            var url = iframeUrl + '?theme=' + (theme || 'beige') + '&contentUrl=' + encodeURIComponent(contentUrl);

            $('<a href="' + url + '" class="launch-keynote aui-button aui-style aui-button-primary" title="Launch keynote">&#x1F3A5;&#xFE0E;</a>')
                .on('click', function () {
                    cleanup();
                    window._$keynotePopup = $('<iframe src="' + this.href + '" class="keynote-target"></iframe>')
                        .appendTo('body')
                        .show()
                        .focus();
                    var iframe = window._$keynotePopup.get(0);
                    if (iframe.requestFullscreen) {
                        iframe.requestFullscreen();
                    }
                    return false;
                })
                .prependTo($header);
        }

        $(document).on('fullscreenchange', function (event) {
            if (!document.fullscreenElement) {
                cleanup();
            }
        });
        // select root keynote
        $('.keynote').first().each(function () {
            var $rootKeynote = $(this);
            var pageTitle = ($header.text() || '').replace((/[\n\s]+/g), ' ');
            initKeynote(pageTitle, $content, $rootKeynote.data('iframe'), $rootKeynote.data('theme'));
        });
        window._keynoteWindowEventMessageAdded = true;
    })(jQuery);
});