package com.myaem.core.services;

import com.myaem.core.config.WeatherConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WeatherServiceImplTest {

    @Mock
    private WeatherConfig weatherConfig;

    private WeatherServiceImpl weatherService;

    @BeforeEach
    void setup() {
        weatherService = new WeatherServiceImpl();
    }

    @Test
    void testGetApiKey() {
        when(weatherConfig.apiKey()).thenReturn("test-api-key-12345");
        weatherService.activate(weatherConfig);
        assertEquals("test-api-key-12345", weatherService.getApiKey());
    }

    @Test
    void testGetApiKeyEmpty() {
        when(weatherConfig.apiKey()).thenReturn("");
        weatherService.activate(weatherConfig);
        assertEquals("", weatherService.getApiKey());
    }

    @Test
    void testServiceNotNull() {
        when(weatherConfig.apiKey()).thenReturn("any-key");
        weatherService.activate(weatherConfig);
        assertNotNull(weatherService.getApiKey());
    }
}
