// Populate dropdowns
const startSelect = document.getElementById("start");
const endSelect = document.getElementById("end");

buildings.forEach(b => {
  const option1 = document.createElement("option");
  option1.value = b.node;
  option1.textContent = b.name;
  startSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = b.node;
  option2.textContent = b.name;
  endSelect.appendChild(option2);
});

// Draw marker
function drawMarker(nodeId, type) {
  const map = document.getElementById("map");
  const node = nodes[nodeId];
  const marker = document.createElement("div");
  marker.className = `marker ${type}`;
  marker.style.left = `${node.x}px`;
  marker.style.top = `${node.y}px`;
  map.appendChild(marker);
}

// Draw route
function drawRoute(route) {
  const map = document.getElementById("map");
  route.forEach((step, i) => {
    if (i < route.length - 1) {
      const pos1 = nodes[step];
      const pos2 = nodes[route[i + 1]];
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      const line = document.createElement("div");
      line.className = "route-line";
      line.style.width = `${length}px`;
      line.style.left = `${pos1.x}px`;
      line.style.top = `${pos1.y}px`;
      line.style.transform = `rotate(${angle}deg)`;
      map.appendChild(line);
    }
  });
}

// Clear previous routes
function clearMap() {
  document.querySelectorAll(".marker, .route-line").forEach(el => el.remove());
}

// BFS to find route
function findRoute() {
  clearMap();
  const start = startSelect.value;
  const end = endSelect.value;
  if (!start || !end) return;

  let queue = [[start]];
  let visited = new Set([start]);
  while (queue.length > 0) {
    let path = queue.shift();
    let node = path[path.length - 1];
    if (node === end) {
      drawRoute(path);
      drawMarker(start, "start");
      drawMarker(end, "end");
      return;
    }
    for (let [a, b] of paths) {
      if (a === node && !visited.has(b)) {
        visited.add(b);
        queue.push([...path, b]);
      }
      if (b === node && !visited.has(a)) {
        visited.add(a);
        queue.push([...path, a]);
      }
    }
  }
}
