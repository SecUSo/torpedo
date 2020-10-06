/* globals Preferences */
Preferences.addAll([
    { id: "extensions.torpedo.checkedTimer", type: "bool" },
    { id: "extensions.torpedo.blockingTimer", type: "int" },
    { id: "extensions.torpedo.activatedGreenList", type: "bool" },
    { id: "extensions.torpedo.greenListDelayActivated", type: "bool" },
    { id: "extensions.torpedo.blueListDelayActivated", type: "bool" },
    { id: "extensions.torpedo.privacyMode", type: "bool" },
    { id: "extensions.torpedo.securityMode", type: "bool" },
    { id: "extensions.torpedo.redirectMode", type: "bool" },
]);

document.addEventListener('dialogextra1', function () {
    torpedo.dialogmanager.createDefaultDelete();
});

document.addEventListener('dialogaccept', function () {
    return false;
});
