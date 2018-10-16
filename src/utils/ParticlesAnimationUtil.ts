import {AnimatedCircle} from "./geometry/AnimatiedCircle";

export class ParticlesAnimationUtil {

    public static generateRandomAnimatedCircle(maxXPosition:number, maxYPosition:number, maxSpeed:number= 1.5, radius:number = 4):AnimatedCircle {
        let x = Math.random() * maxXPosition;
        let y = Math.random() * maxYPosition;
        let dx = (Math.random() - 0.5) * maxSpeed;
        let dy = (Math.random() - 0.5) * maxSpeed;
        return new AnimatedCircle(x, y, radius, dx, dy)
    }

    public static generateRandomAnimatedCircles(quantity:number, maxXPosition:number, maxYPosition:number, maxSpeed:number= 1.5, radius:number = 4):AnimatedCircle[] {
        const circles:AnimatedCircle[] = [];
        for (let i = 0; i < quantity; i++) {
            circles.push(ParticlesAnimationUtil.generateRandomAnimatedCircle(maxXPosition, maxYPosition, maxSpeed, radius));
        }
        return circles;
    }
}