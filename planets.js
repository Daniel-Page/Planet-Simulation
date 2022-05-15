// Change body style
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

// Processing on canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
canvas.width = dimension[0];
canvas.height = dimension[1];

const PLANET_OUTLINE = "#000000";
const SUN_COLOUR = "#FFFF00"
const EARTH_COLOUR = "#00FF00";
const MARS_COLOUR = "#BC2732";
const MERCURY_COLOUR = "#E5E5E5";
const VENUS_COLOUR = "#FFC649";

const AU = 149.6e6 * 1000; // One astronomical unit in m
const G = 6.67428e-11; // Gravitational constant

const SCALE = 250 / AU; // 1 AU = 100 pixels?
const TIMESTEP =  7000; // 1 day in seconds
const UPDATES_PER_SEC = 100;

class Planet {
    constructor(x, y, radius, colour, mass) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.mass = mass;

        this.orbit = new Array();
        this.sun = false;
        this.distance_to_sun = 0;

        this.x_vel = 0;
        this.y_vel = 0;
    }

    draw() {
        let x = this.x * SCALE + window.innerWidth / 2;
        let y = this.y * SCALE + window.innerHeight / 2;

        
        console.log(this.orbit);
        
       

        //context.moveTo(this.orbit[3][0], this.orbit[3][1]);
       
        // for (var i = 0; i < this.orbit.length; i++) {

        //     test.lineTo(this.orbit[i][0]*SCALE + window.innerWidth / 2, this.orbit[i][1]*SCALE + window.innerHeight / 2);

        // }
        context.beginPath();
        context.moveTo(this.orbit[0][0]*SCALE + window.innerWidth / 2, this.orbit[0][1]*SCALE + window.innerHeight / 2);
        
        
        for (var i = 5; i < this.orbit.length; i++) {

            context.lineTo(this.orbit[i][0]*SCALE + window.innerWidth / 2, this.orbit[i][1]*SCALE + window.innerHeight / 2);

        }
        
        context.stroke();
        context.lineWidth = 2;


        
      
        
        context.beginPath();

        
        context.fillStyle = this.colour;
        context.strokeStyle = PLANET_OUTLINE;
        context.lineWidth = 2;
        context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
    }

    attraction(other) {
        let other_x = other.x;
        let other_y = other.y;
        
        let distance_x = other_x - this.x
        let distance_y = other_y - this.y;

        let distance = Math.sqrt(distance_x**2 + distance_y**2);


        if (other.sun) {
            this.distance_to_sun = distance;
        }

        let force = G * this.mass * other.mass / distance**2;
        let theta = Math.atan2(distance_y, distance_x);
        let force_x = Math.cos(theta) * force;
        let force_y = Math.sin(theta) * force;
        
        return [force_x, force_y];
    }

    update_position(planets) {
        let total_fx = 0;
        let total_fy = 0;
        
        planets.forEach((planet) => {
            if (this != planet) {
                var [fx, fy] = this.attraction(planet);
                total_fx += fx;
                total_fy += fy;
            }
        });        
        
        this.x_vel += total_fx / this.mass * TIMESTEP;
		this.y_vel += total_fy / this.mass * TIMESTEP;

		this.x += this.x_vel * TIMESTEP;
		this.y += this.y_vel *  TIMESTEP;
		this.orbit.push([this.x, this.y]);
    }
}


let Sun = new Planet(0, 0, 30, SUN_COLOUR, 1.98892 * 10**30);
Sun.sun = true;

let Mercury = new Planet(0.387 * AU, 0, 8, MERCURY_COLOUR, 3.30 * 10**23);
Mercury.y_vel = -47.4 * 1000

let Venus = new Planet(0.723 * AU, 0, 14, VENUS_COLOUR, 4.8685 * 10**24);
Venus.y_vel = -35.02 * 1000

let Earth = new Planet(-1 * AU, 0, 16, EARTH_COLOUR, 5.9742 * 10**24);
Earth.y_vel = 29.783 * 1000 

let Mars = new Planet(-1.524 * AU, 0, 12, MARS_COLOUR, 6.39 * 10**23);
Mars.y_vel = 24.077 * 1000

let planets = [Sun, Mercury, Venus, Earth, Mars];

let id = null;
clearInterval(id);
id = setInterval(frame, 1000/UPDATES_PER_SEC); // Milliseconds

function frame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    planets.forEach((planet) => {
        planet.update_position(planets); // Calculates the forces between the current planet and all the others
        planet.draw();
    });
    
}