(function() {
    'use strict';

    function initWeatherWidgets() {
        const widgets = document.querySelectorAll('.cmp-weather');
        console.log(widgets);

        widgets.forEach(function(widget) {
            const city = widget.getAttribute('data-city');
            const apiKey = widget.getAttribute('data-api-key');

            if (!city || !apiKey) return;

            const loading = widget.querySelector('.cmp-weather__loading');
            const content = widget.querySelector('.cmp-weather__content');
            const error = widget.querySelector('.cmp-weather__error');

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`)
                .then(function(response) {
                    if (!response.ok) throw new Error('Weather fetch failed');
                    return response.json();
                })
                .then(function(data) {
                    widget.querySelector('.cmp-weather__city').textContent = data.name;
                    widget.querySelector('.cmp-weather__temp').textContent = Math.round(data.main.temp) + '°F';
                    widget.querySelector('.cmp-weather__description').textContent = data.weather[0].description;
                    widget.querySelector('.cmp-weather__icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                    widget.querySelector('.cmp-weather__icon').alt = data.weather[0].description;

                    loading.style.display = 'none';
                    content.style.display = 'block';
                })
                .catch(function() {
                    loading.style.display = 'none';
                    error.style.display = 'block';
                });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWeatherWidgets);
    } else {
        initWeatherWidgets();
    }
})();
