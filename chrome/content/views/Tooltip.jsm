"use strict";

const EXPORTED_SYMBOLS = ["Tooltip"];

const XUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
const HTML = "http://www.w3.org/1999/xhtml";

/**
 * This class is responsible for the actual displaying of the Tooltip.
 *
 * @author Tim Walter
 */
class Tooltip {
    /**
     * Construct a new Tooltip and add it to the document.
     *
     * @param {Document} document the DOM document
     * @param {string} deactivationHtml the HTML/text for the deactivation message
     * @param {boolean} noautohide indicated wheter the noautohide attribute be set or not on the tooltip
     */
    constructor(document, deactivationHtml, noautohide = false) {

        const tooltipHolder = document.createElement("panel");
        tooltipHolder.id = "meadaft-tooltip";

        if (noautohide) {
            tooltipHolder.setAttribute("noautohide", "true");
        }

        // Add the tooltip to the DOM
        document.documentElement.appendChild(tooltipHolder);

        // Warning
        const warningNode = document.createElementNS(HTML, "div");
        warningNode.id = "meadaft-warning";
        warningNode.classList.add("hidden");
        warningNode.classList.add("icon");
        tooltipHolder.appendChild(warningNode);

        // File name + extension
        const fileNode = document.createElementNS(HTML, "h1");
        fileNode.id = "meadaft-file";
        const fileNameNode = document.createElementNS(HTML, "span");
        fileNameNode.setAttribute("data-var", "name");
        const fileExtNode = document.createElementNS(HTML, "mark");
        fileExtNode.setAttribute("data-var", "ext");
        fileNode.appendChild(fileNameNode);
        fileNode.appendChild(fileExtNode);
        tooltipHolder.appendChild(fileNode);

        // Info text
        const infoNode = document.createElementNS(HTML, "div");
        infoNode.id = "meadaft-info";
        infoNode.classList.add("icon");
        tooltipHolder.appendChild(infoNode);

        // Advice text
        const adviceNode = document.createElementNS(HTML, "div");
        adviceNode.id = "meadaft-advice";
        adviceNode.classList.add("icon");
        tooltipHolder.appendChild(adviceNode);

        // Deactivation
        const deactivationNode = document.createElementNS(HTML, "div");
        deactivationNode.id = "meadaft-deactivation";
        deactivationNode.classList.add("hidden");
        deactivationNode.classList.add("icon");
        deactivationNode.innerHTML = deactivationHtml;
        tooltipHolder.appendChild(deactivationNode);

        // Make the DOM nodes accessible in this class
        this.node = tooltipHolder;
        this.fileNode = fileNode;
        this.fileNameNode = fileNameNode;
        this.fileExtNode = fileExtNode;
        this.warningNode = warningNode;
        this.infoNode = infoNode;
        this.adviceNode = adviceNode;
        this.deactivationNode = deactivationNode;
        this.deactivationNodeTime = deactivationNode.querySelector("[data-var='time']");
    }

    /**
     * Update the Tooltip's content with fresh data.
     *
     * @param {string} riskClass the risk class
     * @param {string} fileName the file name
     * @param {string} fileExt the file extension
     * @param {string} infoText the info text
     * @param {string} adviceText the advice
     * @param {number|null} deactivationDuration the deactivation duration
     * @param {string|null} warningText the warning text (e.g., the first mail message)
     *
     * @returns {void}
     */
    update(riskClass, fileName, fileExt, infoText, adviceText, deactivationDuration, warningText) {
        // Set CSS class for risk ranking
        this.node.classList.remove("risk-low", "risk-high", "risk-unknown", "risk-user");
        this.node.classList.add(riskClass);

        // Set the first mail warning
        if (warningText) {
            this.warningNode.classList.remove("hidden");
            this.warningNode.innerHTML = warningText;
        } else {
            this.warningNode.classList.add("hidden");
        }

        // Set the file name
        this.fileNameNode.textContent = fileName.length >= 60 ? fileName.substring(0, 55) + "[...]" : fileName;
        this.fileExtNode.textContent = "." + fileExt;

        // Set the info text
        this.infoNode.textContent = infoText;

        // Set the advice text
        this.adviceNode.textContent = adviceText;

        // Set the inital deactivation time
        if (deactivationDuration) {
            this.deactivationNode.classList.remove("hidden");
            this.deactivationNodeTime.innerHTML = deactivationDuration;
        } else {
            this.deactivationNode.classList.add("hidden");
        }
    }

    /**
     * Update the deactivation timer's value.
     *
     * @param {number} time the current seconds left.
     * @returns {void}
     */
    updateTime(time) {
        this.deactivationNodeTime.innerHTML = time;
    }
}
