"use strict";

/**
 * @author Victorien ELVINGER
 * @project js.zino
 *
 @description Type inherited by all new Typees
 * @date 6-08-2012
 * @revision 15
 *
 * @dependencies Z_Type, require
 */

    var Any = Z_Type.a_new ();
    Any.defer ();

    Any.define ({
    // Access
        /**
         * agent (routine: Function): Function
         * Routine calling 'routine' on this
         *
         * @limitation new operator use on Result is not enabled.
         */
        agent: Z_Type.agent,

    // Service
        /**
         * type (instance: Object): undefinable Type
         * Constructor of 'insatnce'
         */
        type: function (instance) {
            return require (instance.generator);
        },

    // Duplication Service
        /**
         * twin_of (instance: Object): Object
         * Object sharing the same field references that 'instance'
         * @ensure  equal: equal (Result, instance)
         *          deep_equal: deep_equal (Result, instance)
         */
        twin_of: function (instance) {
            var type; //: undefinable Type
            var Result;

            type = this.type (instance);
            if (typeof type !== "undefined") {
                Result = type.a_new ();
                Result.copy (instance);
            }
            else if (typeof instance === "object") {
                this.twin_pattern (instance, this.agent (this.twin_of));
            }
            else {
                Result = instance;
            }

            return Result;
        },

        /**
         * deep_twin_of (instance: Object): Object
         * Clone fields.
         * @note cyclic reference not respected
         * @ensure deep_equal: deep_equal (Result, instance)
         */
        deep_twin_of: function (instance) {
            var Result;
            var type; //: undefinable Type

            type = this.type (instance);
            if (typeof type !== "undefined") {
                Result = type.a_new ();
                Result.deep_copy (instance);
            }
            else if (typeof instance === "object") {
                this.twin_pattern (instance, this.agent (this.deep_twin_of));
            }
            else {
                Result = instance;
            }

            return Result;
        },

        /**
         * twin_pattern (instance: object; request: Function)
         */
        twin_pattern: function (instance, request) {
            var Result;
            var field; //: nullable Object

            if (Array.isArray (instance)) {
                Result = [];

                for (var key = 0,
                     capacity = instance.length;
                     key < capacity;
                     key++) {

                    field = instance [key];
                    Result [key] = request (field);
                }
            }
            else {
                Result =  {};

                for (var name in instance) {
                    if (instance.hasOwnProperty (name)) {
                        field = instance [name];

                        if (field !== null) {
                            Result [name] = request (field);
                        }
                    }
                    else {
                        break;
                    }
                }
            }

            return Result;
        },

    // Comparison Service
        /**
         * equal (instance1, instance2: nullable Object): Boolean
         * Share 'instance1' and 'instance2' the same field references?
         */
        equal: function (instance1, instance2) {
            var Result;

            Result = instance1 === instance2;
            if (! Result &&
                instance2 !== null) {

                for (var name in instance1) {
                    if (instance1.hasOwnProperty (name)) {
                        if (instance1 [name] !== instance2 [name]) {
                            break;
                        }
                    }
                    else {
                        Result = true;
                        break;
                    }
                }
            }

            return Result;
        },

        /**
         * deep_equal (instance1, instance2: nullable Object): Boolean
         * Are 'instance1' and 'instance2' equal?
         */
        deep_equal: function (instance1, instance2) {
            var Result;

            Result = instance1 === instance2;
            if (! Result &&
                instance2 !== null) {

                for (var name in instance1) {
                    if (instance1.hasOwnProperty (name)) {
                        if (! this.deep_equal (instance1 [name], instance2 [name])) {
                            break;
                        }
                    }
                    else {
                        Result = true;
                        break;
                    }
                }
            }

            return Result;
        },

    // Status
        /**
         * conform (type: Object): Boolean
         * Is an instance of 'type'?
         */
        conform: function (type) {
            return this.generating_type.is (type);
        },

        /**
         * isEquel (other: nullable Object): Booelan
         * Share the same field references with 'other'?
         */
        is_equal: function (other) {
            return this.equal (this, other);
        },

        /**
         * isDeepEquel (other: nullable Object): Booelan
         * Is equal to 'other'?
         */
        is_deep_equal: function (other) {
            return this.equal (this, other);
        },

    // Change
        /**
         * copy (other: Object)
         * Update fields with 'other' field references.
         * @ensure this.is_equal (other)
         */
        copy: function (other) {
            for (var name in other) {
                if (other.hasOwnProperty (name)) {
                    this [name] = other [name];
                }
                else {
                    break;
                }
            }
        },

        /**
         * deep_copy (other: Object)
         * Update fields with deep twin of 'other' fields.
         * @ensure this.is_deep_equal (other)
         */
        deep_copy: function (other) {
            var field; //: nullable Object

            for (var name in other) {
                if (other.hasOwnProperty (name)) {
                    field = other [name];

                    if (field !== null) {
                        this [name] = this.deep_twin_of (field);
                    }
                }
                else {
                    break;
                }
            }
        },

    // Default Object
        /**
         * do_nothing ()
         * Run no action.
         */
        do_nothing: function () {}
    });

    // specification {
    Any.finalize ("type");
    Any.finalize ("agent");
    Any.finalize ("conform");
    Any.finalize ("equal");
    Any.finalize ("deep_equal");
    Any.finalize ("twin_of");
    Any.finalize ("deep_twin_of");
    Any.finalize ("do_nothing");
    // 'toString' and 'valueOf' is replacedable
    // }

