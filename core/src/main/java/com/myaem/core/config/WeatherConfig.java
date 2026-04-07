package com.myaem.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
        name = "Weather Widget Configuration",
        description = "Configuration for the Weather Widget component"
)
public @interface WeatherConfig {

    @AttributeDefinition(
            name = "API Key",
            description = "OpenWeatherMap API Key",
            type = AttributeType.PASSWORD
    )
    String apiKey() default "";
}
