import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import mapIcon from "@app/assets/map-pin.svg";

const MAX_LOCATION_LENGTH = 17;

function truncateLocation(value) {
    if (value.length <= MAX_LOCATION_LENGTH) {
        return value;
    }

    return `${value.slice(0, MAX_LOCATION_LENGTH)}...`;
}

export function EventLocationField({values, setters, refs}) {
    const {country, locationOptions, isOpenCountry} = values;
    const {setCountry, setIsOpenCountry} = setters;
    const {countryRef, activeCountryRef} = refs;
    const displayCountry = truncateLocation(country);

    return (
        <div className={eventsPageStyle.createSection}>
            <Media image={mapIcon}/>
            <div className={eventsPageStyle.locationWrapper} ref={countryRef}>
                <InputField
                    className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                    value={displayCountry}
                    readOnly
                    title={country}
                    onFocus={() => setIsOpenCountry(true)}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsOpenCountry(true);
                    }}
                    style={{cursor: "pointer", padding: "8px 0px"}}
                />

                {isOpenCountry && (
                    <div className={eventsPageStyle.locationDropdown}>
                        {locationOptions.map((item) => (
                            <div
                                key={item}
                                ref={item === country ? activeCountryRef : null}
                                className={eventsPageStyle.locationOption}
                                title={item}
                                onMouseDown={() => {
                                    setCountry(item);
                                    setIsOpenCountry(false);
                                }}
                            >
                                {truncateLocation(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
