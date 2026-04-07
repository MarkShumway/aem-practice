package com.myaem.core.services;

import com.myaem.core.config.WeatherConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = WeatherService.class, immediate = true)
@Designate(ocd = WeatherConfig.class)
public class WeatherServiceImpl implements WeatherService {

    private String apiKey;

    @Activate
    @Modified
    protected void activate(WeatherConfig config) {
        this.apiKey = config.apiKey();
    }

    @Override
    public String getApiKey() {
        return apiKey;
    }
}
