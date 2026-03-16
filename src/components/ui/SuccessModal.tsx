import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Heart } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  transactionId?: string;
  amount?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  transactionId,
  amount 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl z-[210] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header/Banner */}
            <div className="h-24 sm:h-32 bg-brand-accent relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-brand-accent shadow-xl"
              >
                <CheckCircle2 size={32} className="sm:w-10 sm:h-10" />
              </motion.div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-10 pt-8 sm:pt-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-serif text-brand-900 mb-3 sm:mb-4">{title}</h3>
              <p className="text-sm sm:text-base text-brand-600 leading-relaxed mb-6 sm:mb-8">
                {message}
              </p>

              {/* Transaction Details Card */}
              {(transactionId || amount) && (
                <div className="bg-brand-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 sm:mb-10 space-y-3 sm:space-y-4">
                  {amount && (
                    <div className="flex justify-between items-center border-b border-brand-100/50 pb-3 sm:pb-4">
                      <span className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest">Amount Paid</span>
                      <span className="text-lg sm:text-xl font-serif text-brand-900">{amount}</span>
                    </div>
                  )}
                  {transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs font-bold text-brand-400 uppercase tracking-widest">Transaction ID</span>
                      <span className="text-xs sm:text-sm font-mono text-brand-700 bg-white px-2 sm:px-3 py-1 rounded-lg border border-brand-100 truncate max-w-[120px] sm:max-w-none">
                        {transactionId}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={onClose}
                  className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-2 group"
                >
                  <Heart size={18} className="group-hover:fill-white transition-all" />
                  Continue Your Journey
                </button>
                <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-bold">
                  A confirmation email has been sent to you
                </p>
              </div>
            </div>

            {/* Footer Decoration */}
            <div className="bg-brand-50 py-4 px-8 flex items-center justify-center gap-2 border-t border-brand-100">
              <span className="text-[10px] text-brand-300 font-bold uppercase tracking-widest italic">The Honeymooner</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
