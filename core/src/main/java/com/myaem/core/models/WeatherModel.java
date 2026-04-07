package com.myaem.core.models;

import com.myaem.core.services.WeatherService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

@Model(
        adaptables = SlingHttpServletRequest.class,
        resourceType = "weretail/components/weather",
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class WeatherModel {

    @OSGiService
    private WeatherService weatherService;

    public String getApiKey() {
        return weatherService != null ? weatherService.getApiKey() : "";
    }
}
