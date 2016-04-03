"use strict";

/**
 * @description Association of items with unique keys
 * @date 15-08-2012
 * @revision 1
 * @author Victorien ELVINGER
 * @project js.zino
 *
 * @INVARIANT keys ().length === items ().length
 */

    function Basic_Table () {
            this._area = [];
            this._keys = [];
        };
    Basic_Table.prototype = {
    // Access Implementation
        _index: -1, //: freezable Array[G]

        _key_at: function (index) {
            return this._keys [index];
        },

        _index_of: function (key) {
            return this._keys.indexOf (key);
        },

    // Access
        constructor: Basic_Table,

        /**
         * item (key: K): G
         * Item attached to 'key'
         * @require exists (key)
         */
        item: function (key) {
            return this._area [this._index_of (key)];
        },

        /**
         * count (): Integer
         * Number of items
         */
        count: function () {
            return this._area.length;
        },

        /**
         * active (): G
         * Last searched item
         * @require founded ()
         */
        active: function () {
            return this._area [this._index];
        },

        /**
         * key (): K
         * Key of the last searched item.
         * @require founded ()
         */
        key: function () {
            return this._key_at (this._index);
        },

        /**
         * twin (): like this
         * Separate object sharing the same items and keys
         */
        twin: function () {
            var Result;

            Result = new Basic_Table ();
            Result.expand (this);

            return Result;
        },

    // Status
        /**
         * isEmpty (): Boolean
         * Is there no items?
         */
        isEmpty: function () {
            return this.count () === 0;
        },

        /**
         * exist (key: K): Boolean
         * Is there an 'i'-th item?
         */
        exists: function (key) {
            return this._index_of (key) !== -1;
        },

        /**
         * founded (): Boolean
         * Is last search success?
         */
        founded: function () {
            return this._index !== -1;
        },

    // Searching
        /**
         * satisfy (predicate: Function [Object, [G, K], Boolean])
         * Search an item checking 'predicate'.
         * @ensure founded () implies active () === element
         */
        satisfy: function (predicate) {
            var items; //: Array [G]
            var index; //: Integer

            items = this._area;
            index = this.upper ();

            while (index >= 0 && predicate (items [index], this._key_at (index))) {
                index--;
            }

            this._index = index;
        },

    // Extension
        /**
         * extend (key, newItem: Object)
         * Enter 'newItem' at 'key'.
         *
         * @require not_existing_index: ! exists (key)
         * @ensure  inserted: item (key) === newItem
         */
        extend: function (key, newItem) {
            var index; //: Integer

            index = this.count ();
            this._keys [index] = key;
            this._area [index] = newItem;
        },

        /**
         * expand (other: like this)
         * Add all entries of 'other'.
         * @ensure count () === count () + other.count ()
         */
        expand: function (other) {
            var items; //: Array [G]

            items = this._area;
            items.push.apply (this._keys, other._keys);
            items.push.apply (items, other._area);
        },

    // Removal implementation
        /**
         * remove_index (index: Integer)
         * Remove the item at 'index'.
         * @require existing_index: exists (keyOf (index))
         * @ensure  occurrences (old item (old keyOf (index))) ==== old occurrences (old item (old keyOf (index))) - 1
         *          count () === old count () - 1
         *          ! founded ()
         */
        remove_index: function (index) {
            this._area.splice (index, 1);
            this._keys.splice (index, 1);
            delete this._index;
        },

    // Removal
        /**
         * remove (key: K)
         * Remove the item at 'key'.
         * @require existing_index: exists (key)
         * @ensure  occurrences (old item (key)) ==== old occurrences (old item (key)) - 1
         *          count () === old count () - 1
         *          ! founded ()
         */
        remove: function (key) {
            this.remove_index (this._index_of (key));
        }
    };

