import calendarPopupStyle from '@app/styles/popup.module.css';

const CalendarPopup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className={calendarPopupStyle.backdrop}
            onClick={onClose}
        >
            <div
                className={calendarPopupStyle.calendarPopupOverlay}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default CalendarPopup;
