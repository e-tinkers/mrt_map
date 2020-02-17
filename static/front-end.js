'use strict';
(function() {

  // helper function to reset the color of each station
  function reset(e) {
    for (let i = 0; i < stations.length; i++) {
      document.getElementById(stations[i]).setAttribute('fill', "#FFFFFF");
    }
    stations = [];
    if (shortestPath != []) {
      for (let i = 0; i < shortestPath.length; i++) {
        let station = document.getElementById(shortestPath[i].toLowerCase());
        let radius = parseFloat(station.getAttribute('r')) - 2;
        station.setAttribute('r', radius);
        station.setAttribute('fill', "#FFFFFF");
      }
      shortestPath = [];
    }
    e.preventDefault();
  }

  // helper function to mark each stations on the shortest path with bigger Cyan circle
  function markShortestPath(path) {
    for (let i = 0; i < path.length; i++) {
      let station = document.getElementById(path[i]);
      let radius = parseFloat(station.getAttribute('r')) + 2;
      station.setAttribute('r', radius);
      station.setAttribute('fill', "#00FFFF");
    }
  }

  // ajax get request function (works for IE10+)
  function getRequest(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send()
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        shortestPath = JSON.parse(this.response)['route']
        markShortestPath(shortestPath)
      }
    }
  }

  // Calculate shortest path - JavaScript version
  function calShortestPath(graph, start, end, path=[]) {
    path = path.concat(start);
    if (start == end) {
      return path;
    }
    if (!graph.hasOwnProperty(start)) {
      return [];
    }
    let shortest = [];
    for (let node of graph[start]) {
      if (path.indexOf(node) == -1) {
        let newPath = calShortestPath(graph, node, end, path);
        if (newPath.length > 0) {
          if ( shortest.length == 0 | (newPath.length < shortest.length) ) {
            shortest = newPath;
          }
        }
      }
    };
    return shortest;
  }

  // Dismiss Instruction modal after 3 seconds
  let modal = document.getElementById('modal');
  window.setTimeout(function() {
    modal.style.display="none";
  }, 3000);

  // Set event listener so user can click on stations to choose start and destination
  let shortestPath = [];
  let stations = [];
  let links = document.getElementById("stns_icons");
  links.addEventListener('click', function(event) {
    if (stations.length == 0) {
      event.target.setAttribute('fill', "#FF0000");
      stations.push(event.target.id);
    }
    else if (stations.length == 1) {
      event.target.setAttribute('fill', "#00FF00");
      stations.push(event.target.id);

      // For server side of calculating shortest path
      let url = "/api/v1/?start=" + stations[0] + "&end=" + stations[1];
      getRequest(url);

      // For client side of calculating shortest path
      //shortestPath = calShortestPath(stationSG, stations[0], stations[1]);
      //markShortestPath(shortestPath);

    }
    event.preventDefault();
  });

  // Doubleclick to reset the station selection
  document.addEventListener('dblclick', reset);
  let tapped = false;
  document.addEventListener('touchstart', function(e) {
    if(!tapped){
      tapped=setTimeout(function(){ tapped=false; },300);
    }
    else {    //tapped within 300ms of last tap. double tap
      clearTimeout(tapped);
      tapped=false;
      reset(e);
    }
  });

}())
