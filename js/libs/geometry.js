export const EPS = 0.00000001;
export const PI = Math.PI;
export const INF = 99888000;
const segHeight=10;

export function DBcmp(a, b) {
    if(a - b > EPS) return 1;
    if(b - a > EPS) return -1;
    return 0;
}

export class Point {
    constructor(tx, ty) {
        this.x = tx;
        this.y = ty;
    }

    getPos() {
        return this;
    }

    setPos(P) {
        this.x = P.x;
        this.y = P.y;
    }
}

export class Circle {
    constructor(tO, tR) {
        this.O = tO;
        this.R = tR;
    }

    getPos() {
        return this.O;
    }

    setPos(P) {
        this.O = P;
    }

    getWidth()  {
        return 2*this.R;
    }

    getHeight() {
        return 2*this.R;
    }
}

export class Segment {
    constructor(tP1, tP2) {
        this.P1 = tP1;
        this.P2 = tP2;
        // console.log('Segment constructor: P1', this.P1);
        // console.log('Segment constructor: P2', this.P2);
    }

    getPos() {
        return div(add(this.P1, this.P2), 2);
    }

    setPos(P) {
        _sub(P, this.getPos());
        _add(this.P1, P);
        _add(this.P2, P);
    }

    getWidth()
    {
        return Math.abs(this.P2.x-this.P1.x);
    }

    getHeight()
    {
      return segHeight;
    }

}

export class Colli {
    constructor(tCo) {
        this.P = tCo.P;
        this.N = tCo.N;
        this.d = tCo.d;
    }
}

export function add(V1, V2) {
    return new Point(V1.x + V2.x, V1.y + V2.y);
}

export function _add(V1, V2) {
    V1.x += V2.x;
    V1.y += V2.y;
}

export function sub(V1, V2) {
    return new Point(V1.x - V2.x, V1.y - V2.y);
}

export function _sub(V1, V2) {
    V1.x -= V2.x;
    V1.y -= V2.y;
}

export function mul(V, k) {
    return new Point(V.x * k, V.y * k);
}

export function _mul(V, k){
    V.x *= k;
    V.y *= k;
}

export function _div(V, k) {
    V.x /= k;
    V.y /= k;
}

export function div(V, k) {
    return new Point(V.x / k, V.y / k);
}

export function rotate(V, theta) {
    let cosT = Math.cos(theta);
    let sinT = Math.sin(theta);
    return new Point(V.x * cosT - V.y * sinT,
        V.x * sinT + V.y * cosT);
}

export function _rotate(V, theta) {
    let cosT = Math.cos(theta);
    let sinT = Math.sin(theta);
    let x = V.x;
    let y = V.y;

    V.x = x * cosT - y * sinT;
    V.y = x * sinT + y * cosT;
}

export function dot(V1, V2) {
    return V1.x * V2.x + V1.y * V2.y;
}

export function cross(V1, V2) {
    return V1.x * V2.y - V2.x * V1.y;
}

export function _reverse(V){
    V.x = -V.x;
    V.y = -V.y;
}

export function mod_2(V) {
    return V.x * V.x + V.y * V.y;
}

export function mod(V) {
    return Math.sqrt(mod_2(V));
}

export function _normalize(V) {
    let len = mod(V);
    if(DBcmp(len, 0) === 0) return ;
    V.x = V.x / len;
    V.y = V.y / len;
}

export function normalize(V) {
    let len = mod(V);
    if(DBcmp(len, 0) === 0) return new Point(0,0);
    return new Point(V.x / len, V.y / len);
}

export function _relen(V, k) {
    let len = mod(V);
    if(DBcmp(len, 0) === 0) return ;
    V.x = V.x / len * k;
    V.y = V.y / len * k;
}

export function dist_2(P1, P2) {
    let dx = P1.x - P2.x;
    let dy = P1.y - P2.y;
    return dx * dx + dy * dy;
}

export function relen(V, k) {
    let len = mod(V);
    if(DBcmp(len, 0) === 0) return new Point(0,0);
    return new Point(V.x / len * k, V.y / len * k);
}

export function isZero(P) {
    return !!(DBcmp(P.x, 0) === 0, DBcmp(P.y, 0) === 0);
}

export function _toZero(V) {
    V.x = V.y = 0;
}

export function calH(L, O) {
    let V1 = sub(L.P1, L.P2);
    _normalize(V1);
    let V2 = sub(O, L.P1);
    let dPP = dot(V1, V2);
    _mul(V1, dPP);
    return add(L.P1, V1);
}

export function pointOnSegment(P, S) {
    let V1 = sub(S.P1, P);
    let V2 = sub(S.P2, P);
    return DBcmp(dot(V1, V2), 0) < 0;
}



export function pointInCircle(P, O) {
    return DBcmp(dist_2(P, O.O), O.R * O.R) <= 0;
}

export function CircleOnCircle(C1, C2, ) {
    return DBcmp(dist_2(C1.O, C2.O), (C1.R + C2.R) * (C1.R + C2.R)) < 0;
}
