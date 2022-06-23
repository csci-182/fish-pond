export class Target {
    constructor(x, y, value, nextSpot) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.nextSpot = nextSpot;
    }
    getDistance(x, y) {
        const xdif = this.x - x;
        const ydif = this.y - y;
        return Math.sqrt(xdif * xdif + ydif * ydif);
    }
    eaten(fish) {
        if (this.value === 0 && this == fish.target)
            fish.target = this.nextSpot;
        else if (this.value > 0) {
            fish.target = null;
            fish.feed(this.value);
            this.value = -1;
        }
    }  
}

export class Food extends Target {
    constructor(x, y, value, nextSpot) {
        super(x, y, value, nextSpot);
        this.palette = [
            'rgb(212, 168, 72)',
            'rgb(123, 101, 57)',
            'rgb(212, 112, 46)',
            'rgb(169, 155, 60)'
        ];
        this.color = this.getColor(this.palette);
    }   

    getColor(palette) {
        const idx = Math.floor(Math.random() * palette.length);
        return palette[idx];
    }

    render(ctx) {
        if (this.value > 0) {
            ctx.fillStyle = this.color;

            ctx.beginPath();
            ctx.arc(this.x, this.y,
                3,
                0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }
    }
}
