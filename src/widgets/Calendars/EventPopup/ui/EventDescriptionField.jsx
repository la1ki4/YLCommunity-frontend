import eventsPageStyle from "@app/styles/events.module.css";
import {Media} from "@shared/Image/Media.jsx";
import {Text} from "@shared/Text/Text.jsx";
import descriptionIcon from "@app/assets/text-description.svg";

export function EventDescriptionField({description, setDescription, hasError = false}) {
    return (
        <>
            <div className={eventsPageStyle.createSection}>
                <Media image={descriptionIcon}/>
                <Text
                    className={eventsPageStyle.d_text}
                    text="Description"
                    style={{marginLeft: "25px"}}
                />
            </div>

            <textarea
                className={`${eventsPageStyle.createTextArea} ${eventsPageStyle.s_text} ${hasError ? eventsPageStyle.fieldError : ""}`}
                placeholder="Enter description . . ."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </>
    );
}
