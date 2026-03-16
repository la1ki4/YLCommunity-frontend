import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Text} from "@shared/Text/Text.jsx";

export function EventTimezoneField({values, setters, refs}) {
    const {timeZone, isOpenTimeZone, gmtOptions} = values;
    const {setTimeZone, setIsOpenTimeZone} = setters;
    const {timeZoneRef, activeTimeZoneRef} = refs;

    return (
        <div className={`${eventsPageStyle.createBlock} ${eventsPageStyle.timeZoneBlock}`} ref={timeZoneRef}>
            <Text text="Time zone" className={eventsPageStyle.d_text} style={{marginBottom: "5px"}}/>
            <InputField
                className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.timeZone} ${eventsPageStyle.d_text}`}
                value={timeZone}
                tabIndex={-1}
                onChange={(e) => setTimeZone(e.target.value)}
                onFocus={() => setIsOpenTimeZone(true)}
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsOpenTimeZone(true);
                }}
                style={{cursor: "pointer", padding: "8px"}}
                readOnly
            />

            {isOpenTimeZone && (
                <div className={eventsPageStyle.timeZoneDropdown}>
                    {gmtOptions.map((zone) => (
                        <div
                            key={zone}
                            ref={zone === timeZone ? activeTimeZoneRef : null}
                            className={eventsPageStyle.timeZoneOption}
                            onMouseDown={() => {
                                setTimeZone(zone);
                                setIsOpenTimeZone(false);
                            }}
                        >
                            {zone}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
