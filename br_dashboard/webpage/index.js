const map = L.map("mapid").setView([-15, -47], 4);

L.tileLayer("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png", {
  attribution:
    "Wikimedia maps beta | &copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

const url = "https://gist.githubusercontent.com/jvfe/12d770fd982f7435d1706da328917c92/raw/7a19db983cd4795946eaec510dc114face97734d/brasil-geo.json"

fetch(url)
    .then(res => L.geoJson(res.json()).addTo(map));