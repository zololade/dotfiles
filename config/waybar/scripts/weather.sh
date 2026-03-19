#!/usr/bin/env bash

# OpenWeatherMap API configuration
API_KEY="4a6319aaf439c4357ea425d4ec5271a2"
CITY="Lansing"
STATE="Michigan"
COUNTRY="US"
UNITS="imperial"

# Cache file location
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/waybar"
CACHE_FILE="$CACHE_DIR/weather_cache.json"

# Create cache directory if it doesn't exist
mkdir -p "$CACHE_DIR"

# Get weather data from OpenWeatherMap API with timeout
WEATHER_DATA=$(curl -s --max-time 10 --connect-timeout 5 "https://api.openweathermap.org/data/2.5/weather?q=${CITY},${STATE},${COUNTRY}&units=${UNITS}&appid=${API_KEY}")

# Check if curl was successful and data is valid JSON
if [ -z "$WEATHER_DATA" ] || ! echo "$WEATHER_DATA" | jq empty 2>/dev/null; then
    # Try to use cached data if available
    if [ -f "$CACHE_FILE" ]; then
        cat "$CACHE_FILE"
        exit 0
    fi
    echo '{"text": "N/A", "tooltip": "Unable to fetch weather data (no cache available)"}'
    exit 0
fi

# Check for API errors
ERROR_CODE=$(echo "$WEATHER_DATA" | jq -r '.cod // empty')
if [ "$ERROR_CODE" != "200" ] && [ -n "$ERROR_CODE" ]; then
    ERROR_MSG=$(echo "$WEATHER_DATA" | jq -r '.message // "Unknown error"')
    # Try to use cached data on API errors
    if [ -f "$CACHE_FILE" ]; then
        cat "$CACHE_FILE"
        exit 0
    fi
    echo "{\"text\": \"⚠ Error\", \"tooltip\": \"API Error: ${ERROR_MSG}\"}"
    exit 0
fi

# Parse JSON data
TEMP=$(echo "$WEATHER_DATA" | jq -r '.main.temp' | awk '{printf "%.0f", $1}')
FEELS_LIKE=$(echo "$WEATHER_DATA" | jq -r '.main.feels_like' | awk '{printf "%.0f", $1}')
DESCRIPTION=$(echo "$WEATHER_DATA" | jq -r '.weather[0].description' | sed 's/\b\(.\)/\u\1/g')
WEATHER_ID=$(echo "$WEATHER_DATA" | jq -r '.weather[0].id')
HUMIDITY=$(echo "$WEATHER_DATA" | jq -r '.main.humidity')
WIND_SPEED=$(echo "$WEATHER_DATA" | jq -r '.wind.speed' | awk '{printf "%.1f", $1}')
CITY_NAME=$(echo "$WEATHER_DATA" | jq -r '.name')

# Map weather condition ID to Nerd Font icon
# OpenWeatherMap weather condition codes: https://openweathermap.org/weather-conditions
get_weather_icon() {
    local id=$1

    # Thunderstorm (200-232)
    if [ $id -ge 200 ] && [ $id -lt 300 ]; then
        echo -e "\uf0e7"
    # Drizzle (300-321)
    elif [ $id -ge 300 ] && [ $id -lt 400 ]; then
        echo -e "\uf04e"
    # Rain (500-531)
    elif [ $id -ge 500 ] && [ $id -lt 600 ]; then
        echo -e "\uf019"
    # Snow (600-622)
    elif [ $id -ge 600 ] && [ $id -lt 700 ]; then
        echo -e "\uf2dc"
    # Atmosphere (fog, mist, etc) (701-781)
    elif [ $id -ge 701 ] && [ $id -lt 800 ]; then
        echo -e "\uf0b1"
    # Clear (800)
    elif [ $id -eq 800 ]; then
        echo -e "\uf185"
    # Clouds (801-804)
    elif [ $id -ge 801 ] && [ $id -lt 900 ]; then
        echo -e "\uf0c2"
    else
        echo -e "\uf059"
    fi
}

ICON=$(get_weather_icon $WEATHER_ID)

# Create tooltip with detailed information
TOOLTIP="<b>${CITY_NAME}</b>\n"
TOOLTIP+="Condition: ${DESCRIPTION}\n"
TOOLTIP+="Temperature: ${TEMP}°F (Feels like ${FEELS_LIKE}°F)\n"
TOOLTIP+="Humidity: ${HUMIDITY}%\n"
TOOLTIP+="Wind Speed: ${WIND_SPEED} mph"

# Create output JSON
OUTPUT="{\"text\": \"${ICON} ${TEMP}°F\", \"tooltip\": \"${TOOLTIP}\"}"

# Save to cache for future use
echo "$OUTPUT" > "$CACHE_FILE"

# Output in Waybar JSON format
echo "$OUTPUT"
