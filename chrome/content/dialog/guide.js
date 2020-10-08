"use strict";

const {utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

const stringBundle = Services.strings.createBundle("chrome://torpedo/locale/main-strings.properties?" + Math.random()); // Randomize URI to work around bug 719376

/**
 * @author Tim Walter
 */
const Guide = {
    /**
     * This object handles the pages.
     */
    pageHandler: {
        /**
         * All pages with their IDs and sections in order.
         */
        pages: [{
            id: "guide-page-blacklist",
            section: "basic"
        },{
            id: "guide-page-welcome",
            section: "basic"
        }, {
            id: "guide-page-why",
            section: "tooltips"
        }, {
            id: "guide-page-tooltips-settings",
            section: "settings"
        } ],


        /**
         * The DOM node of the current page.
         */
        currentPageNode: null,
        /**
         * The current page number.
         */
        currentPageNumber: 0,
        /**
         * The DOM node of the list item corresponding to the current page's section.
         */
        currentSection: null,
        /**
         * Init the first page.
         *
         * @returns {void}
         */
        init() {
            this.changePage(0);
        },
        /**
         * Change the page to the current page plus the offset.
         *  If the offset is 0, the properties of this object are set (again). This case is needed for the initialization.
         *
         * @param {int} offset
         * @returns {void}
         */
        changePage(offset) {
            if (this.currentPageNumber + offset >= this.pages.length || this.currentPageNumber + offset < 0) {
                return;
            }

            if (offset !== 0) {
                this.currentPageNode.classList.remove("active");
                //this.currentSection.classList.remove("active");

                this.currentPageNumber = this.currentPageNumber + offset;
            }

            const currentPage = this.pages[this.currentPageNumber];

            if (currentPage.hasOwnProperty("beforeHook")) {
                this.pages[this.currentPageNumber].beforeHook(this);
            }

            this.currentPageNode = document.getElementById(currentPage.id);
            //this.currentSection = document.getElementById("section-" + currentPage.section + "-item");
            this.currentPageNode.classList.add("active");
            //this.currentSection.classList.add("active");
        },
        /**
         * Indicates if the current page is the last one.
         *
         * @returns {boolean}
         */
        get isLastPage() {
            return this.currentPageNumber === this.pages.length - 1;
        },
        /**
         * Indicates if the current page is the first one.
         *
         * @returns {boolean}
         */
        get isFirstPage() {
            return this.currentPageNumber === 0;
        }
    },
    /**
     * References for the buttons for more meaningful names than "extra1" etc.
     */
    buttons: {
        /**
         * The next button.
         */
        next: null,
        /**
         * The previous button.
         */
        prev: null,
        /**
         * The finish button.
         */
        finish: null
    },
    /**
     * Set-up the guide dialog.
     *
     * @param {Event} event
     * @returns {void}
     */
    onLoad(event) {
        const dialog = document.documentElement;

        // Manually move the window to the center of the screen
        const w = (screen.availWidth / 2) - 500;
        const h = (screen.availHeight / 2) - 325;
        window.moveTo(w, h);

        // Set the first page
        this.pageHandler.init();

        // Add event listeners to the buttons
        dialog.addEventListener("dialogcancel", () => this.onClose());
        dialog.addEventListener("dialogextra1", () => this.previousPage());
        dialog.addEventListener("dialogextra2", () => this.nextPage());

        // Make "aliases" for the dialog buttons
        this.buttons.next = document.documentElement.getButton("extra2");
        this.buttons.prev = document.documentElement.getButton("extra1");
        this.buttons.finish = document.documentElement.getButton("accept");
    },
    /**
     * Go to the next page and adjust the buttons disabled state.
     *
     * @returns {void}
     */
    nextPage() {
        this.pageHandler.changePage(1);
    

        if (!this.pageHandler.isFirstPage) {
            this.buttons.prev.disabled = false;
            this.buttons.prev.style.display ="block";
        }

        if (this.pageHandler.isLastPage) {
            this.buttons.next.disabled = true;
            this.buttons.finish.disabled = false;
            this.buttons.next.style.display ="none";
        }
    },
    /**
     * Go to the previous page and adjust the buttons disabled state.
     *
     * @returns {void}
     */
    previousPage() {
        this.pageHandler.changePage(-1);
        
        if (this.pageHandler.isFirstPage) {
            this.buttons.prev.disabled = true;
            this.buttons.prev.style.display ="none";
        }

        if (!this.pageHandler.isLastPage) {
            this.buttons.next.disabled = false;
            this.buttons.next.style.display ="block";
            this.buttons.finish.disabled = true;
        }
    },
    /**
     * Close the dialog without finishing the guide.
     *
     * @returns {boolean}
     */
    onClose() {
        return true;
    }
};