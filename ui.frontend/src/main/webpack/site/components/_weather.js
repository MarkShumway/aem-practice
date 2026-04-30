(function() {
    'use strict';

    /** Finds all weather widget elements on the page and attaches input and click event listeners to each. */
    function initWeatherWidgets() {
        const widgets = document.querySelectorAll('.cmp-weather');

        widgets.forEach(function(widget) {
            const apiKey = widget.getAttribute('data-api-key');
            const unit   = widget.getAttribute('data-unit') || 'imperial';
            const symbol = widget.getAttribute('data-symbol') || '°F';
            if (!apiKey) return;

            const input = widget.querySelector('.cmp-weather__input');
            const suggestions = widget.querySelector('.cmp-weather__suggestions');
            const result = widget.querySelector('.cmp-weather__result');
            const error = widget.querySelector('.cmp-weather__error');

            let debounceTimer;

            input.addEventListener('input', function() {
                const query = input.value.trim();
                clearTimeout(debounceTimer);

                if (query.length < 2) {
                    suggestions.innerHTML = '';
                    suggestions.hidden = true;
                    return;
                }

                debounceTimer = setTimeout(function() {
                    fetchCitySuggestions(query, apiKey, suggestions, input, result, error, widget, unit, symbol);
                }, 300);
            });

            document.addEventListener('click', function(e) {
                if (!widget.contains(e.target)) {
                    suggestions.innerHTML = '';
                    suggestions.hidden = true;
                }
            });
        });
    }

    /** Fetches city name autocomplete suggestions from the OpenWeatherMap geocoding API and renders them as a dropdown list. */
    function fetchCitySuggestions(query, apiKey, suggestions, input, result, error, widget, unit, symbol) {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`)
            .then(function(response) {
                if (!response.ok) throw new Error('Geocoding fetch failed');
                return response.json();
            })
            .then(function(cities) {
                suggestions.innerHTML = '';

                if (cities.length === 0) {
                    suggestions.hidden = true;
                    return;
                }

                cities.forEach(function(city) {
                    const li = document.createElement('li');
                    const label = city.state
                        ? `${city.name}, ${city.state}, ${city.country}`
                        : `${city.name}, ${city.country}`;
                    li.textContent = label;
                    li.classList.add('cmp-weather__suggestion-item');

                    li.addEventListener('click', function() {
                        input.value = label;
                        suggestions.innerHTML = '';
                        suggestions.hidden = true;
                        fetchWeather(city.lat, city.lon, apiKey, unit, symbol, result, error, widget);
                    });

                    suggestions.appendChild(li);
                });

                suggestions.hidden = false;
            })
            .catch(function() {
                suggestions.innerHTML = '';
                suggestions.hidden = true;
            });
    }

    /** Fetches current weather data for the given coordinates and updates the widget's display elements. */
    function fetchWeather(lat, lon, apiKey, unit, symbol, result, error, widget) {
        result.hidden = true;
        error.hidden = true;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
            .then(function(response) {
                if (!response.ok) throw new Error('Weather fetch failed');
                return response.json();
            })
            .then(function(data) {
                widget.querySelector('.cmp-weather__city').textContent = data.name;
                widget.querySelector('.cmp-weather__temp').textContent = Math.round(data.main.temp) + symbol;
                widget.querySelector('.cmp-weather__description').textContent = data.weather[0].description;
                widget.querySelector('.cmp-weather__icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                widget.querySelector('.cmp-weather__icon').alt = data.weather[0].description;
                result.hidden = false;
            })
            .catch(function() {
                error.hidden = false;
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWeatherWidgets);
    } else {
        initWeatherWidgets();
    }
})();
