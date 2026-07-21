import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  isDanger = true,
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="w-full max-w-sm overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 15, 26, 0.98)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '1.25rem',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
            </div>
            <div className="p-5 bg-white/[0.02] border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary px-4 py-2 text-xs"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl font-bold text-xs text-white transition-all ${
                  isDanger
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
