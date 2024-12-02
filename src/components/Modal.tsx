import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseIcon?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseIcon = true,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-darkgrey rounded-[0.625rem] shadow-lg p-6 relative text-white max-w-[90vw] max-h-[90vh] min-w-[50vw] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseIcon && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal;
