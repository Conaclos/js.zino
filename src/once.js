"use strict";

/**
 * @library js.zino
 *
 * Copyright (c) 2012, Victorien ELVINGER
 *
 * @clusters zino, base
 * @revision 1
 * @author Victorien ELVINGER
 * @date 14-07-2012
 *
 */
define ([], function () {
    /**
     * once [F inherit Function] (unstable: F): F
     * Function running only once 'unstable'.
     */
    return function (unstable) {
            var control; //: Function

            control = function () {
                    var Result; //: Object

                    Result = unstable.apply (this, arguments);
                    control = function () {
                            return Result;
                        };

                    return Result;
                };

            return function () {
                    return control.apply (this, arguments);
                };
        };
});

