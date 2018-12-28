/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if (s.length < 2) return s;
    var len = s.length,
        l, r, maxstr = "",
        cur;
    for (var mid = 0; mid < len; mid++) {
        l = r = mid;
        while (l - 1 >= 0 && r + 1 < len) {
            if (s[r] == s[r + 1]) {
                r++;
            } else if (s[l - 1] == s[r + 1]) {
                l--;
                r++;
            } else break;
        }
        //console.log(mid, l, r);
        if (l != r) {
            maxstr = (r - l + 1) > maxstr.length ? s.substr(l, r - l + 1) : maxstr;
        }
    }
    return maxstr == "" ? s[0] : maxstr;
};
console.log(longestPalindrome("ac"));
console.log(longestPalindrome("aaabaaaa"));
console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));
console.log(longestPalindrome("bb"));