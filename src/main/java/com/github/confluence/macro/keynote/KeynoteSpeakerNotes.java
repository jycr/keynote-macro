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
public class KeynoteSpeakerNotes implements Macro {
    private PageBuilderService pageBuilderService;

    @Autowired
    public KeynoteSpeakerNotes(@ComponentImport PageBuilderService pageBuilderService) {
        this.pageBuilderService = pageBuilderService;
    }

    public String execute(Map<String, String> parameters, String bodyContent, ConversionContext context) {
        pageBuilderService.assembler().resources().requireWebResource(RESOURCE_KEY_MACRO);
        return "<div class=\"keynote-speakerNotes\">" + bodyContent + "</div>";
    }

    public BodyType getBodyType() {
        return BodyType.RICH_TEXT;
    }

    public OutputType getOutputType() {
        return OutputType.BLOCK;
    }
}