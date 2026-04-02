import popupStyle from '@app/styles/popup.module.css'

const Popup = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className={popupStyle.popupOverlay}>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Popup;