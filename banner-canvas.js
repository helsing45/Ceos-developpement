const rightCanvas = document.getElementById("canvas-right");
const leftCanvas = document.getElementById("canvas-left");
const banner = document.querySelector('.header-section')
const rightCtx = rightCanvas.getContext("2d");
const leftCtx = leftCanvas.getContext("2d");
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
        return this;
    }

    addToEdges(edgesNumbers) {
        edgesNumbers.forEach(edgeNumber => {
            this.addToEdge(edgeNumber);
        });
        return this
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

class HexagonCanvas {
    constructor() {
        this.hexagons = [];
        this.outline = [];
    }

    addHexagons(x, y, radius, color, edgeNumbers, drawRadius = radius,) {
        const hexagonShape = new HexagonShape(x, y, radius, color)
        hexagonShape.addToEdges(edgeNumbers)
        hexagonShape.hexagons.forEach((hexagon) => this.hexagons.push(new Hexagon(hexagon.x, hexagon.y, drawRadius, hexagon.color)))
    }

    addOutline(hexagonNumber, pointNumber) {
        this.outline.push(this.hexagons[hexagonNumber].points[pointNumber])
        return this;
    }

    addOutlinePoint(x, y) {
        this.outline.push(new Point(x, y));
        return this;
    }

}

const rightHexagonCanvas = new HexagonCanvas()
const leftHexagonCanvas = new HexagonCanvas()

function initRightHexagonCanvas() {
    rightHexagonCanvas.addHexagons(x = 35,
        y = 35 - 4.6891108675446525,
        radius = 35,
        color = "#FFD460",
        edgeNumbers = [1, 2, 1, 1, 2, 3, 1, 1, 2, 3, 2, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1]);
    rightHexagonCanvas.addHexagons(x = 35.00000000000003,
        y = 90.93266739736605,
        radius = 35,
        color = "#FFD460",
        edgeNumbers = [2, 1, 1, 3, 2, 1, 1, 3],
        drawRadius = 27);
    rightHexagonCanvas.addHexagons(87.50000000000023, 606.2177826491073,
        radius = 35,
        color = "#FFD460",
        edgeNumbers = [1, 3, 3, 2],
        drawRadius = 27);

    rightHexagonCanvas.addOutline(0, 5)
        .addOutline(0, 0)
        .addOutline(1, 5)
        .addOutline(0, 0)
        .addOutline(1, 5)
        .addOutline(1, 0)
        .addOutline(1, 1)
        .addOutline(2, 0)
        .addOutline(3, 5)
        .addOutline(3, 0)
        .addOutline(4, 5)
        .addOutline(4, 0)
        .addOutline(4, 1)
        .addOutline(5, 0)
        .addOutline(5, 1)
        .addOutline(7, 0)
        .addOutline(8, 5)
        .addOutline(8, 0)
        .addOutline(8, 1)
        .addOutline(9, 0)
        .addOutline(9, 1)
        .addOutline(10, 0)
        .addOutline(10, 1)
        .addOutline(11, 0)
        .addOutline(11, 1)
        .addOutline(12, 0)
        .addOutline(12, 1)
        .addOutline(13, 0)
        .addOutline(14, 5)
        .addOutline(14, 0)
        .addOutline(14, 1)
        .addOutline(15, 0)
        .addOutline(15, 1)
        .addOutline(16, 0)
        .addOutline(16, 1)
        .addOutline(17, 0)
        .addOutline(17, 1)
        .addOutline(18, 0)
        .addOutline(19, 5)
        .addOutline(19, 0)
        .addOutline(19, 1)
        .addOutline(20, 0)
        .addOutline(20, 1)
        .addOutline(21, 0)
        .addOutline(21, 1)
        .addOutline(22, 0)
        .addOutline(22, 1)
        .addOutline(23, 0)
        .addOutline(24, 5)
        .addOutline(24, 0)
        .addOutline(24, 1)
    var lastY = rightHexagonCanvas.outline[rightHexagonCanvas.outline.length - 1].y;
    rightHexagonCanvas.addOutlinePoint(300, lastY)
        .addOutlinePoint(300, 0)

    refreshRightCanvas()
}

function initLeftHexagonCanvas() {
    leftHexagonCanvas.addHexagons(35, 35, 35, "#FFD460", [1, 1, 2, 3, 1, 2, 1, 2, 2, 1, 3, 3, 2, 3, 2, 1, 1, 2, 1, 2, 3, 3, 2, 1])
    leftHexagonCanvas.addHexagons(x = 192.50000000000006,
        y = 247.1762239271875,
        radius = 35,
        color = "#FFD460",
        edgeNumbers = [5, 5, 5, 1, 2],
        drawRadius = 27);

    leftHexagonCanvas.addOutlinePoint(0, 0);
    leftHexagonCanvas.addOutline(0, 4)
        .addOutline(0, 3)
        .addOutline(0, 2)
        .addOutline(1, 3)
        .addOutline(1, 2)
        .addOutline(2, 3)
        .addOutline(2, 2)
        .addOutline(3, 3)
        .addOutline(4, 4)
        .addOutline(4, 3)
        .addOutline(4, 2)
        .addOutline(5, 3)
        .addOutline(5, 2)
        .addOutline(6, 3)
        .addOutline(6, 2)
        .addOutline(7, 3)
        .addOutline(7, 2)
        .addOutline(8, 3)
        .addOutline(8, 2)
        .addOutline(9, 3)
        .addOutline(9, 2)
        .addOutline(11, 4)
        .addOutline(11, 3)
        .addOutline(12, 4)
        .addOutline(12, 3)
        .addOutline(12, 2)
        .addOutline(13, 3)
        .addOutline(14, 4)
        .addOutline(14, 3)
        .addOutline(14, 2)
        .addOutline(15, 3)
        .addOutline(15, 2)
        .addOutline(16, 3)
        .addOutline(16, 2)
        .addOutline(17, 3)
        .addOutline(17, 2)
        .addOutline(18, 3)
        .addOutline(18, 2)
        .addOutline(19, 3)
        .addOutline(19, 2)
        .addOutline(20, 3)
        .addOutline(21, 4)
        .addOutline(21, 3)
        .addOutline(22, 4)
        .addOutline(22, 3)
        .addOutline(22, 2)
        .addOutline(23, 3)
        .addOutline(23, 2)
        .addOutline(24, 3)
        .addOutline(24, 2)

    var lastY = leftHexagonCanvas.outline[leftHexagonCanvas.outline.length - 1].y;
    leftHexagonCanvas.addOutlinePoint(0, lastY)
    refreshLeftCanvas()

}

function refreshRightCanvas() {
    console.log("Refresh  right canvas");
    rightCanvas.height = banner.offsetHeight;
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
    rightHexagonCanvas.hexagons.forEach((hexagon) => {
        hexagon.draw(rightCtx);
    });
    rightCtx.beginPath();
    rightHexagonCanvas.outline.forEach((point) => {
        rightCtx.lineTo(point.x, point.y);
    });
    rightCtx.closePath();
    rightCtx.fillStyle = "#FFD460";
    rightCtx.fill();
}

function refreshLeftCanvas() {
    console.log("Refresh canvas");
    leftCanvas.height = banner.offsetHeight;
    leftCtx.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
    leftHexagonCanvas.hexagons.forEach((hexagon) => {
        hexagon.draw(leftCtx);
    });
    leftCtx.beginPath();
    leftHexagonCanvas.outline.forEach((point) => {
        leftCtx.lineTo(point.x, point.y);
    });
    leftCtx.closePath();
    leftCtx.fillStyle = "#FFD460";
    leftCtx.fill();
}

document.onmousemove = function (e) {
    // Get the current mouse position
    var x = e.clientX,
        y = e.clientY;
    var canvasBounding = document
        .getElementById("canvas-right")
        .getBoundingClientRect();

    rightHexagonCanvas.hexagons.forEach((hexagon) => {
        hexagon.setMousePosition(x - canvasBounding.left, y);
    });

    var leftCanvasBounding = document
        .getElementById("canvas-left")
        .getBoundingClientRect();

    rightHexagonCanvas.hexagons.forEach((hexagon) => {
        hexagon.setMousePosition(x - canvasBounding.left, y);
    });
    leftHexagonCanvas.hexagons.forEach((hexagon) => {
        hexagon.setMousePosition(x - leftCanvasBounding.left, y);
    })

    refreshRightCanvas();
    refreshLeftCanvas();
};

initRightHexagonCanvas();
initLeftHexagonCanvas();