export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[999]">
      <div className="bg-[#0d141f] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2"
          >
            ✕
          </button>
        </div>

        <div className="text-gray-300">{children}</div>
      </div>
    </div>
  );
}
