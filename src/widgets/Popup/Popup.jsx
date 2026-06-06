import popupStyle from '@app/styles/popup.module.css'

const Popup = ({isOpen, onClose, children, style}) => {
    if (!isOpen) return null;

    return (
        <div className={popupStyle.popupOverlay}
             style={style}
             onClick={onClose}>
            {children}
        </div>
    );
};

export default Popup;