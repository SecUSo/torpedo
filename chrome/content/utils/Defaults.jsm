"use strict";

const EXPORTED_SYMBOLS = ["Defaults"];

/**
 * @author Tim Walter
 */
const Defaults = {
    /**
     * The possible families for an extension with the default extensions.
     */
    extensionFamilies: [
        {
            id: 1,
            name: "UNKNOWN",
            risk: 2
        },
        {
            id: 2,
            name: "EXECUTABLE",
            risk: 3,
            exts: [
                "exe", "pif", "application", "gadget", "msi", "msp", "com", "scr", "hta", "cpl", "msc", "jar", "bat",
                "cmd", "vb", "vbs", "vbe", "js", "jse", "ws", "wsf", "wsc", "wsh", "ps1", "ps1xml", "ps2", "ps2xml",
                "psc1", "psc2", "msh", "msh1", "msh2", "mshxml", "msh1xml", "msh2xml", "scf", "lnk", "inf", "reg", "sh"
            ]
        },
        {
            id: 3,
            name: "ARCHIVE",
            risk: 2,
            exts: [
                // From https://en.wikipedia.org/wiki/List_of_archive_formats
                "a", "ar", "cpio", "shar", "iso", "lbr", "mar", "sbx", "tar", "bz2", "F", "gz", "lz", "lzma",
                "lzo", "rz", "sfark", "sz", "xz", "z", "7z", "s7z", "ace", "afa", "alz", "apk",
                "arc", "arj", "b1", "ba", "bh", "cab", "car", "cfs", "cpt", "dar", "dd", "dgc", "dmg", "ear", "gca",
                "ha", "hki", "ice", "jar", "kgb", "lzh", "lha", "lzx", "pak", "partimg", "paq6", "paq7", "paq8",
                "pea", "pim", "pit", "qda", "rar", "rk", "sda", "sea", "sen", "sfx", "shk", "sit", "sitx", "sqx",
                "gz", "tgz", "bz2", "tbz2", "lzma", "tlz", "uc", "uc0", "uc2", "ucn", "ur2", "ue2", "uca",
                "uha", "war", "wim", "xar", "xp3", "yz1", "zip", "zipx", "zoo", "zpaq", "zz", "ecc", "par", "par2",
                "rev"
            ]
        },
        {
            id: 4,
            name: "MEDIA",
            risk: 0,
            exts: [
                "au", "avi", "bmp", "cdr", "drw", "dwg", "dxf", "eps", "gif", "ico", "img", "jpe", "jpg", "mid",
                "midi", "mov", "mov", "mp1", "mp2", "mp3", "mpe", "mpg", "pcx", "pic", "pdd", "tga", "tif",
                "wav", "wma", "flac", "cda", "wmf", "png"
            ]
        },
        {
            id: 5,
            name: "DOC",
            risk: 0,
            exts: [
                "mdb", "pps", "pub", "tex", "log", "csv", "txt", "docx", "pptx", "xlsx", "potx", "ppsx", "sldx",
                "dotx", "xltx", "sql", "xps", "ics"
            ]
        },
        {
            id: 6,
            name: "DOC_MAL",
            risk: 3,
            exts: [
                "doc", "xls", "ppt", "docm", "dotm", "xlsm", "xltm", "pptm", "potm", "ppam", "ppsm", "sldm", "pdf",
                "xla", "xlam", "dot"
            ]
        }
    ],

    /**
     * The preferences for "extensions.meadaft." with its default values.
     */
    prefs: {
        delayDuration: 4,
        delayEnabled: true,
        delayAlwaysEnabled: false,
        useGloda: false
    }
};
