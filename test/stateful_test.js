var Backbone = {}; // So Stateful.View is defined;

var scenario = require("gerbil").scenario;
var Stateful = require("../src/stateful");

function TrafficLight(initial) {
    this.pedestrians = false; // Traffic camera is turned off.
    this.state = new Stateful(this, "stop");
}
TrafficLight.prototype.constructor = TrafficLight;
TrafficLight.States = {
    stop: {
        color: "red",
        next: function() {
            this.state.transition("go");
        }
    },

    go: {
        color: "green",
        next: function() {
            this.state.transition("caution");
        },
        turnOnPedSign: function() {
            this.pedestrians = true;
        },
        turnOffPedSign: function() {
            this.pedestrians = false;
        },
        onEnterState: function() {
            this.turnOnPedSign();
        },
        onExitState: function() {
            this.turnOffPedSign();
        }
    },

    caution: {
        color: "yellow",
        next: function() {
            this.state.transition("stop");
        }
    }
}

scenario("Stateful", {
    "sets the initial state of the object": function(g) {
        var light = new TrafficLight();

        g.assert(light.state.is("stop"));
    },

    "changes the state of the object": function(g) {
        var light = new TrafficLight();

        light.next();
        g.assert(light.state.is("go"));
    },

    "changes the API when transitioning state": function(g) {
        var light = new TrafficLight();

        g.assertEqual("undefined", typeof(light.turnOnPedSign));
        light.next();
        g.assertEqual("function", typeof(light.turnOnPedSign));
        light.next();
        g.assertEqual("undefined", typeof(light.turnOnPedSign));
    },

    "executes onEnterState and onExitState callbacks": function(g) {
        var light = new TrafficLight();
        g.assert(!light.pedestrians);
        light.next();
        g.assert(light.pedestrians);
        light.next();
        g.assert(!light.pedestrians);
    },

    "fires events if the object supports a .trigger method": function(g) {
        var events = [];
        var light = new TrafficLight();
        light.trigger = function(event) { events.push(event) }

        light.next();
        g.assertEqual(["state:exit", "state:exited", "state:enter", "state:entered", "state:change"], events);
    },

    "does not leak callbacks into the object's API": function(g) {
        var light = new TrafficLight();
        light.next();
        g.assertEqual("undefined", typeof(light.onEnterState));
        g.assertEqual("undefined", typeof(light.onExitState));
    }
});
