(function(exports) {
    // Helper method to check if an object is a function.
    //
    function isFunction(object) {
        return typeof object == "function";
    }

    // Helper method to trigger events on an object (if it supports the .trigger
    // method).
    //
    function trigger(object) {
        if (isFunction(object.trigger)) {
            var args = Array.prototype.slice.call(arguments, 1);
            object.trigger.apply(object, args);
        }
    }

    // Public: Constructor for the State object.
    //
    // object       - The object that requires state handling.
    // initialState - The initial state. Optional, defaults to "default".
    // interfaces   - An object with the API extensions provided by each state.
    //                This is optional, and defaults to
    //                object.constructor.States.
    //
    function Stateful(object, initialState, interfaces) {
        this.object = object;
        this.interfaces = interfaces ||
            object.constructor && object.constructor.States;
        this.transition(initialState || "default");
    }

    Stateful.prototype.constructor = Stateful;

    // Public: Switch to a new state.
    //
    // state - The name of the new state.
    //
    // Returns nothing.
    //
    Stateful.prototype.transition = function(state) {
        this.current && this._exitState();
        this._enterState(state);
        trigger(this.object, "state:change");
    }

    // Public: Check if the current state is the one passed.
    //
    // state - The name of a state.
    //
    // Returns true|false.
    //
    Stateful.prototype.is = function(state) {
        return this.current === state;
    }

    // Clean the object of the current state.
    //
    // Returns nothing.
    //
    Stateful.prototype._exitState = function() {
        var api = this.interfaces[this.current];

        if (!api) {
            return;
        }

        trigger(this.object, "state:exit", this.current);

        isFunction(api.onExitState) && api.onExitState.call(this.object);

        for (property in api) {
            delete this.object[property];
        }

        trigger(this.object, "state:exited", this.current);
    }

    // Apply the new state's API to the object.
    //
    // Returns nothing.
    //
    Stateful.prototype._enterState = function(state) {
        var api = this.interfaces[state];

        if (!api) {
            throw "Invalid state: " + state;
        }

        trigger(this.object, "state:enter", state);

        for (property in api) {
            // No need to copy onEnterState or onExitState since they are only
            // supposed to be callbacks.
            //
            if (property == "onEnterState" || property == "onExitState") {
                continue;
            }
            this.object[property] = api[property];
        }

        isFunction(api.onEnterState) && api.onEnterState.call(this.object);

        this.current = state;

        trigger(this.object, "state:entered", state);
    }

    if (module) {
        module.exports = Stateful;
    }
    exports.Stateful = Stateful;

    return Stateful;
})(this);
