#!/bin/bash

# Crea le directory se non esistono
mkdir -p public/images/events
mkdir -p public/images/locations

# Download immagini per gli eventi
curl "https://source.unsplash.com/1200x800/?luxury,dinner" -o public/images/events/event1.jpg
curl "https://source.unsplash.com/1200x800/?rooftop,party" -o public/images/events/event2.jpg
curl "https://source.unsplash.com/1200x800/?pool,villa" -o public/images/events/event3.jpg

# Download immagini per le location
curl "https://source.unsplash.com/1200x800/?luxury,villa" -o public/images/locations/location1.jpg
curl "https://source.unsplash.com/1200x800/?palace,luxury" -o public/images/locations/location2.jpg
curl "https://source.unsplash.com/1200x800/?lake,villa" -o public/images/locations/location3.jpg
