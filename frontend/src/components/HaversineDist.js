
function round_decimals(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}

function HaversineDist(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371 // km
    const dLat = toRadians(latitude2 - latitude1)
    const dLon = toRadians(longitude2 - longitude1)
    const lat1 = toRadians(latitude1)
    const lat2 = toRadians(latitude2)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return round_decimals(R * c, 2)
}

// Converts coordinates to radians
function toRadians(Value) {
    return Value * Math.PI / 180
}

// module.exports = HaversineDist;

export default HaversineDist;