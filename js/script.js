      function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var chicago = new google.maps.LatLng(41.850033, -87.6500523);
        var directionsDisplay = new google.maps.DirectionsRenderer({
           draggable: true // можно перетягивать маршрут
        });

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
         // center: {lat: 50.35, lng: 30.95} <- Ukraine
          center: chicago
        });


        directionsDisplay.setMap(map);

        directionsService.route({
          origin: {lat: 41.850033, lng: -87.6500523} ,
          destination:  {lat: 39.974611666223815,  lng: -92.968640612},
          // waypoints: [
          //   {
          //     location: 'Joplin, MO',
          //     stopover: false
          //   },{
          //     location: 'Oklahoma City, OK',
          //     stopover: true
          //   }],
          waypoints: [
            {
              location:  {lat :39.68072,  lng: -90.39102000000001},
              stopover: true
            }],
          travelMode: 'DRIVING'}
        , function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            showLatLng(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };

        var onShowPolygon = function() {
          console.log('OK ',this.checked);
          if (this.checked){
            path=getCoordsDirections(directionsDisplay);
            polyline = new google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: '#AAAAFF',
              strokeOpacity: 0.9,
              draggable: true,
              editable: true,
              clickable:  true,
              strokeWeight: 4
            });
            polyline.addListener('polyline_changed',()=>console.log('YES'));
            console.log(path);
            polyline.setMap(map);
          } else {
            polyline.setMap(null);
          }
        };
    //   document.getElementById('start').addEventListener('change', onChangeHandler);
    //   document.getElementById('end').addEventListener('change', onChangeHandler);
    //   document.getElementById('way').addEventListener('change', onChangeHandler);
        document.getElementById('polyline').addEventListener('change', onShowPolygon);
        directionsDisplay.addListener('directions_changed', function(directionsService) {
          console.log('dragg: ',showLatLng(directionsDisplay.getDirections()));
          if (document.getElementById('polyline').checked){
           // polyline.setMap(null);
            polyline.setPath(getCoordsDirections(directionsDisplay));
           // polyline.setMap(map);
          }
        });
        // google.maps.event.addListener(polyline, 'click', function()
        // {
        //     console.log('YES')
        // });

      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          waypoints: [
           {
             location: document.getElementById('way').value,
             stopover: true
           }
          ],
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            showLatLng(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }


      function showLatLng(directionsResult){
        function getLat(point){
          return point.location ? getLat(point.location) : point.lat();
        };
        function getLng(point){
          return point.location ? getLng(point.location) : point.lng();
        };
         console.log(directionsResult);
        if (directionsResult.request.origin.query===undefined)
          console.log('start',getLat(directionsResult.request.origin),' ',getLng(directionsResult.request.origin));
        if (directionsResult.request.destination.query===undefined)
          console.log('end',getLat(directionsResult.request.destination),' ',getLng(directionsResult.request.destination));
        directionsResult.request.waypoints.forEach((point) => {
        if (point.location.query===undefined)
             console.log('waypoint: ',getLat(point),' ',getLng(point));
        })
        console.log('Geo coordinates:');
        directionsResult.routes[0].overview_path.forEach((point) => {
              console.log('latitude',getLat(point),' longitude',getLng(point));
        });
      }

      function getCoordsDirections(directionsDisplay){
        function getLat(point){
          return point.location ? getLat(point.location) : point.lat();
       };
        function getLng(point){
          return point.location ? getLng(point.location) : point.lng();
        };
        let path = [];
        let response =  directionsDisplay.getDirections();
        if (!response) return;
        console.log('Response directionsDisplay >>>>',response.request);
        path.push({lat : getLat(response.request.origin), lng : getLng(response.request.origin)});
        response.request.waypoints.forEach((point)=> path.push({lat : getLat(point), lng : getLng(point)})),
        path.push({lat : getLat(response.request.destination), lng : getLng(response.request.destination)});
        return path;
      }
