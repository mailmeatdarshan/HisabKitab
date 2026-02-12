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
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-[92vw] max-w-md shadow-2xl p-5 md:p-10 relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="block w-full mb-6 px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition"
                        disabled={loading}
                    />
                    <textarea
                        placeholder="Type your message here..."
                        rows={8}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="block w-full px-5 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black transition flex-1"
                        disabled={loading}
                    />
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 bg-black text-white font-bold py-3 rounded-lg shadow hover:bg-white hover:text-black border-2 border-black transition"
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 bg-white text-black font-bold py-3 rounded-lg shadow hover:bg-black hover:text-white border-black border-2  transition"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-2xl">
                            <div className="loader border-4 border-black border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
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
