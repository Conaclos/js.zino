"use strict";

/**
 * @project js.zino
 *
 * Copyright 2012, Victorien ELVINGER
 *
 * @description Advanced Oriented Object Type.
 * @clusters zino, base
 * @revision 10
 * @author Victorien ELVINGER
 * @date 15-09-2012
 *
 * @dependencies Basic_Table, stable, Object
 */

    var Z_Type = {
    // Initialization
        /**
         * effect (a_id: String)
         * Type can be instantiated with the memory allocator (a_new).
         * Name 'a_id'.
         */
        effect: function (a_id) {
            console.assert (typeof a_id === "string", "require: attached a_id");

            this.parents = [];
            this.builder = function () {
                    this.generator = a_id;

                    console.assert (this.generator === a_id, "ensure: generator defined");
                };
            this.prototype = this.builder.prototype;
            this.prototype.generating_type = this;

            console.assert (this._invariant ());
            console.assert (this.effective (), "ensure: is effective");
        },

        /**
         * defer ()
         * Type cannot be instantiated.
         * @ensure  deferred: ! effective ()
         *          frozen_converters: isFrozen ("conversion_queries") && isFrozen ("conversion_commands")
         *          frozen_parents: isFrozen ("parents")
         */
        defer: function () {
            this.parents = [];
            this.prototype = {};

            console.assert (this._invariant ());
            console.assert (! this.effective (), "ensure: deferred");
        },

    // Memory allocation
        /**
         * a_new (): this
         * New instance of this
         */
        a_new: function () {
            console.assert (this.effective (), "require: is effective");

            var result = new this.builder ();

            console.assert (result instanceof this.builder, "ensure: result conformance");
            return result;
        },

    // Conversion
        /**
         * from (a_candidate: Any): nullable this
         * Attempt of conversion of 'a_candidate'.
         */
        from: function (a_candidate) {
            console.assert (! a_candidate.conform (this), "require: 'a_candidate' not conform");

            var converters; //: Basic_Table [Object; String]
            var predicate; //: Function [Type; [Type]; Boolean]
            var result;

            var type = a_candidate.generating_type;
            predicate = this.agent (this.parent);
            converters = type.conversion_queries ();
            converters.satisfy (predicate);

            if (converters.founded ()) {
                result = a_candidate [converters.key ()] ();
            }
            else {
                predicate = type.agent (type.is);
                converters = this.conversion_commands;
                converters.satisfy (predicate);

                if (converters.founded ()) {
                    result = this.a_new ();
                    result [converters.key ()] (a_candidate);
                }
                else {
                    result = null;
                }
            }

            return result;
        },

    // Default
        /**
         * default_value (): immutable this
         * Default instance of this
         */
        default_value: function () {
            console.log (this.effective (), "require: is effective");

            return this.a_new ();
        },

    // Access
        /**
         * agent (a_routine: Function): Function
         * Routine calling 'a_routine' on this
         *
         * @limitation new operator use on Result is not enabled.
         */
        agent: function (a_routine) {
            console.assert (a_routine instanceof Function, "require: 'a_routine' as Function");

            var target = this;
            return function () {
                    return a_routine.apply (target, arguments);
                };
        },

        /**
         * item (a_key: String): Object
         * Feature attached to 'a_key'
         * @require existing_feature: defined (a_key)
         */
        item: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.defined (a_key), "require: existing feature at 'a_key'");

            return this.prototype [a_key];
        },

        /**
         * conversion_commands: freezable Basic_Table [String; Type]
         * Conversion command keys associed to type
         */
        conversion_commands: new Basic_Table (),

        /**
         * conversion_queries (): freezable Basic_Table [String; Type]
         * Conversion query keys associated to type
         */
        conversion_queries: new Basic_Table (),

        /**
         * Feature whose key begins by this mark is exported to none class
         */
        unshared: "_",

    // Status
        /**
         * defined (a_key: String): Boolean
         * Is there a defined feature at 'a_key'?
         */
        defined: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");

            return this.prototype.hasOwnProperty (a_key);
        },

        /**
         * effective (): Boolean
         * Can be instantiated?
         */
        effective: function () {
            return this.hasOwnProperty ("builder");
        },

        /**
         * is (a_type: Type): Boolean
         * Is conform to 'a_type'?
         */
        is: function (a_type) {
            console.assert (a_type instanceof this.constructor, "require: 'a_type' as Z_TYPE");
            var result;

            result = this === a_type;
            if (! result) {
                var parents = this.parents;
                var index = parents.length - 1;

                while (index >= 0 &&
                        ! parents[index].is (a_type)) {
                    index--;
                }

                result = index >= 0;
            }

            return result;
            // return (this === a_type) ||
            //      this.parents.some (a_type.parent, a_type);
        },

        /**
         * parent (a_type: Type): Boolean
         * Is a parent of 'a_type'?
         */
        parent: function (a_type) {
            return a_type.is (this);
        },

    // Lazy initializations
        /**
         * create_conversion_queries ()
         * Create a new mutable table of conversion queries.
         * @ensure  mutable: ! isFrozen ("conversion_queries")
         *          read-only: ! getOwnPropertyDescriptor (this, "conversion_queries").writable
         */
        create_conversion_queries: function () {
            this.conversion_queries = this.conversion_queries.twin ();

            console.assert (this._invariant ());
        },

        /**
         * create_conversion_commands ()
         * Create a new mutable table of conversion Commands.
         * @ensure  mutable: ! isFrozen ("conversion_commands")
         *          read-only: ! getOwnPropertyDescriptor (this, "conversion_commands").writable
         */
        create_conversion_commands: function () {
            this.conversion_commands = new Basic_Table ();

            console.assert (this._invariant ());
        },

    // Extension or Replacement
        /**
         * force (a_key: String; a_item: Object)
         * Add 'a_item' at 'a_key' or replace feature at 'a_key' by 'a_item'.
         *
         * If a field is specified then it is not an undefinable or nullable field.
         *
         * @warning A once per object routine cannot be attached to a new key.
         */
        force: function (a_key, a_item) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");

            this.prototype [a_key] = a_item;

            console.assert (this.defined (a_key), "ensure: existing feature at 'a_key'");
            console.assert (this.item (a_key) === a_item, "ensure: 'a_item' added at 'a_key'");
        },

        /**
         * undefine (a_keys: Array [String])
         * Declare a set of deferred features.
         * Deferred features must be defined in the effective heirs.
         * Undefine the existing features listed.
         */
        undefine: function (a_keys) {
            console.assert (typeof a_keys === "object", "require: 'a_keys' as object");

            console.assert (this._invariant ());
        },

        /**
         * define (a_features: Object)
         * Add a set of new features.
         *
         * @warning A once per object routine cannot be attached to a new key.
         */
        define: function (a_features) {
            console.assert (typeof a_features === "object", "require: 'a_features' as object");
            console.assert (a_features.toString === Object.prototype.toString &&
                            a_features.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");

            for (var key in a_features) {
                console.assert ((! this.defined (key)) || (this.item (key) === a_features [key]), "require: feature at '" + key + "' will be not redefined");

                this.extend (key, a_features[key]);
            }
            // runAll.call (features, this.agent (this.extend));

            console.assert (this._invariant ());
        },

        /**
         * define (a_features: Object)
         * Replace a set of features.
         * Preserve the constraints.
         *
         * @warning A once per object routine cannot be attached to a new key.
         */
        redefine: function (a_features) {
            console.assert (typeof a_features === "object", "require: 'a_features' as object");
            console.assert (a_features.toString === Object.prototype.toString &&
                            a_features.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");

            for (var key in a_features) {
                console.assert (this.defined (key), "require: feature at '" + key + "' defined");

                this.put (key, a_features[key]);
            }
            // runAll.call (a_features, this.agent (this.put));

            console.assert (this._invariant ());
        },

        /**
         * expand (other: Object)
         * Add all features of 'other' without polymorphism.
         *
         * Properties are not copied.
         */
        expand: function (other) {
            console.assert (other instanceof Object && other.hasOwnProperty ("prototype"), "require: 'other' is prototyped");
            console.assert (other.prototype.toString === Object.prototype.toString &&
                            other.prototype.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");

            var features; //: Object

            features = other.prototype;
            for (var key in features) {
                console.assert (function (a_current) {
                        if (a_current.defined (key) &&
                            key !== "generating_type" && key !== "constructor" &&
                            a_current.item (key) !== features [key]) {

                            console.warn ("feature at '" + key + "' is redefined by inheritance");
                        }
                    } (this) !== null);

                this.force (key, features[key]);
            }
            // runAll.call (features, this.agent (this.force));

            features = this.prototype;
            features.generating_type = this;
            features.constructor = this.builder;

            console.assert (this._invariant ());
        },

        /**
         * expand_except (other: Object; keys: Array [String])
         * Add all features of 'other' without polymorphism.
         * Select previous implementation of 'keys' to solve feature name conflict.
         *
         * Properties are not copied.
         */
        expand_except: function (other, keys) {
            console.assert (other instanceof Object && other.hasOwnProperty ("prototype"), "require: 'other' is prototyped");
            console.assert (other.prototype.toString === Object.prototype.toString &&
                            other.prototype.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");
            console.assert (keys instanceof Array, "require: 'keys' as Array");
            console.assert (keys.length > 0, "require: at least one item in 'keys'");

            var key;
            var i; //: Integer

            var selection = [];
            i = keys.length;
            do {
                i--;
                key = keys [i];

                console.assert (typeof key === "string", "require: " + i + "-th item of 'keys' as String");
                console.assert (this.defined (key), "require: " + i + "-th item of 'keys' is defined");
                console.assert (key in other.prototype, "require: " + i + "-th item of 'keys' is defined in 'other'");

                selection [i] = this.item (key);
                this.remove (key);
            } while (i > 0);

            this.expand (other);

            i = keys.length;
            do {
                i--;
                this.put (keys [i], selection [i]);
            } while (i > 0);
        },

        /**
         * inherit (other: Type)
         * Add all features of 'other' and enable polymorphism.
         *
         * Conversions by queries are copied. The conflict must be managed manually
         * with 'remove_converter'.
         * Final constraints are copied.
         *
         * Properties are not copied. Sure that current interface is conform with 'other' interface.
         */
        inherit: function (other) {
            console.assert (other instanceof this.constructor, "require: 'other' as Z_TYPE");
            console.assert (! other.is (this), "require: no circular inheritance");
            console.assert (other.prototype.toString === Object.prototype.toString &&
                            other.prototype.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");

            this.expand (other);

            var parents = this.parents;
            parents [parents.length] = other;

            var new_conversion_queries = other.conversion_queries;
            if (this.conversion_queries.isEmpty ()) {
                this.conversion_queries = new_conversion_queries;
            }
            else {
                this.create_conversion_queries ();

                this.conversion_queries.expand (new_conversion_queries);
            }

            console.assert (this._invariant ());
            console.assert (this.is (other), "ensure: inheritance from 'other' added");
        },

        /**
         * inherit_except (other: Type: keys: Array [String])
         * Add all features of 'other' and enable polymorphism.
         * Select previous implementation of 'keys' to solve feature name conflict.
         *
         * Conversions by queries are copied. The conflict must be managed manually
         * with 'remove_converter'.
         * Final constraints are copied.
         *
         * Properties are not copied. Sure that current interface is conform with 'other' interface.
         */
        inherit_except: function (other, keys) {
            console.assert (other instanceof this.constructor, "require: 'other' as Z_TYPE");
            console.assert (! other.is (this), "require: no circular inheritance");
            console.assert (other.prototype.toString === Object.prototype.toString &&
                            other.prototype.valueOf === Object.prototype.valueOf, "require: dontenum bug prevention");
            console.assert (keys instanceof Array, "require: 'keys' as Array");
            console.assert (keys.length > 0, "require: at least one item in 'keys'");

            var key;
            var i; //: Integer

            var selection = [];
            i = keys.length;
            do {
                i--;
                key = keys [i];

                console.assert (typeof key === "string", "require: " + i + "-th item of 'keys' as String");
                console.assert (this.defined (key), "require: " + i + "-th item of 'keys' is defined");
                console.assert (key in other.prototype, "require: " + i + "-th item of 'keys' is defined in 'other'");

                selection [i] = this.item (key);
                this.remove (key);
            } while (i > 0);

            this.inherit (other);

            i = keys.length;
            do {
                i--;
                this.put (keys [i], selection [i]);
            } while (i > 0);
        },

    // Change
        /**
         * convert (a_key: String; a_abstraction: Type)
         *
         * If 'a_key' is a query, it must have none argument and a result type conform to 'a_abstraction'.
         * Else if 'a_key' is a command, it must have an argument conform to 'a_abstraction'.
         * The command become an official initializer.
         *
         * @require is_routine: isFunction (item (a_key))
         *          not_conform: ! is (a_abstraction)
         *          parameter_number: item (a_key).length === 0 || item (a_key).length === 1
         * @ensure  item (a_key).length === 0 implies conversion_commands[a_abstraction] = a_key
         *          item (a_key).length === 1 implies conversion_queries[a_abstraction] = a_key
         */
        convert: function (a_key, a_abstraction) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (a_abstraction instanceof this.constructor, "require: 'a_abstraction' as Z_TYPE");
            console.assert (! this.is (a_abstraction), "require: not conform to 'a_abstraction'");
            console.assert (this.exists (a_key), "require: existing feature at 'a_key'");
            console.assert (this.item (a_key) instanceof Function, "require: 'item (a_key)' as Function");
            console.assert (this.item (a_key).length < 2, "require: query or command with one argument");

            if (this.item (a_key).length !== 0) {
                this.create_conversion_commands ();
                this.conversion_commands.extend (a_key, a_abstraction);
            }
            else {
                this.create_conversion_queries ();
                this.conversion_queries.extend (a_key, a_abstraction);
            }

            console.assert (this._invariant ());
            console.assert ((this.item (a_key).length === 0 && this.conversion_queries.item (a_key) === a_abstraction) ||
                            (this.item (a_key).length === 1 && this.conversion_commands.item (a_key) === a_abstraction),
                            "ensure: conversion query or command at 'a_key' added");
        },

        /**
         * define_property (a_key: String)
         * Define a not enumerable and not configurable property
         * with the query at 'a_key' as getter.
         * @obsolete use get/set keywords
         * @require existing_function: defined (a_key)
         */
        define_property: function (a_key) {
            var descriptor = {
                    get: this.item (a_key)
                };
            Object.defineProperty (this.prototype, a_key, descriptor);
        },

        /**
         * define_assigner (a_query, a_command: String)
         * Define a not enumerable and not configurable property
         * with the query at 'a_query' as getter and the command at 'a_command' as setter.
         * @obsolete use get/set keywords
         * @require existing_features: defined (a_query) && defined (a_command)
         */
        define_assigner: function (a_query, a_command) {
            var descriptor = {
                get: this.item (a_query),
                set: this.item (a_command)
            };
            Object.defineProperty (this.prototype, a_query, descriptor);
        },

        /**
         * finalize (a_key: String)
         * Forbiden the redefinition of the feature at 'a_key'.
         * @require existing_feature: defined (a_key)
         */
        finalize: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.defined (a_key), "require: existing feature at 'a_key'");

            console.assert (this._invariant ());
        },

        /**
         * initialize (a_key: String)
         * Define the command 'a_key' as official initializer.
         * While a new instance is not initialized the official initializer exportation constraints
         * are suspended.
         * @require effective: effective ()
         *          existing_feature: defined (a_key)
         */
        initialize: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.defined (a_key), "require: existing feature at 'a_key'");

            console.assert (this._invariant ());
        },

        /**
         * run_once (a_key: String)
         * Run once per object the feature at 'a_key'.
         * Constraints are preserved.
         *
         * @require existing_feature: defined (a_key)
         *          not_once_per_object_routine: not once per object item (a_key)
         */
        run_once: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.defined (a_key), "existing feature at 'a_key'");

            var unstable = this.item (a_key);
            this.put (a_key, function () {
                    console.assert (! this.hasOwnProperty (a_key), "require: constant routine not assigned");

                    var result = unstable.apply (this, arguments);
                    this [a_key] = stable (result);

                    console.assert (this.hasOwnProperty (a_key), "ensure: constant routine assigned");
                    return result;
                });

            console.assert (this._invariant ());
        },

    // Removal
        /**
         * remove (a_key: String)
         * Delete the feature at 'a_key'.
         */
        remove: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.defined (a_key), "require: existing feature at 'a_key'");

            delete this.prototype [a_key];

            console.assert (this._invariant ());
            console.assert (! this.defined (a_key), "ensure: feature at 'a_key' removed");
        },

        /**
         * remove_converter (a_key: String)
         * Remove conversion propertie of the query 'a_key'.
         */
        remove_converter: function (a_key) {
            console.assert (typeof a_key === "string", "require: 'a_key' as String");
            console.assert (this.conversion_queries.exists (a_key), "require: existing converter at 'a_key'");

            this.create_conversion_queries ();
            this.conversion_queries.remove (a_key);

            console.assert (this._invariant ());
            console.assert (! this.conversion_queries.exists (a_key), "ensure: converter at 'a_key' removed");
        }
    };

        /**
         * put (a_key: String; item: Object)
         * Replace feature at 'a_key' by 'item'.
         * Replaced feature at 'a_key' cannot be frozen.
         *
         * A routine cannot accept an undefinable argument value.
         * If a field is specified then it is not an undefinable or nullable field.
         *
         * @warning A once per object routine cannot be attached to a new key.
         * @require correct_id: a_key.length > 0
         *          existing_feature: defined (a_key)
         */
        Z_Type.put = Z_Type.force;

        /**
         * extend (a_key: String; item: Object)
         * Add 'item' at 'a_key'.
         *
         * A routine cannot accept an undefinable argument value.
         * If a field is specified then it is not an undefinable or nullable field.
         *
         * @warning A once per object routine cannot be attached to a new key.
         * @require correct_id: a_key.length > 0
         *          not_existing_feature: ! defined (a_key)
         * @ensure feature_added: defined (a_key)
         */
        Z_Type.extend = Z_Type.put;

        /**
         * _invariant (): Boolean
         */
        Z_Type._invariant = function () {
            console.assert (this.prototype instanceof Object, "invariant: attached prototype");

            if (this.effective ()) {
                console.assert (this.prototype === this.builder.prototype, "invariant: prototype equivalence");
                console.assert (this.prototype.generating_type === this, "invariant: generating_type defined");
                console.assert (this.prototype.constructor === this.builder, "invariant: constructor equivalence");
            }
            else {
                console.assert (typeof this.prototype.generating_type === "undefined", "invariant: generating_type undefined");
                console.assert (this.prototype.constructor === Object, "invariant: object constructor");
            }
            return true;
        };

    Z_Type.prototype = Z_Type;
    Z_Type.run_once ("default_value");
    Z_Type.run_once ("create_conversion_queries");
    Z_Type.run_once ("create_conversion_commands");

    Z_Type.initialize ("effect");
    Z_Type.initialize ("defer");

    Z_Type.effect ("Z_Type");
    Z_Type.define (Z_Type);

    Z_Type.remove ("prototype");
    Z_Type.remove ("builder");

