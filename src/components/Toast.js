// src/components/Toast.js
const Toast = ({ message, type }) => {
    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
};

export default Toast;