package com.github.confluence.macro.keynote;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.plugin.webresource.WebResourceUrlProvider;
import com.atlassian.spring.container.ContainerManager;
import com.atlassian.webresource.api.assembler.PageBuilderService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.Map;

import static com.atlassian.plugin.webresource.UrlMode.AUTO;

@Scanned
public class Keynote implements Macro {
    private static final String PLUGIN_KEY = "com.github.confluence.macro.keynote.keynote-macro";
    static final String RESOURCE_KEY_MACRO = PLUGIN_KEY + ":keynote-macro-resources";
    private static final String RESOURCE_KEY_IFRAME = PLUGIN_KEY + ":keynote-iframe-resources";

    private final WebResourceUrlProvider webResourceUrlProvider;
    private PageBuilderService pageBuilderService;

    @Autowired
    public Keynote(@ComponentImport PageBuilderService pageBuilderService) {
        this.pageBuilderService = pageBuilderService;
        this.webResourceUrlProvider = ((WebResourceUrlProvider) ContainerManager.getComponent("webResourceUrlProvider"));
    }

    public String execute(Map<String, String> parameters, String bodyContent, ConversionContext context) {
        pageBuilderService.assembler().resources().requireWebResource(RESOURCE_KEY_MACRO);
        final String iframeUrl = webResourceUrlProvider.getStaticPluginResourceUrl(RESOURCE_KEY_IFRAME, "iframe/keynote-iframe.html", AUTO);
        final StringBuilder out = new StringBuilder("<div class=\"keynote\"");
        out.append(" data-iframe=\"").append(iframeUrl).append("\"");
        for (String propertyName : Arrays.asList("transition", "theme")) {
            final String value = parameters.getOrDefault(propertyName, "").trim().toLowerCase();
            if (!value.isEmpty()) {
                out.append(" data-").append(propertyName).append("=\"").append(value).append("\"");
            }
        }
        out.append(">").append(bodyContent).append("</div>");
        return out.toString();
    }

    public BodyType getBodyType() {
        return BodyType.RICH_TEXT;
    }

    public OutputType getOutputType() {
        return OutputType.BLOCK;
    }
}