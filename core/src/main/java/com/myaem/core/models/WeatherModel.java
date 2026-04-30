package com.myaem.core.models;

import com.myaem.core.services.WeatherService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for the Weather component, providing configuration values
 * such as API key, widget title, and temperature unit to the component's HTL template.
 */
@Model(
        adaptables = SlingHttpServletRequest.class,
        resourceType = "weretail/components/weather",
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class WeatherModel {

    @OSGiService
    private WeatherService weatherService;

    @ValueMapValue
    private String widgetTitle;

    @ValueMapValue
    private String temperatureUnit;

    /** Returns the OpenWeatherMap API key from the WeatherService OSGi configuration. */
    public String getApiKey() {
        return weatherService != null ? weatherService.getApiKey() : "";
    }

    /** Returns the authored widget title, defaulting to "Weather" if not set. */
    public String getWidgetTitle() {
        return widgetTitle != null && !widgetTitle.isEmpty() ? widgetTitle : "Weather";
    }

    /** Returns the temperature unit ("imperial" or "metric"), defaulting to "imperial" if not set. */
    public String getTemperatureUnit() {
        return temperatureUnit != null && !temperatureUnit.isEmpty() ? temperatureUnit : "imperial";
    }

    /** Returns the temperature symbol ("°C" for metric, "°F" for imperial) based on the configured unit. */
    public String getTemperatureSymbol() {
        return "metric".equals(temperatureUnit) ? "°C" : "°F";
    }
}
