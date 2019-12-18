export default function initMap(longitude, latitude){
    function successCallback(pos){
        mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZGlzbGF2cmIiLCJhIjoiY2szdm94d2txMG9iejNtbzMxaHZkb2RrdSJ9.Js5G-q0mvoMuvaictqK-2A';
        const mapSettings = {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 10
        };
        const map = new mapboxgl.Map(mapSettings);
    }
    navigator.geolocation.getCurrentPosition(successCallback);
}