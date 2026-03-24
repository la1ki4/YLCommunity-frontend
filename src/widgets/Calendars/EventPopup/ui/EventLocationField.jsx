import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import mapIcon from "@app/assets/map-pin.svg";

export function EventLocationField({values, setters, refs}) {
    const {country, countries, isOpenCountry} = values;
    const {setCountry, setIsOpenCountry} = setters;
    const {countryRef, activeCountryRef} = refs;

    return (
        <div className={eventsPageStyle.createSection}>
            <Media image={mapIcon}/>
            <div className={eventsPageStyle.locationWrapper} style={{marginLeft: "25px"}} ref={countryRef}>
                <InputField
                    className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => setIsOpenCountry(true)}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsOpenCountry(true);
                    }}
                    style={{cursor: "pointer", width: "100%", padding: "8px"}}
                />

                {isOpenCountry && (
                    <div className={eventsPageStyle.locationDropdown}>
                        {countries.map((item) => (
                            <div
                                key={item}
                                ref={item === country ? activeCountryRef : null}
                                className={eventsPageStyle.locationOption}
                                onMouseDown={() => {
                                    setCountry(item);
                                    setIsOpenCountry(false);
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
