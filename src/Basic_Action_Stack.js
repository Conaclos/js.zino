"use strict";

/**
 * @description Sequence of action runnable
 * @date 2-09-2012
 * @revision 1
 * @author Victorien ELVINGER
 * @project Stailla.js
 */

    function Basic_Action_Stack () {
            this._area = [];
        };
    Basic_Action_Stack.prototype = {
    // Access
        constructor: Basic_Action_Stack,

    // Running
        /**
         * run (data: Array[Object])
         * Call all actions with 'data' as arguments.
         */
        run: function (data) {
            var actions; //: Array[Function]
            var index; //: Integer

            actions = this._area;
            index = actions.length;
            while (index > 0) {
                index--;
                actions [index].apply (this, data);
            }
        },

    // Extension
        /**
         * extend (action: Function)
         * Add 'action'.
         */
        extend: function (action) {
            var items; //;: Array [Functrion]

            items = this._area;
            items [items.length] = action;
        },

    // Removal
        /**
         * clear ()
         * Remove all items
         */
        clear: Basic_Action_Stack
    };
