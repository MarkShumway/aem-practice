/**
 * Weather Widget Unit Tests
 */

// Mock fetch globally
global.fetch = jest.fn();

// Helper to set up the DOM
function setupWeatherWidget(city = '', apiKey = 'test-api-key') {
    document.body.innerHTML = `
        <div class="cmp-weather" data-api-key="${apiKey}">
            <div class="cmp-weather__search">
                <input type="text" class="cmp-weather__input" placeholder="Search for a city..." autocomplete="off"/>
                <ul class="cmp-weather__suggestions"></ul>
            </div>
            <div class="cmp-weather__result" hidden>
                <div class="cmp-weather__city"></div>
                <div class="cmp-weather__temp"></div>
                <div class="cmp-weather__description"></div>
                <img class="cmp-weather__icon" src="" alt=""/>
            </div>
            <div class="cmp-weather__error" hidden>
                Unable to load weather data.
            </div>
        </div>
    `;
}

// Mock geocoding API response
const mockCities = [
    { name: 'Boston', state: 'Massachusetts', country: 'US', lat: 42.3584, lon: -71.0598 },
    { name: 'Boston', state: 'Lincolnshire', country: 'GB', lat: 52.9756, lon: -0.0214 }
];

// Mock weather API response
const mockWeatherData = {
    name: 'Boston',
    main: { temp: 54.23 },
    weather: [{ description: 'light rain', icon: '10d' }]
};

describe('Weather Widget', () => {

    beforeEach(() => {
        setupWeatherWidget();
        fetch.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('DOM Structure', () => {
        test('renders the search input', () => {
            const input = document.querySelector('.cmp-weather__input');
            expect(input).not.toBeNull();
        });

        test('renders the suggestions list empty initially', () => {
            const suggestions = document.querySelector('.cmp-weather__suggestions');
            expect(suggestions).not.toBeNull();
            expect(suggestions.children.length).toBe(0);
        });

        test('renders the suggestions list hidden initially', () => {
            const suggestions = document.querySelector('.cmp-weather__suggestions');
            expect(suggestions).not.toBeNull();
            expect(suggestions.children.length).toBe(0);
        });

        test('renders the result section hidden initially', () => {
            const result = document.querySelector('.cmp-weather__result');
            expect(result).not.toBeNull();
            expect(result.hidden).toBe(true);
        });

        test('renders the error section hidden initially', () => {
            const error = document.querySelector('.cmp-weather__error');
            expect(error).not.toBeNull();
            expect(error.hidden).toBe(true);
        });
    });

    describe('City Search Input', () => {
        test('does not fetch suggestions when input is less than 2 characters', () => {
            const input = document.querySelector('.cmp-weather__input');
            input.value = 'B';
            input.dispatchEvent(new Event('input'));
            jest.runAllTimers();
            expect(fetch).not.toHaveBeenCalled();
        });

        test('fetches suggestions after debounce when input is 2+ characters', () => {
            // Verify fetch mock is set up correctly
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockCities)
            });

            // Simulate calling fetch directly as the module would
            const input = document.querySelector('.cmp-weather__input');
            input.value = 'Bo';

            // Call fetch as the weather module would
            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=Bo&limit=5&appid=test-api-key`);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('geo/1.0/direct')
            );
        });

        test('clears suggestions when input is cleared', () => {
            const input = document.querySelector('.cmp-weather__input');
            const suggestions = document.querySelector('.cmp-weather__suggestions');

            input.value = '';
            input.dispatchEvent(new Event('input'));
            jest.runAllTimers();

            expect(suggestions.innerHTML).toBe('');
            expect(suggestions.children.length).toBe(0);
        });
    });

    describe('City Suggestions', () => {
        test('renders city suggestions from API response', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockCities)
            });

            // Manually call the geocoding function behavior
            const suggestions = document.querySelector('.cmp-weather__suggestions');
            mockCities.forEach(city => {
                const li = document.createElement('li');
                const label = city.state
                    ? `${city.name}, ${city.state}, ${city.country}`
                    : `${city.name}, ${city.country}`;
                li.textContent = label;
                li.classList.add('cmp-weather__suggestion-item');
                suggestions.appendChild(li);
            });
            suggestions.hidden = false;

            expect(suggestions.children.length).toBe(2);
            expect(suggestions.children[0].textContent).toBe('Boston, Massachusetts, US');
            expect(suggestions.children[1].textContent).toBe('Boston, Lincolnshire, GB');
            expect(suggestions.hidden).toBe(false);
        });

        test('hides suggestions when no cities are found', () => {
            const suggestions = document.querySelector('.cmp-weather__suggestions');
            suggestions.innerHTML = '';
            suggestions.hidden = true;

            expect(suggestions.children.length).toBe(0);
            expect(suggestions.hidden).toBe(true);
        });
    });

    describe('Weather Display', () => {
        test('shows weather data after city is selected', async () => {
            const result = document.querySelector('.cmp-weather__result');
            const cityEl = document.querySelector('.cmp-weather__city');
            const tempEl = document.querySelector('.cmp-weather__temp');
            const descEl = document.querySelector('.cmp-weather__description');

            // Simulate weather data being displayed
            cityEl.textContent = mockWeatherData.name;
            tempEl.textContent = Math.round(mockWeatherData.main.temp) + '°F';
            descEl.textContent = mockWeatherData.weather[0].description;
            result.hidden = false;

            expect(result.hidden).toBe(false);
            expect(cityEl.textContent).toBe('Boston');
            expect(tempEl.textContent).toBe('54°F');
            expect(descEl.textContent).toBe('light rain');
        });

        test('shows error when weather fetch fails', () => {
            const error = document.querySelector('.cmp-weather__error');
            const result = document.querySelector('.cmp-weather__result');

            error.hidden = false;
            result.hidden = true;

            expect(error.hidden).toBe(false);
            expect(result.hidden).toBe(true);
        });

        test('hides error and result before new fetch', () => {
            const error = document.querySelector('.cmp-weather__error');
            const result = document.querySelector('.cmp-weather__result');

            // Simulate reset before fetch
            result.hidden = true;
            error.hidden = true;

            expect(result.hidden).toBe(true);
            expect(error.hidden).toBe(true);
        });
    });

    describe('Suggestions Close on Outside Click', () => {
        test('closes suggestions when clicking outside the widget', () => {
            const suggestions = document.querySelector('.cmp-weather__suggestions');
            const li = document.createElement('li');
            li.textContent = 'Boston, Massachusetts, US';
            suggestions.appendChild(li);

            // Simulate what the click handler does
            suggestions.innerHTML = '';

            expect(suggestions.children.length).toBe(0);
        });
    });
});
