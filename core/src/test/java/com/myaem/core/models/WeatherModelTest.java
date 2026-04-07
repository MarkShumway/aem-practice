package com.myaem.core.models;

import com.myaem.core.services.WeatherService;
import com.myaem.core.testcontext.AppAemContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class WeatherModelTest {

    private final AemContext context = AppAemContext.newAemContext();

    @Mock
    private WeatherService weatherService;

    private WeatherModel weatherModel;

    @BeforeEach
    void setup() {
        // Register the mock service first
        context.registerService(WeatherService.class, weatherService);

        // Register models by scanning the package
        context.addModelsForPackage("com.myaem.core.models");

        Resource resource = context.create().resource(
                "/content/weather-test",
                "sling:resourceType", "weretail/components/weather"
        );

        context.currentResource(resource);
        weatherModel = context.request().adaptTo(WeatherModel.class);
    }

    @Test
    void testModelNotNull() {
        assertNotNull(weatherModel);
    }

    @Test
    void testGetApiKey() {
        when(weatherService.getApiKey()).thenReturn("test-api-key-12345");
        assertEquals("test-api-key-12345", weatherModel.getApiKey());
    }

    @Test
    void testGetApiKeyWhenServiceReturnsEmpty() {
        when(weatherService.getApiKey()).thenReturn("");
        assertEquals("", weatherModel.getApiKey());
    }

    @Test
    void testGetApiKeyWhenServiceIsNull() {
        WeatherModel model = new WeatherModel();
        assertEquals("", model.getApiKey());
    }
}
