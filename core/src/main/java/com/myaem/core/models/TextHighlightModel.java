package com.myaem.core.models;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
        adaptables = SlingHttpServletRequest.class,
        resourceType = "myaem/components/text",
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TextHighlightModel {

    @ValueMapValue
    private String highlightColor;

    public String getHighlightColor() {
        return highlightColor != null ? highlightColor : "";
    }
}
