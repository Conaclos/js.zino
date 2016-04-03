"use strict";

/**
 * @library js.zino
 *
 * Copyright (c) 2012, Victorien ELVINGER
 *
 * @clusters zino, base
 * @revision 1
 * @author Victorien ELVINGER
 * @date 15-09-2012
 *
 */
    /**
     * stable [G] (value: G): Function [Object; []; G]
     * Function giving 'value' as Result.
     */
    function stable (value) {
        return function () {
                return value;
            };
    }

