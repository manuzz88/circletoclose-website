import requests
import os

def download_image(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
    else:
        print(f"Failed to download {filename}")

# Crea le directory se non esistono
os.makedirs('public/images/events', exist_ok=True)
os.makedirs('public/images/locations', exist_ok=True)

# URLs per gli eventi
event_urls = [
    ('https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 'event1.jpg'),  # Luxury dinner
    ('https://images.unsplash.com/photo-1519214605650-76a613ee3245', 'event2.jpg'),  # Rooftop party
    ('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7', 'event3.jpg'),  # Pool party
]

# URLs per le location
location_urls = [
    ('https://images.unsplash.com/photo-1577593980495-6e7f67824477', 'location1.jpg'),  # Villa
    ('https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2', 'location2.jpg'),  # Palace
    ('https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'location3.jpg'),  # Lake villa
]

# Download immagini eventi
for url, filename in event_urls:
    download_image(url, f'public/images/events/{filename}')

# Download immagini location
for url, filename in location_urls:
    download_image(url, f'public/images/locations/{filename}')
