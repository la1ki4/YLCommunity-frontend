import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import {Text} from "@shared/Text/Text.jsx";
import CalendarPopup from "@widgets/Popup/CalendarPopup.jsx";
import {useUserFullName} from "@features/get-calendar-user/load/getUserFullname.js";

import userIcon from "@app/assets/user.svg";

import {useEventPopupForm} from "@widgets/Calendars/EventPopup/model/useEventPopupForm.js";
import {EventDateTimeSection} from "@widgets/Calendars/EventPopup/ui/EventDateTimeSection.jsx";
import {EventLocationField} from "@widgets/Calendars/EventPopup/ui/EventLocationField.jsx";
import {EventDescriptionField} from "@widgets/Calendars/EventPopup/ui/EventDescriptionField.jsx";

export function EventPopup({isOpen, onClose}) {
    const {userFullName} = useUserFullName();
    const form = useEventPopupForm({onClose});

    return (
        <CalendarPopup isOpen={isOpen} onClose={onClose}>
            <form className={eventsPageStyle.createPopup} onSubmit={form.handlers.handleSubmit}>
                <div className={eventsPageStyle.titleCreateBlock}>
                    <InputField
                        placeholder="Add title"
                        className={eventsPageStyle.titleCreate}
                        value={form.values.title}
                        onChange={(e) => form.setters.setTitle(e.target.value)}
                    />
                </div>

                <EventDateTimeSection
                    values={form.values}
                    setters={form.setters}
                    refs={form.refs}
                    handlers={form.handlers}
                />

                <div className={eventsPageStyle.createSection}>
                    <Media image={userIcon}/>
                    <div className={eventsPageStyle.createOwnerBlock} style={{marginLeft: "25px"}}>
                        <Text
                            className={eventsPageStyle.s_text}
                            text="Owner"
                            style={{color: "rgba(255,255,255,0.25)"}}
                        />
                        <Text
                            className={eventsPageStyle.s_text}
                            text={userFullName}
                            style={{color: "rgba(255,255,255,0.5)"}}
                        />
                    </div>
                </div>

                <EventLocationField
                    values={form.values}
                    setters={form.setters}
                    refs={form.refs}
                />

                <EventDescriptionField
                    description={form.values.description}
                    setDescription={form.setters.setDescription}
                />

                <button type="submit">Save</button>
            </form>
        </CalendarPopup>
    );
}
