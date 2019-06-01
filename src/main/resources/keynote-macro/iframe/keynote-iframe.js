function deParams(str) {
    return (str || document.location.search)
        .replace(/(^\?)/, '')
        .split("&")
        .map(function (n) {
                return n = n.split("="), this[n[0]] = decodeURIComponent(n[1]), this
            }.bind({})
        )[0];
}

function updateCssTheme(theme) {
    if (theme && theme !== 'beige') {
        var link = (document.querySelector('#css-theme') || {href: ''});
        link.href = link.href.replace((/^(.*\/)beige(\..*)$/), '$1' + theme + '$2');
    }
}


function extractData(pageTitle, $mainContent) {
    var data = {
        s: [{
            c: pageTitle ? ('<h1>' + pageTitle + '</h1>') : null
        }]
    };

    function addSlides($container, innerData) {
        $container.find('>.keynote').each(function () {
            var $slide = $(this);
            var $html = $('<div>' + $slide.html().replace((/[\n\s]+/g), ' ') + '</div>');
            var speaker = ($slide.find('.keynote-speakerNotes').html() || '').replace((/[\n\s]+/g), ' ');
            $html.find('.keynote,.keynote-speakerNotes').remove();
            var content = $html.html();
            var slideData = {};
            if (content && content.length > 0) {
                slideData.c = content;
            }
            if (speaker && speaker.length > 0) {
                slideData.n = speaker;
            }
            addSlides($slide, slideData);
            if (!innerData.s) {
                innerData.s = [];
            }
            innerData.s.push(slideData);
        });
    }

    addSlides($mainContent, data);
    data.transition = $mainContent.data('transition');
    return data;
}

function addSlideInto(containerDom, slideData) {
    var hasInnerSlides = (slideData.s && slideData.s.length && slideData.s.length > 0);
    var speaker = slideData.n ? ('<aside class="notes">' + slideData.n + '</aside>') : '';
    var content = (slideData.c || '') + speaker;
    console.log("add slide", containerDom, slideData, hasInnerSlides, speaker, content);
    var sectionDom;

    if (slideData.c || slideData.n) {
        var html = hasInnerSlides ? ('<section>' + content + '</section>') : content;
        sectionDom = document.createElement('section');
        sectionDom.innerHTML = html || '';
        containerDom.appendChild(sectionDom);
    }
    else {
        sectionDom = containerDom;
    }


    if (hasInnerSlides) {
        slideData.s.forEach(function (innerSlideData) {
            addSlideInto(sectionDom, innerSlideData);
        });
    }
}

var slidesDom = document.querySelector('.slides');

function updateKeynote(data) {
    slidesDom.innerHTML = '';
    addSlideInto(slidesDom, data);

    var h1 = document.querySelector('h1');
    if (h1) {
        document.title = h1.innerText;
    }

    // More info about config & dependencies:
    // - https://github.com/hakimel/reveal.js#configuration
    // - https://github.com/hakimel/reveal.js#dependencies
    Reveal.initialize({
        // Display the page number of the current slide
        slideNumber: true,
        // Add the current slide number to the URL hash so that reloading the
        // page/copying the URL will return you to the same slide
        hash: true,
        // Push each slide change to the browser history. Implies `hash: true`
        history: false,

        // See https://github.com/hakimel/reveal.js/#navigation-mode
        navigationMode: data.navigationMode || 'default',

        // Transition style
        transition: data.transition || 'slide', // none/fade/slide/convex/concave/zoom

        dependencies: [
            {src: 'reveal.js/plugin/markdown/marked.js'},
            {src: 'reveal.js/plugin/markdown/markdown.js'},
            {src: 'reveal.js/plugin/notes/notes.js', async: true},
            {
                src: 'reveal.js/plugin/highlight/highlight.js',
                async: true
            }
        ]
    });
}

function updateContentFromHtml(title, html) {
    var data = extractData(title, $('<div>' + html + '</div>'));
    console.log("Receive data:", data);
    updateKeynote(data);
}

/**
 * @param contentUrl URL of content. For example: https://confluence-server/confluence-context/rest/api/content/1234567890?expand=body.view
 */
function fetchPageContent(contentUrl) {
    if (!contentUrl) {
        throw "Content URL not defined.";
    }
    console.log("Load data from:", contentUrl);
    $.getJSON(contentUrl)
        .done(function (data) {
            console.log("Data loaded:", data);
            if (data && data.body && data.body.view && data.body.view.value) {
                updateContentFromHtml(data.title, data.body.view.value);
            }
            else {
                throw "Body is null for content:" + contentUrl;
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            throw "Unable to load content: " + contentUrl + " (" + (jqXHR.statusText || errorThrown || textStatus) + ")";
        });
}


function main() {
    var params = deParams();
    console.log("Page params:", params);
    var theme = (params.theme || '').replace((/[^a-z]/), '');
    var contentUrl = (params.contentUrl || '').replace((/^[^\/:]+:\/\/[^\/]+/), '');
    updateCssTheme(theme);
    fetchPageContent(contentUrl);
}

function getMessage(messageOrEvent) {
    if (typeof messageOrEvent === "string") {
        return messageOrEvent;
    }
    return messageOrEvent.message;
}

window.onerror = function (messageOrEvent, source, noligne, nocolonne, error) {
    slidesDom.innerHTML = getMessage(error) || getMessage(messageOrEvent) || "Unable to render keynote";
    console.error("Unable to update slide content:", message, " on: ", source + "#line=" + noligne);
};
main();
