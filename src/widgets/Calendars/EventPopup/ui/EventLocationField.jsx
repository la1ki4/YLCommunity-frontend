import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import mapIcon from "@app/assets/map-pin.svg";

export function EventLocationField({values, setters, refs}) {
    const {country, city, countries, citiesByCountry, isOpenCountry, isOpenCity} = values;
    const {setCountry, setCity, setIsOpenCountry, setIsOpenCity} = setters;
    const {countryRef, cityRef, activeCountryRef, activeCityRef} = refs;

    const currentCities = citiesByCountry[country] ?? [];

    return (
        <div className={eventsPageStyle.createSection}>
            <Media image={mapIcon}/>
            <div className={eventsPageStyle.locationFieldsColumn} style={{marginLeft: "25px"}}>
                <div className={eventsPageStyle.locationWrapper} ref={countryRef}>
                    <InputField
                        className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        onFocus={() => setIsOpenCountry(true)}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsOpenCountry(true);
                        }}
                        style={{cursor: "pointer", padding: "8px 0px"}}
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

                <div className={eventsPageStyle.locationWrapper} ref={cityRef}>
                    <InputField
                        className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onFocus={() => setIsOpenCity(true)}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsOpenCity(true);
                        }}
                        style={{cursor: "pointer", padding: "8px 0px"}}
                    />

                    {isOpenCity && (
                        <div className={eventsPageStyle.locationDropdown}>
                            {currentCities.map((item) => (
                                <div
                                    key={item}
                                    ref={item === city ? activeCityRef : null}
                                    className={eventsPageStyle.locationOption}
                                    onMouseDown={() => {
                                        setCity(item);
                                        setIsOpenCity(false);
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
