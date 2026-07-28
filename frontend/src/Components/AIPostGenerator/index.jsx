import React, { useState } from 'react';
import styles from './AIPostGenerator.module.css';
import { BASE_URL } from '@/config';

export default function AIPostGenerator({ isOpen, onClose, onGenerate, isDemo }) {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('professional');
    const [loading, setLoading] = useState(false);
    const [generatedPost, setGeneratedPost] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedPost('');

        // 🔥 Demo mode: simulate AI with a realistic delay
        if (isDemo) {
            setTimeout(() => {
                const demoResponse = `I'm excited to share some thoughts on ${topic.trim()}! This is a topic that's been on my mind lately, and I believe it's crucial for professionals in our field to engage with it meaningfully. 

The landscape around ${topic.trim()} is evolving rapidly, and staying ahead means continuous learning and adaptation. I've seen firsthand how embracing new perspectives on this can transform the way we approach our work and collaborate with others.

What are your thoughts on ${topic.trim()}? I'd love to hear different viewpoints and experiences from this amazing community. Let's start a conversation!`;
                setGeneratedPost(demoResponse);
                setLoading(false);
            }, 1500);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/ai/generate-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic.trim(),
                    tone: tone,
                    token: localStorage.getItem('token')
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate post');
            }

            setGeneratedPost(data.generatedPost);
        } catch (err) {
            console.error('Generation error:', err);
            setError(err.message || 'Failed to generate post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUsePost = () => {
        if (generatedPost) {
            onGenerate(generatedPost);
            handleClose();
        }
    };

    const handleClose = () => {
        setTopic('');
        setTone('professional');
        setGeneratedPost('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>✨ AI Post Generator {isDemo && <span className={styles.demoBadge}>Demo</span>}</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>×</button>
                </div>

                <div className={styles.content}>
                    {!generatedPost ? (
                        <>
                            <div className={styles.inputGroup}>
                                <label>What's your post about?</label>
                                <input
                                    type="text"
                                    placeholder="e.g., remote work productivity, AI in healthcare, career growth tips..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className={styles.topicInput}
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Tone</label>
                                <select 
                                    value={tone} 
                                    onChange={(e) => setTone(e.target.value)}
                                    className={styles.toneSelect}
                                    disabled={loading}
                                >
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="inspirational">Inspirational</option>
                                    <option value="educational">Educational</option>
                                    <option value="humorous">Humorous</option>
                                </select>
                            </div>

                            {error && (
                                <div className={styles.error}>
                                    {error}
                                </div>
                            )}

                            <button 
                                className={styles.generateBtn} 
                                onClick={handleGenerate}
                                disabled={loading || !topic.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Generating...
                                    </>
                                ) : (
                                    '✨ Generate Post'
                                )}
                            </button>

                            <p className={styles.hint}>
                                💡 Tip: Be specific about your topic for better results
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={styles.resultSection}>
                                <label>Generated Post</label>
                                <textarea
                                    value={generatedPost}
                                    onChange={(e) => setGeneratedPost(e.target.value)}
                                    className={styles.generatedText}
                                    rows={12}
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.6',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                    }}
                                />
                            </div>

                            <div className={styles.actions}>
                                <button 
                                    className={styles.regenerateBtn}
                                    onClick={handleGenerate}
                                    disabled={loading}
                                >
                                    🔄 Regenerate
                                </button>
                                <button 
                                    className={styles.useBtn}
                                    onClick={handleUsePost}
                                >
                                    ✓ Use This Post
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
