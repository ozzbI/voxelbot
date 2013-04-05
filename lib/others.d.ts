module Utils {

    export class BasicControls {
        constructor(object: Object);
        movementSpeed: number;
        rotationSpeed: number;
    }  

    export interface DetectorType {  
        webgl: any;      
        addGetWebGLMessage(): any;
    }
    export var Detector: DetectorType;

    export class ImprovedNoise {
        constructor();
        noise(x: number, y: number): number;
    }

    export class Stats {
        constructor();
        domElement: any;
        update();
    }

} 
