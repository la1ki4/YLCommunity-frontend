import calendarInfoPopupStyle from "@app/styles/popup.module.css"
import {Button} from "@shared/Button/Button.jsx";
import calendarInfoButtonStyle from "@app/styles/button.module.css"
import editIcon from "@app/assets/edit.svg"
import deleteIcon from "@app/assets/delete.svg"
import signIcon from "@app/assets/sign.svg"
import linkIcon from "@app/assets/link.svg"
import locationIcon from "@app/assets/map-pin.svg"
import descriptionIcon from "@app/assets/text-description.svg"
import userIcon from "@app/assets/user.svg"
import {Media} from "@shared/Image/Media.jsx";
import {Text} from "@shared/Text/Text.jsx";

function formatEventDateRange(start, end) {
    if (!(start instanceof Date) || !(end instanceof Date)) {
        return "";
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function CalendarInfoPopup({event, position, onClose}) {
    if (!event) {
        return null;
    }

    const popupClassName = [
        calendarInfoPopupStyle.calendarInfoPopup,
        position?.placement === "above" ? calendarInfoPopupStyle.calendarInfoPopupAbove : "",
        position?.placement === "middle" ? calendarInfoPopupStyle.calendarInfoPopupMiddle : "",
        position?.placement === "below" ? calendarInfoPopupStyle.calendarInfoPopupBelow : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={popupClassName}
            style={{top: `${position?.top ?? 0}px`}}
            onClick={(event) => event.stopPropagation()}
        >
            <div className={calendarInfoPopupStyle.calendarInfoHeader}>
                <Button className={calendarInfoButtonStyle.newPopupButton} leftIcon={<Media image={editIcon}/>}/>
                <Button className={calendarInfoButtonStyle.newPopupButton} leftIcon={<Media image={deleteIcon}/>}/>
                <Button className={calendarInfoButtonStyle.calendarInfoCloseButton} onClick={onClose}>✕</Button>
            </div>
            <div className={calendarInfoPopupStyle.iconTextSection}>
                <Media image={signIcon} style={{marginRight: "20px"}}/>
                <div className={calendarInfoPopupStyle.calendarInfoContent}>
                    <Text className={calendarInfoPopupStyle.calendarInfoTitle} text={event.title ?? "Event"}/>
                    <Text className={calendarInfoPopupStyle.calendarInfoDate} text={formatEventDateRange(event.start, event.end)}/>
                    <Button leftIcon={<Media image={linkIcon}/>} className={calendarInfoButtonStyle.buttonWithBorder}>
                        <Text className={calendarInfoPopupStyle.calendarInfoInviteText} text={"Invite via link"}/>
                    </Button>
                </div>
            </div>
            <div className={calendarInfoPopupStyle.iconTextSection}>
                <Media image={descriptionIcon} style={{marginRight: "20px", height: "18px"}}/>
                <Text className={calendarInfoPopupStyle.calendarInfoBodyText} text={event.description || "No description"}/>
            </div>
            <div className={calendarInfoPopupStyle.iconTextSection}>
                <Media image={locationIcon} style={{marginRight: "20px", height: "18px"}}/>
                <Text className={calendarInfoPopupStyle.calendarInfoBodyText} text={event.country + ", " + event.city || "No location"}/>
            </div>
            <div className={calendarInfoPopupStyle.iconTextSection}>
                <Media image={userIcon} style={{marginRight: "20px", height: "18px"}}/>
                <Text className={calendarInfoPopupStyle.calendarInfoBodyText} text={event.owner.firstName + " " + event.owner.lastName || "Unknown organizer"}/>
            </div>
        </div>
    )
}
