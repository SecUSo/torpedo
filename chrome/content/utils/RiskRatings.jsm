"use strict";

const EXPORTED_SYMBOLS = ["RiskRatings"];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

/**
 * @author Tim Walter
 */
const RiskRatings = {
    /**
     * The possible ratings for the risk of an attachment.
     */
    _ratings: [
        {
            id: 0,
            class: "risk-low",
            name: "LOW"
        },
        {
            id: 1,
            class: "risk-user",
            name: "USER"
        },
        {
            id: 2,
            class: "risk-unknown",
            name: "UNKNOWN"
        },
        {
            id: 3,
            class: "risk-high",
            name: "HIGH"
        }
    ],

    /**
     * Get the rating object for the given id.
     *
     * @param {number} id the rating id
     * @returns {*}
     */
    getRating(id) {
        return this._ratings[id];
    },

    /**
     * Get the css class for the given rating id.
     *
     * @param {number} id the rating id
     * @returns {string} the css class
     */
    getClass(id) {
        return this._ratings[id].class;
    },

    /**
     * Get the name for the given rating id.
     *
     * @param {number} id the rating id
     * @returns {string} the name
     */
    getName(id) {
        return this._ratings[id].name;
    }
};
