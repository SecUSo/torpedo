"use strict";

// noinspection JSUnusedGlobalSymbols
const EXPORTED_SYMBOLS = ["WindowListener"];

const {interfaces: Ci, utils: Cu} = Components;

const console = (Cu.import("resource://gre/modules/Console.jsm", {})).console;
Cu.import("chrome://meadaft/content/TooltipManager.jsm");

/**
 * This object handles that a Tooltip is added to a window.
 * Inspired by https://www.oxymoronical.com/blog/2011/01/Playing-with-windows-in-restartless-bootstrapped-extensions
 *
 * @type {{setupBrowserUI: (function(Window): void), tearDownBrowserUI: (function(Window): void), onOpenWindow: (function(*)), onCloseWindow: (function(*)), onWindowTitleChange: (function(*, *))}}
 * @autor Tim Walter
 */
const WindowListener = {
    /**
     * This method performs all steps to add the add-on's UI elements to the Thunderbird window.
     *
     * @param {Window} window
     * @returns {void}
     */
    setupBrowserUI(window) {
        const handler = () => {
            const windowtype = window.document.documentElement.getAttribute("windowtype");
            // If this is a mail window then setup its UI
            if (windowtype === "mail:3pane" || windowtype === "mail:messageWindow") {
                window.MeadaftTooltipManager = new TooltipManager(window);
            }
        };

        if (window.document.readyState === "complete") {
            handler();
        } else {
            // Wait for it to finish loading
            window.addEventListener("load", handler, {
                once: true
            });
        }
    },

    /**
     * This method performs all steps to remove the addon's UI elements from all Thunderbird windows.
     *
     * @param {Window} window
     * @returns {void}
     */
    tearDownBrowserUI(window) {
        if (window.MeadaftTooltipManager) {
            window.MeadaftTooltipManager.destroy();
            delete window.MeadaftTooltipManager;
        }
    },

    // Function of the nsIWindowMediatorListener

    /**
     * @param {nsIXULWindow} xulWindow
     * @returns {void}
     */
    onOpenWindow(xulWindow) {
        // A new window has opened
        let domWindow = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);

        this.setupBrowserUI(domWindow);
    },

    /**
     * @param {nsIXULWindow} xulWindow
     * @returns {void}
     */
    onCloseWindow(xulWindow) {
    },

    /**
     * @param {nsIXULWindow} xulWindow
     * @param {string} newTitle
     * @returns {void}
     */
    onWindowTitleChange(xulWindow, newTitle) {
    }
};
