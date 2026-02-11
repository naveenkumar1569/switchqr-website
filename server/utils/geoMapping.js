/**
 * Country to Continent Mapping Utility
 */

const COUNTRY_TO_CONTINENT = {
    // Asia
    'AF': 'Asia', 'AM': 'Asia', 'AZ': 'Asia', 'BD': 'Asia', 'BT': 'Asia', 'BN': 'Asia', 'KH': 'Asia', 'CN': 'Asia',
    'GE': 'Asia', 'IN': 'Asia', 'ID': 'Asia', 'IR': 'Asia', 'IQ': 'Asia', 'IL': 'Asia', 'JP': 'Asia', 'JO': 'Asia',
    'KZ': 'Asia', 'KP': 'Asia', 'KR': 'Asia', 'KW': 'Asia', 'KG': 'Asia', 'LA': 'Asia', 'LB': 'Asia', 'MY': 'Asia',
    'MV': 'Asia', 'MN': 'Asia', 'MM': 'Asia', 'NP': 'Asia', 'OM': 'Asia', 'PK': 'Asia', 'PH': 'Asia', 'QA': 'Asia',
    'SA': 'Asia', 'SG': 'Asia', 'LK': 'Asia', 'SY': 'Asia', 'TW': 'Asia', 'TJ': 'Asia', 'TH': 'Asia', 'TR': 'Asia',
    'TM': 'Asia', 'AE': 'Asia', 'UZ': 'Asia', 'VN': 'Asia', 'YE': 'Asia',

    // Europe
    'AL': 'Europe', 'AD': 'Europe', 'AT': 'Europe', 'BY': 'Europe', 'BE': 'Europe', 'BA': 'Europe', 'BG': 'Europe',
    'HR': 'Europe', 'CY': 'Europe', 'CZ': 'Europe', 'DK': 'Europe', 'EE': 'Europe', 'FI': 'Europe', 'FR': 'Europe',
    'DE': 'Europe', 'GR': 'Europe', 'HU': 'Europe', 'IS': 'Europe', 'IE': 'Europe', 'IT': 'Europe', 'LV': 'Europe',
    'LI': 'Europe', 'LT': 'Europe', 'LU': 'Europe', 'MT': 'Europe', 'MD': 'Europe', 'MC': 'Europe', 'ME': 'Europe',
    'NL': 'Europe', 'MK': 'Europe', 'NO': 'Europe', 'PL': 'Europe', 'PT': 'Europe', 'RO': 'Europe', 'RU': 'Europe',
    'SM': 'Europe', 'RS': 'Europe', 'SK': 'Europe', 'SI': 'Europe', 'ES': 'Europe', 'SE': 'Europe', 'CH': 'Europe',
    'UA': 'Europe', 'GB': 'Europe', 'VA': 'Europe',

    // America (North & South)
    'AG': 'America', 'BS': 'America', 'BB': 'America', 'BZ': 'America', 'CA': 'America', 'CR': 'America', 'CU': 'America',
    'DM': 'America', 'DO': 'America', 'SV': 'America', 'GD': 'America', 'GT': 'America', 'HT': 'America', 'HN': 'America',
    'JM': 'America', 'MX': 'America', 'NI': 'America', 'PA': 'America', 'KN': 'America', 'LC': 'America', 'VC': 'America',
    'TT': 'America', 'US': 'America', 'AR': 'America', 'BO': 'America', 'BR': 'America', 'CL': 'America', 'CO': 'America',
    'EC': 'America', 'GY': 'America', 'PY': 'America', 'PE': 'America', 'SR': 'America', 'UY': 'America', 'VE': 'America',

    // Africa
    'DZ': 'Africa', 'AO': 'Africa', 'BJ': 'Africa', 'BW': 'Africa', 'BF': 'Africa', 'BI': 'Africa', 'CM': 'Africa',
    'CV': 'Africa', 'CF': 'Africa', 'TD': 'Africa', 'KM': 'Africa', 'CG': 'Africa', 'CD': 'Africa', 'DJ': 'Africa',
    'EG': 'Africa', 'GQ': 'Africa', 'ER': 'Africa', 'ET': 'Africa', 'GA': 'Africa', 'GM': 'Africa', 'GH': 'Africa',
    'GN': 'Africa', 'GW': 'Africa', 'CI': 'Africa', 'KE': 'Africa', 'LS': 'Africa', 'LR': 'Africa', 'LY': 'Africa',
    'MG': 'Africa', 'MW': 'Africa', 'ML': 'Africa', 'MR': 'Africa', 'MU': 'Africa', 'MA': 'Africa', 'MZ': 'Africa',
    'NA': 'Africa', 'NE': 'Africa', 'NG': 'Africa', 'RW': 'Africa', 'ST': 'Africa', 'SN': 'Africa', 'SC': 'Africa',
    'SL': 'Africa', 'SO': 'Africa', 'ZA': 'Africa', 'SS': 'Africa', 'SD': 'Africa', 'SZ': 'Africa', 'TZ': 'Africa',
    'TG': 'Africa', 'TN': 'Africa', 'UG': 'Africa', 'ZM': 'Africa', 'ZW': 'Africa',

    // Oceania
    'AU': 'Oceania', 'FJ': 'Oceania', 'KI': 'Oceania', 'MH': 'Oceania', 'FM': 'Oceania', 'NR': 'Oceania', 'NZ': 'Oceania',
    'PW': 'Oceania', 'PG': 'Oceania', 'WS': 'Oceania', 'SB': 'Oceania', 'TO': 'Oceania', 'TV': 'Oceania', 'VU': 'Oceania'
};

/**
 * Get Continent name for a country code
 * @param {string} countryCode ISO Country Code (e.g. 'US', 'IN')
 * @returns {string} Continent name
 */
const getContinent = (countryCode) => {
    if (!countryCode) return 'Other';
    return COUNTRY_TO_CONTINENT[countryCode.toUpperCase()] || 'Other';
};

module.exports = {
    getContinent
};
