mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: localshop.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    });

new mapboxgl.Marker()
        .setLngLat(localshop.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25})
                .setHTML(
                    `<h3>${localshop.shopName}</h3><p>${localshop.location}`
                )
        )
        .addTo(map)