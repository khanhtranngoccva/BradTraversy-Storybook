const moment = require("moment");

module.exports = {
    /**
     * @param date {Date}
     * @param format {string} */
    formatDate: (date, format) => moment(date).format(format),
    /**
     *
     * @param str {string}
     * @param len {number?}
     */
    truncate: (str, len) => {
        if (str.length > len && str.length > 0) {
            let newStr = str + "";
            newStr = str.slice(0, len).slice(0, str.lastIndexOf(" "));
            return newStr.length > 0 ? newStr : str.slice(0, len);
        }
        return str;
    },
    /**
     *
     * @param input {string}
     * @returns {string}
     */
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, "");
    },
    /**
     *
     * @param storyUser {object}
     * @param loggedUser {object}
     * @param floating {boolean}
     * @returns {number}
     */
    editIcon: (storyUser, loggedUser, floating = true) => {
        return (storyUser._id.toString() === loggedUser._id.toString())
    },
    capitalize: (str) => {
        if (str === "") return "";
        else return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

}