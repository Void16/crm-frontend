const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700';

  return (
    <div className={`border px-4 py-3 rounded mb-4 ${bgColor}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;