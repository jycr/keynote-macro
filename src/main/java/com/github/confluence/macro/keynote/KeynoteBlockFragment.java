package com.github.confluence.macro.keynote;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.webresource.api.assembler.PageBuilderService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

import static com.github.confluence.macro.keynote.Keynote.RESOURCE_KEY_MACRO;

@Scanned
public class KeynoteBlockFragment implements Macro {
    private PageBuilderService pageBuilderService;

    protected String getTagName() {
        return "div";
    }

    protected String filterContent(String bodyContent) {
        return bodyContent;
    }

    @Autowired
    public KeynoteBlockFragment(@ComponentImport PageBuilderService pageBuilderService) {
        this.pageBuilderService = pageBuilderService;
    }

    public String execute(Map<String, String> parameters, String bodyContent, ConversionContext context) {
        pageBuilderService.assembler().resources().requireWebResource(RESOURCE_KEY_MACRO);
        final String transition = parameters.getOrDefault("transition", "").trim().toLowerCase();
        return "<" + getTagName() + " class=\"fragment " + transition + "\">" + filterContent(bodyContent) + "</" + getTagName() + ">";
    }

    public BodyType getBodyType() {
        return BodyType.RICH_TEXT;
    }

    public OutputType getOutputType() {
        return OutputType.BLOCK;
    }
}