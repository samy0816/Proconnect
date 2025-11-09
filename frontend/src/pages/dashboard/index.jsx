import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  getallPosts,
  createPost,
  deletePost,
  getAllComments,
  postComment,
  incrementPostLike
} from '@/config/redux/action/postAction';
import { reset as resetPost } from '@/config/redux/action/middleware/reducer/Postreducer';
import { useSelector, useDispatch } from 'react-redux';
import { getAboutUser, getallUsers } from '@/config/redux/action/authAction';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import AIPostGenerator from '@/Components/AIPostGenerator';
import AICommentSuggestions from '@/Components/AICommentSuggestions';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { FaPhotoVideo, FaRegThumbsUp, FaRegCommentDots, FaShare, FaTrash } from 'react-icons/fa';

export default function Dashboard() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const postState = useSelector((state) => state.post);

    const [postContent, setPostContent] = useState('');
    const [fileContent, setFileContent] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [showAICommentModal, setShowAICommentModal] = useState(false);
    const [currentPostForComment, setCurrentPostForComment] = useState(null);

    useEffect(() => {
        if (authState.isTokenthere) {
            dispatch(getallPosts());
            dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        }
        if (!authState.all_profiles_fetched) {
            dispatch(getallUsers());
        }
    }, [authState.isTokenthere, dispatch, authState.all_profiles_fetched]);

    const handleUpload = async () => {
        if (!postContent && !fileContent) return;
        await dispatch(createPost({ file: fileContent, body: postContent }));
        setPostContent('');
        setFileContent(null);
        dispatch(getallPosts());
    };

    const handleAIGenerate = (generatedText) => {
        setPostContent(generatedText);
    };

    const handleAICommentSelect = (comment) => {
        setCommentText(comment);
    };

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.feed}>
                    <div className={styles.createPostContainer}>
                        <img
                            className={styles.userProfileImage}
                            src={authState.user?.profilePicture ? `${BASE_URL}/uploads/${authState.user.profilePicture}` : '/images/default-profile.png'}
                            alt="Profile"
                        />
                        <div className={styles.postInputWrapper}>
                            <textarea
                                onChange={(e) => setPostContent(e.target.value)}
                                value={postContent}
                                placeholder={`What's on your mind, ${authState.user?.name?.split(' ')[0] || ''}?`}
                                className={styles.postTextarea}
                            />
                            <div className={styles.postActions}>
                                <label htmlFor="fileUpload" className={styles.actionButton}>
                                    <FaPhotoVideo color="#70B5F9" />
                                    <span>Photo/Video</span>
                                </label>
                                <input
                                    onChange={(e) => setFileContent(e.target.files[0])}
                                    type="file"
                                    hidden
                                    id="fileUpload"
                                />
                                <button onClick={() => setShowAIModal(true)} className={`${styles.actionButton} ${styles.aiButton}`}>
                                    ✨ AI Generate
                                </button>
                                {postContent.length > 0 && (
                                    <button onClick={handleUpload} className={styles.postSubmitBtn}>
                                        Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <AIPostGenerator 
                        isOpen={showAIModal}
                        onClose={() => setShowAIModal(false)}
                        onGenerate={handleAIGenerate}
                    />

                    <AICommentSuggestions
                        isOpen={showAICommentModal}
                        onClose={() => {
                            setShowAICommentModal(false);
                            setCurrentPostForComment(null);
                        }}
                        postContent={currentPostForComment?.body || ''}
                        onSelectComment={handleAICommentSelect}
                    />

                    <div className={styles.postFeed}>
                        {postState.posts && postState.posts.length > 0 ? (
                            postState.posts.map((post) => {
                                if (!post.userId) return null;
                                return (
                                    <div key={post._id} className={styles.postCard}>
                                        <div className={styles.postHeader}>
                                            <img
                                                className={styles.userProfileImage}
                                                src={post.userId.profilePicture ? `${BASE_URL}/uploads/${post.userId.profilePicture}` : '/images/default-profile.png'}
                                                alt="User"
                                            />
                                            <div>
                                                <p className={styles.postAuthorName}>{post.userId.name}</p>
                                                <p className={styles.postAuthorUsername}>@{post.userId.username}</p>
                                            </div>
                                        </div>

                                        {post.body && <p className={styles.postBody}>{post.body}</p>}
                                        {post.media && post.media !== "" && (
                                            <div className={styles.postMedia}>
                                                <img src={`${BASE_URL}/${post.media}`} alt="Post media" />
                                            </div>
                                        )}

                                        <div className={styles.postFooter}>
                                            <button
                                                onClick={() => {
                                                    dispatch(incrementPostLike({ post_id: post._id }));
                                                    dispatch(getallPosts());
                                                }}
                                                className={styles.footerButton}
                                            >
                                                <FaRegThumbsUp /> <span>Like ({post.likes || 0})</span>
                                            </button>
                                            <button
                                                onClick={() => dispatch(getAllComments({ post_id: post._id }))}
                                                className={styles.footerButton}
                                            >
                                                <FaRegCommentDots /> <span>Comment</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const text = encodeURIComponent(post.body);
                                                    const url = encodeURIComponent(window.location.href);
                                                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                                                }}
                                                className={styles.footerButton}
                                            >
                                                <FaShare /> <span>Share</span>
                                            </button>
                                            {post.userId._id === authState.user?.id && (
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this post?')) {
                                                            await dispatch(deletePost({ post_id: post._id }));
                                                            await dispatch(getallPosts());
                                                        }
                                                    }}
                                                    className={`${styles.footerButton} ${styles.deleteButton}`}
                                                >
                                                    <FaTrash /> <span>Delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className={styles.noPosts}>No posts yet. Be the first to share something!</p>
                        )}
                    </div>
                </div>

                {postState.postId !== '' && (
                    <div onClick={() => dispatch(resetPost())} className={styles.commentsOverlay}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.commentsModal}>
                            <div className={styles.commentsHeader}>
                                <h2>Comments</h2>
                                <button onClick={() => dispatch(resetPost())} className={styles.closeCommentsBtn}>×</button>
                            </div>
                            
                            <div className={styles.commentsList}>
                                {postState.comments.length === 0 ? (
                                    <p className={styles.noComments}>No comments yet. Be the first!</p>
                                ) : (
                                    postState.comments.map((comment) => (
                                        <div className={styles.comment} key={comment._id}>
                                            <img src={`${BASE_URL}/uploads/${comment.userId?.profilePicture || 'default-profile.png'}`} alt="" />
                                            <div className={styles.commentBody}>
                                                <p className={styles.commentAuthor}>{comment.userId?.name}</p>
                                                <p>{comment.body}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className={styles.commentInputArea}>
                                <input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && commentText.trim()) {
                                            (async () => {
                                                await dispatch(postComment({ post_id: postState.postId, body: commentText }));
                                                await dispatch(getAllComments({ post_id: postState.postId }));
                                                setCommentText('');
                                            })();
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const currentPost = postState.posts.find(p => p._id === postState.postId);
                                        setCurrentPostForComment(currentPost);
                                        setShowAICommentModal(true);
                                    }}
                                    className={styles.aiCommentBtn}
                                    title="AI Suggestions"
                                >
                                    ✨
                                </button>
                                <button
                                    onClick={async () => {
                                        if (commentText.trim()) {
                                            await dispatch(postComment({ post_id: postState.postId, body: commentText }));
                                            await dispatch(getAllComments({ post_id: postState.postId }));
                                            setCommentText('');
                                        }
                                    }}
                                    className={styles.postCommentBtn}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </UserLayout>
    );
}
