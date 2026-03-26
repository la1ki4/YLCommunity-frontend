export function getCountryAndCityFromFormat(countryAndCityFormat) {
    if (typeof countryAndCityFormat !== "string") {
        return {
            country: "",
            city: "",
        };
    }

    const [country = "", ...cityParts] = countryAndCityFormat.split(",");

    return {
        country: country.trim(),
        city: cityParts.join(",").trim(),
    };
}
