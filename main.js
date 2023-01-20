const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const angle = (2 * Math.PI) / 6;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  rotate(degree) {
    var angleInGradient = degree * (Math.PI / 180);
    var cos = Math.cos(angleInGradient);
    var sin = Math.sin(angleInGradient);

    var xDerivative = this.x * cos - this.y * sin;
    var yDerivative = this.x * sin + this.y * cos;
    this.x = xDerivative;
    this.y = yDerivative;
  }

  translate(x, y) {
    this.x += x;
    this.y += y;
  }
}

class Hexagon {
  constructor(x, y, radius, color) {
    this.distanceFromMouse = -1;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.generatePath();
  }

  generatePath() {
    this.points = new Array(5);
    for (var i = 0; i < 6; i++) {
      let point = new Point(
        this.x + this.radius * Math.cos(angle * i),
        this.y + this.radius * Math.sin(angle * i)
      );
      this.points[i] = point;
    }
  }

  _getPathFor(radius) {
    let points = new Array(5);
    for (var i = 0; i < 6; i++) {
      let point = new Point(
        this.x + radius * Math.cos(angle * i),
        this.y + radius * Math.sin(angle * i)
      );
      points[i] = point;
    }
    return points;
  }

  contain(x, y) {
    let topLeftCorner = new Point(this.x - this.radius, this.y - this.radius);
    let bottomRightCorner = new Point(
      this.x + this.radius,
      this.y + this.radius
    );

    if (
      x < topLeftCorner.x ||
      x > bottomRightCorner.x ||
      y < topLeftCorner.y ||
      y > bottomRightCorner.y
    ) {
      return false;
    }

    let innerRadius = (this.radius * Math.sqrt(3)) / 2;
    if (
      this.distance(new Point(this.x, this.y), new Point(x, y)) <= innerRadius
    ) {
      return true;
    }
    var ray = {
      start: new Point(x, y),
      end: new Point(x + 2 * this.radius + 5, y),
    };
    var edges = [
      {
        start: this.points[0],
        end: this.points[1],
      },
      {
        start: this.points[1],
        end: this.points[2],
      },
      {
        start: this.points[2],
        end: this.points[3],
      },
      {
        start: this.points[3],
        end: this.points[4],
      },
      {
        start: this.points[4],
        end: this.points[5],
      },
      {
        start: this.points[5],
        end: this.points[0],
      },
    ];
    var nbOfIntersections = 0;
    edges.forEach((edge) => {
      if (this.intersects(edge.start, edge.end, ray.start, ray.end)) {
        nbOfIntersections++;
      }
    });
    return nbOfIntersections % 2 == 1;
  }

  intersects(firstLineStart, firstLineEnd, secondLineStart, secondLineEnd) {
    var a = firstLineStart.x,
      b = firstLineStart.y,
      c = firstLineEnd.x,
      d = firstLineEnd.y,
      p = secondLineStart.x,
      q = secondLineStart.y,
      r = secondLineEnd.x,
      s = secondLineEnd.y;
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  rotate(degree) {
    for (var i = 0; i < 6; i++) {
      var rotatedPoint = this.points[i];
      rotatedPoint.translate(-this.x, -this.y);
      rotatedPoint.rotate(degree);
      rotatedPoint.translate(this.x, this.y);
    }
  }

  midpoint(p1, p2) {
    return [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
  }

  distance(p1, p2) {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;

    return Math.sqrt(a * a + b * b);
  }

  setMousePosition(x, y) {
    var distance = this.distance(new Point(x, y), new Point(this.x, this.y));
    this.distanceFromMouse = Math.abs(distance);
  }

  getEdge(edgeNumber) {
    switch (edgeNumber) {
      case 1:
        return {
          start: this.points[0],
          end: this.points[1],
        };
      case 2:
        return {
          start: this.points[1],
          end: this.points[2],
        };
      case 3:
        return {
          start: this.points[2],
          end: this.points[3],
        };
      case 4:
        return {
          start: this.points[3],
          end: this.points[4],
        };
      case 5:
        return {
          start: this.points[4],
          end: this.points[5],
        };
      case 6:
        return {
          start: this.points[5],
          end: this.points[0],
        };
    }
  }

  translateNextToEdgeOf(edgeNumber, hexagon) {
    var otherMidpoint;
    var oppositeEdgeMidpoint;
    switch (edgeNumber) {
      case 1:
        otherMidpoint = this.midpoint(hexagon.points[0], hexagon.points[1]);
        oppositeEdgeMidpoint = this.midpoint(this.points[3], this.points[4]);
        break;
      case 2:
        otherMidpoint = this.midpoint(hexagon.points[1], hexagon.points[2]);
        oppositeEdgeMidpoint = this.midpoint(this.points[4], this.points[5]);
        break;
      case 3:
        otherMidpoint = this.midpoint(hexagon.points[2], hexagon.points[3]);
        oppositeEdgeMidpoint = this.midpoint(this.points[5], this.points[0]);
        break;
      case 4:
        otherMidpoint = this.midpoint(hexagon.points[3], hexagon.points[4]);
        oppositeEdgeMidpoint = this.midpoint(this.points[0], this.points[1]);
        break;
      case 5:
        otherMidpoint = this.midpoint(hexagon.points[4], hexagon.points[5]);
        oppositeEdgeMidpoint = this.midpoint(this.points[1], this.points[2]);
        break;
      case 6:
        otherMidpoint = this.midpoint(hexagon.points[5], hexagon.points[0]);
        oppositeEdgeMidpoint = this.midpoint(this.points[2], this.points[3]);
        break;
    }

    const distanceX = oppositeEdgeMidpoint[0] - this.x;
    const distanceY = oppositeEdgeMidpoint[1] - this.y;
    //Translate distance from other hexagon midpoint
    this.x = otherMidpoint[0] - distanceX;
    this.y = otherMidpoint[1] - distanceY;
    this.generatePath();
  }

  translateNextToCornerOf(cornerNumber, hexagon) {
    var oppositeCorner = cornerNumber + 3;
    if (oppositeCorner >= 6) {
      oppositeCorner -= 6;
    }

    const distanceX = this.points[oppositeCorner].x - this.x;
    const distanceY = this.points[oppositeCorner].y - this.y;
    //Translate distance from other hexagon midpoint
    this.x = hexagon.points[cornerNumber].x - distanceX;
    this.y = hexagon.points[cornerNumber].y - distanceY;
    this.generatePath();
  }

  draw(ctx) {
    ctx.beginPath();
    var maxRadius = this.radius;
    var minRadius = this.radius * 0.65;
    var maxDistance = 200;
    var minDistance = this.radius;
    var drawnRadius = this.radius;
    if (this.distanceFromMouse >= 0) {
      // Using linear interpolation forumula
      drawnRadius =
        minRadius +
        ((this.distanceFromMouse - minDistance) * (maxRadius - minRadius)) /
          (maxDistance - minDistance);
      drawnRadius = Math.min(maxRadius, Math.max(minRadius, drawnRadius));
    }
    let path = this._getPathFor(drawnRadius);
    path.forEach((point) => {
      let drawnX = point.x;
      let drawnY = point.y;
      ctx.lineTo(drawnX, drawnY);
    });
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class HexagonShape {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.hexagons = [new Hexagon(x, y, radius, color)];
  }

  addToEdge(edgeNumber) {
    this.drawToEdge(
      edgeNumber,
      new Hexagon(this.x, this.y, this.radius, this.color)
    );
  }

  addToCorner(cornerNumber) {
    const hex = new Hexagon(this.x, this.y, this.radius, this.color);
    hex.translateNextToCornerOf(
      cornerNumber,
      this.hexagons[this.hexagons.length - 1]
    );
    this.hexagons.push(hex);
  }

  drawToEdge(edgeNumber, hex) {
    this.drawToEdgeOf(edgeNumber, this.hexagons.length - 1, hex);
  }

  drawToEdgeOf(edgeNumber, hexIndex, hex) {
    hex.translateNextToEdgeOf(edgeNumber, this.hexagons[hexIndex]);
    this.hexagons.push(hex);
  }

  getLeftOutline() {
    var outline = [];
    for (let index = 0; index < hexagons.length - 1; index++) {
      const hexagon1 = hexagons[index];
      const hexagon2 = hexagons[index + 1];
    }
    return outline;
  }
}

var hexagons = [];
var outline = [];

function init() {
  const hexagonShape = new HexagonShape(
    35,
    35 - 4.6891108675446525,
    35,
    "#FFD460"
  );
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(3);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(3);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(3);
  hexagonShape.addToEdge(2);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(1);
  hexagonShape.addToEdge(2);

  hexagonShape.hexagons.forEach((hexagon) => {
    hexagons.push(hexagon);
  });
  var secondaryColor = "#FFD460";
  const hexagonShapeSecondline = new HexagonShape(
    140.00000000000006,
    212.1762239271875,
    35,
    secondaryColor
  );
  hexagonShapeSecondline.addToEdge(2);
  hexagonShapeSecondline.addToEdge(3);
  hexagonShapeSecondline.addToEdge(2);
  hexagonShapeSecondline.addToEdge(2);
  hexagonShapeSecondline.addToEdge(1);
  hexagonShapeSecondline.addToEdge(2);
  hexagonShapeSecondline.addToEdge(1);
  hexagonShapeSecondline.addToEdge(2);
  hexagonShapeSecondline.addToEdge(1);

  hexagonShapeSecondline.hexagons.forEach((hexagon) => {
    hexagons.push(new Hexagon(hexagon.x, hexagon.y, 27, secondaryColor));
  });

  /*hexagons.push(
    new Hexagon(87.50000000000011, 303.10889132455355, 27, secondaryColor)
  );
  hexagons.push(
    new Hexagon(87.50000000000013, 363.7306695894643, 27, secondaryColor)
  );
  hexagons.push(
    new Hexagon(87.50000000000016, 424.35244785437504, 27, secondaryColor)
  );
  hexagons.push(
    new Hexagon(87.50000000000016, 424.35244785437504, 27, secondaryColor)
  );
  hexagons.push(
    new Hexagon(140.00000000000006, 212.1762239271875, 27, secondaryColor)
  );
  hexagons.push(
    new Hexagon(192.50000000000023, 606.2177826491073, 27, secondaryColor)
  );*/

  console.log(hexagonShape);

  var start = new Point(0, hexagonShape.hexagons[0].points[4].y);
  outline.push(start);
  outline.push(hexagonShape.hexagons[0].points[4]);
  outline.push(hexagonShape.hexagons[0].points[3]);
  outline.push(hexagonShape.hexagons[0].points[2]);
  outline.push(hexagonShape.hexagons[1].points[3]);
  outline.push(hexagonShape.hexagons[1].points[2]);
  outline.push(hexagonShape.hexagons[2].points[3]);
  outline.push(hexagonShape.hexagons[2].points[2]);
  outline.push(hexagonShape.hexagons[3].points[3]);
  outline.push(hexagonShape.hexagons[4].points[4]);
  outline.push(hexagonShape.hexagons[4].points[3]);
  outline.push(hexagonShape.hexagons[4].points[2]);
  outline.push(hexagonShape.hexagons[5].points[3]);
  outline.push(hexagonShape.hexagons[6].points[4]);
  outline.push(hexagonShape.hexagons[6].points[3]);
  outline.push(hexagonShape.hexagons[6].points[2]);
  outline.push(hexagonShape.hexagons[7].points[3]);
  outline.push(hexagonShape.hexagons[7].points[2]);
  outline.push(hexagonShape.hexagons[8].points[3]);
  outline.push(hexagonShape.hexagons[8].points[2]);
  outline.push(hexagonShape.hexagons[9].points[3]);
  outline.push(hexagonShape.hexagons[9].points[2]);
  outline.push(hexagonShape.hexagons[10].points[3]);
  outline.push(hexagonShape.hexagons[10].points[2]);
  outline.push(hexagonShape.hexagons[11].points[3]);
  outline.push(hexagonShape.hexagons[11].points[2]);
  outline.push(hexagonShape.hexagons[12].points[3]);
  outline.push(hexagonShape.hexagons[12].points[2]);
  outline.push(hexagonShape.hexagons[13].points[3]);
  outline.push(hexagonShape.hexagons[13].points[2]);
  outline.push(hexagonShape.hexagons[14].points[3]);
  outline.push(hexagonShape.hexagons[14].points[2]);
  outline.push(hexagonShape.hexagons[16].points[3]);
  outline.push(hexagonShape.hexagons[16].points[2]);
  outline.push(hexagonShape.hexagons[17].points[3]);
  outline.push(hexagonShape.hexagons[17].points[2]);
  outline.push(hexagonShape.hexagons[18].points[3]);
  outline.push(hexagonShape.hexagons[18].points[2]);
  outline.push(hexagonShape.hexagons[19].points[3]);
  outline.push(hexagonShape.hexagons[19].points[2]);
  outline.push(hexagonShape.hexagons[20].points[3]);
  outline.push(hexagonShape.hexagons[20].points[2]);

  var lastY = outline[outline.length - 1].y;
  outline.push(outline.push(new Point(0, lastY)));
  outline.push(start);

  refreshCanvas();
}

function refreshCanvas() {
  var img = document.getElementById("founder-img-1");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.drawImage(img, 0, 0);
  hexagons.forEach((hexagon) => {
    hexagon.draw(ctx);
  });
  ctx.beginPath();
  outline.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = "#FFD460";
  ctx.fill();
}

function drawReferencePoint(x, y) {
  ctx.fillStyle = "#FFA500";
  ctx.fillRect(x - 2, y - 2, 4, 4);
}

document.onmousemove = function (e) {
  // Get the current mouse position
  var _w = window.innerWidth / 2,
    _h = window.innerHeight / 2,
    x = e.clientX,
    y = e.clientY;
  var canvasBounding = document
    .getElementById("canvas")
    .getBoundingClientRect();

  hexagons.forEach((hexagon) => {
    hexagon.setMousePosition(x - canvasBounding.left, y);
  });
  document.querySelectorAll(".founder-parallax").forEach(function (move) {
    var moving_value = move.getAttribute("data-value");
    var x = (e.clientX * moving_value) / 250;
    var y = (e.clientY * moving_value) / 250;

    move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
  });
  refreshCanvas();
};

init();
