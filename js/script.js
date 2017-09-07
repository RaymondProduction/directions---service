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

        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
        document.getElementById('way').addEventListener('change', onChangeHandler);
        directionsDisplay.addListener('directions_changed', function(directionsService) {
          console.log('dragg: ',showLatLng(directionsDisplay.getDirections()));
        });
      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
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
         console.log(directionsResult);
        if (directionsResult.request.origin.query===undefined)
          console.log('start',directionsResult.request.origin.lat(),' ',directionsResult.request.origin.lng());
        if (directionsResult.request.destination.query===undefined)
          console.log('end',directionsResult.request.destination.lat(),' ',directionsResult.request.destination.lng());
        directionsResult.request.waypoints.forEach((point) => {
        if (point.location.query===undefined)
             console.log('waypoint: ',point.location.lat(),' ',point.location.lat());
        })
        console.log('Geo coordinates:');
        directionsResult.routes[0].overview_path.forEach((point) => {
              console.log('latitude',point.lat(),' longitude',point.lng());
        });
      }
