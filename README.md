Stateful.js
===========

Stateful is an implementation of the [State pattern][1] in JavaScript. Read the
linked article to understand why you would apply this instead of using any FSM
implementation out there.

Example
-------

This is a trivial example, but illustrates how you would use Stateful:

``` javascript
function TrafficLight() {
    this.state = new Stateful(this, "stop", TrafficLight.States);
}
TrafficLight.States = {};

TrafficLight.States.stop = {
    color: "red",
    next: function() {
        this.state.transition("go");
    },
    monitorInfractions: function() {
        // Turn on the camera and make sure nobody breaks the rules.
    }
}

TrafficLight.States.go = {
    color: "green",
    next: function() {
        this.state.transition("caution");
    }
}

TrafficLight.States.caution = {
    color: "yellow",
    next: function() {
        this.state.transition("stop");
    }
}

var light = new TrafficLight();
light.color //=> "red"
typeof light.monitorInfractions //=> "function"
light.next()
light.color //=> "green"
typeof light.monitorInfractions //=> "undefined"
light.next()
light.color //=> "yellow"
typeof light.monitorInfractions //=> "undefined"
light.next()
light.color //=> "red"
```

Credits
-------

Inspired by the ruby gem [`state_pattern`][2] by [Daniel Cadenas][3]. Built with
the support of [Cubox][4] by [Nicolás Sanguinetti][5].

Released under an MIT license. Check the attached LICENSE file for details.

[1]: http://sourcemaking.com/design_patterns/state
[2]: http://rubygems.org/gems/state_pattern
[3]: http://github.com/dcadenas
[4]: http://cuboxlabs.com
[5]: http://github.com/foca
