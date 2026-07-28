import React, { useState } from 'react';
import styles from './AICommentSuggestions.module.css';
import { BASE_URL } from '@/config';

export default function AICommentSuggestions({ isOpen, onClose, postContent, onSelectComment, isDemo }) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setSuggestions([]);

        // 🔥 Demo mode: simulate AI with a realistic delay
        if (isDemo) {
            setTimeout(() => {
                setSuggestions([
                    "Great insights! Thanks for sharing your perspective on this — it really resonates with what I've been seeing in the industry lately.",
                    "This is such an important topic. I appreciate how you've framed the discussion and would love to hear more about your experience with this.",
                    "Couldn't agree more! The points you raised are spot-on. Would be great to connect and discuss this further — I'm working on something similar.",
                ]);
                setLoading(false);
            }, 1200);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/ai/generate-comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postContent: postContent,
                    token: localStorage.getItem('token')
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate suggestions');
            }

            // Parse the suggestions text into array
            const suggestionText = data.suggestions;
            const suggestionArray = suggestionText
                .split(/\d+\.\s+/)
                .filter(s => s.trim().length > 0)
                .map(s => s.trim());

            setSuggestions(suggestionArray);
        } catch (err) {
            console.error('Generation error:', err);
            setError(err.message || 'Failed to generate suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectComment = (comment) => {
        onSelectComment(comment);
        handleClose();
    };

    const handleClose = () => {
        setSuggestions([]);
        setError('');
        onClose();
    };

    // Auto-generate when modal opens
    React.useEffect(() => {
        if (isOpen && postContent) {
            handleGenerate();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>💬 AI Comment Suggestions {isDemo && <span className={styles.demoBadge}>Demo</span>}</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>×</button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <span className={styles.spinner}></span>
                            <p>Generating thoughtful comments...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.error}>
                            {error}
                            <button className={styles.retryBtn} onClick={handleGenerate}>
                                Try Again
                            </button>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <p className={styles.instruction}>Click on any comment to use it:</p>
                            <div className={styles.suggestionsContainer}>
                                {suggestions.map((suggestion, index) => (
                                    <div 
                                        key={index} 
                                        className={styles.suggestionCard}
                                        onClick={() => handleSelectComment(suggestion)}
                                    >
                                        <div className={styles.suggestionNumber}>{index + 1}</div>
                                        <p className={styles.suggestionText}>{suggestion}</p>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.actions}>
                                <button 
                                    className={styles.regenerateBtn}
                                    onClick={handleGenerate}
                                >
                                    🔄 Generate New Suggestions
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
