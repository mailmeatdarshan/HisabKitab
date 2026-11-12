import axiosInstance from '../utils/data-access';
import React, { useState } from 'react';

const InputTextBoxModal = ({ isOpen, onClose }) => {
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !text) {
            alert("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.post("/expanses/send-summary", {
                subject,
                text,
            });
            if (response.status === 200) {
                alert("Email sent successfully.");
            } else {
                alert("Failed to send email.");
            }
            setSubject('');
            setText('');
            onClose();
        } catch (error) {
            alert("Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Send Summary Email</h3>
                <form className="flex flex-col flex-1 gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Monthly Expense Summary"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">
                            Message
                        </label>
                        <textarea
                            placeholder="Type your message or notes here..."
                            rows={6}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="block w-full px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C58D] bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-white text-sm transition flex-1"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#00C58D] hover:bg-[#00B07D] text-white font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-zinc-900/70 rounded-2xl">
                            <div className="loader border-4 border-[#00C58D] border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
                        </div>
                    )}
                </form>
            </div>
            <style>{`
                .loader {
                    border-top-color: transparent;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default InputTextBoxModal;
