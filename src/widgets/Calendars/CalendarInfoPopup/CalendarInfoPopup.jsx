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

export function CalendarInfoPopup() {
    return (
        <div className={calendarInfoPopupStyle.calendarInfoPopup} style={{padding: "20px", width: "600px"}}>
            <div>
                <div className={calendarInfoPopupStyle.calendarInfoHeader}>
                    <Button className={calendarInfoButtonStyle.newPopupButton} leftIcon={<Media image={editIcon}/>}
                            style={{marginRight: "10px"}}></Button>
                    <Button className={calendarInfoButtonStyle.newPopupButton} leftIcon={<Media image={deleteIcon}/>}
                            style={{marginRight: "25px"}}></Button>
                    <Button className={calendarInfoButtonStyle.newPopupButton} style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "20px",
                    }}>✕</Button>
                </div>
                <div className={calendarInfoPopupStyle.iconTextSection}>
                    <Media src={signIcon} style={{marginRight: "20px"}}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Text
                            style={{
                                fontFamily: "Roboto-bold",
                                color: "white",
                                fontSize: "28px",
                                lineHeight: "1",
                                marginTop: "-5px"
                            }}
                            text={"Title"}
                        />
                        <Text style=
                                  {{
                                      fontFamily: "Roboto-regular",
                                      color: "white"
                                  }}
                              text={"April 2, 2026, 15:00 - April 2, 2026, 17:00"}/>
                        <Button
                            leftIcon={<Media image={linkIcon}/>}
                            className={calendarInfoButtonStyle.buttonWithBorder}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                width: "fit-content",
                                whiteSpace: "nowrap",
                                border: "1px solid #9EFF40",
                                borderRadius: "18px",
                                padding: "10px 16px",
                                margin: "30px 0",
                                gap: "8px"
                            }}
                        >
                            <Text
                                style={{
                                    color: "#9EFF40",
                                    fontFamily: "Roboto-regular",
                                    margin: 0
                                }}
                                text={"Invite via link"}
                            />
                        </Button>
                    </div>
                </div>
                <div className={calendarInfoPopupStyle.iconTextSection}>
                    <Media src={descriptionIcon} style={{marginRight: "20px", height: "18px"}}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Text style=
                                  {{
                                      fontFamily: "Roboto-regular",
                                      color: "white",
                                      lineHeight: "1",
                                  }}
                              text={" Lorem Ispum riba "}/>
                    </div>
                </div>
                <div className={calendarInfoPopupStyle.iconTextSection} style={{ marginTop: "15px"}}>
                    <Media src={locationIcon} style={{marginRight: "20px", height: "18px"}}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Text style=
                                  {{
                                      fontFamily: "Roboto-regular",
                                      color: "white",
                                      lineHeight: "1",
                                  }}
                              text={"Moldova, Chisinau"}/>
                    </div>
                </div>
                <div className={calendarInfoPopupStyle.iconTextSection} style={{ marginTop: "15px"}}>
                    <Media src={userIcon} style={{marginRight: "20px", height: "18px"}}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Text style=
                                  {{
                                      fontFamily: "Roboto-regular",
                                      color: "white",
                                      lineHeight: "1",
                                  }}
                              text={"Alexandros Papas"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}