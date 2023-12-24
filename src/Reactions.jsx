import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getFirestore, deleteDoc, doc, collection, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import './Reactions.css';

const db = getFirestore(firebaseApp);

const Reactions = ({ hotdog, user }) => {

    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userReaction, setUserReaction] = useState(null);

    useEffect(() => {
        const fetchAndSetReactions = async () => {
            const reactions = await fetchReactions(hotdog.id);
            setLikes(reactions.likes);
            setDislikes(reactions.dislikes);
            const reaction = await getUserReaction(hotdog.id, user.uid);
            setUserReaction(reaction);
        };

        fetchAndSetReactions();
    }, [hotdog.id, user.uid]);

    async function fetchReactions(hotdogId) {
        const hotdogRef = doc(db, 'hotdogs', hotdogId);
        const reactionsRef = collection(hotdogRef, 'reactions');
        const reactionsSnapshot = await getDocs(reactionsRef);

        let likes = 0;
        let dislikes = 0;

        reactionsSnapshot.forEach((doc) => {
            const reaction = doc.data();
            if (reaction.reactionType === 'like') likes++;
            if (reaction.reactionType === 'dislike') dislikes++;
        });

        return { likes, dislikes };
    }

    async function getUserReaction(hotdogId, userId) {
        const hotdogRef = doc(db, 'hotdogs', hotdogId);
        const reactionsRef = collection(hotdogRef, 'reactions');
        const userReactionRef = doc(reactionsRef, `${hotdogId}_${userId}`);
        const userReactionDoc = await getDoc(userReactionRef);

        if (userReactionDoc.exists()) {
            const userReactionData = userReactionDoc.data();
            return userReactionData.reactionType;
        } else {
            return null;
        }
    }

    const handleReaction = async (reactionType) => {
        try {
            console.log(`User clicked ${reactionType} for hotdog with id ${hotdog.id}`);
            const hotdogRef = doc(db, 'hotdogs', hotdog.id);
            const reactionsRef = collection(hotdogRef, 'reactions');
            console.log(reactionsRef);
            const userReactionRef = doc(reactionsRef, `${hotdog.id}_${user.uid}`);
            const userReactionDoc = await getDoc(userReactionRef);

            if (userReactionDoc.exists()) {
                const userReactionData = userReactionDoc.data();
                if (userReactionData.reactionType === reactionType) {
                    await deleteDoc(userReactionRef);
                    if (reactionType === 'like') {
                        setLikes(likes - 1);
                    } else {
                        setDislikes(dislikes - 1);
                    }
                } else {
                    await setDoc(userReactionRef, {
                        hotdogId: hotdog.id,
                        uid: user.uid,
                        reactionType,
                    });
                    if (reactionType === 'like') {
                        setLikes(likes + 1);
                        if (userReactionData.reactionType === 'dislike') {
                            setDislikes(dislikes - 1);
                        }
                    } else {
                        setDislikes(dislikes + 1);
                        if (userReactionData.reactionType === 'like') {
                            setLikes(likes - 1);
                        }
                    }
                }
            } else {
                await setDoc(userReactionRef, {
                    hotdogId: hotdog.id,
                    uid: user.uid,
                    reactionType,
                });
                if (reactionType === 'like') {
                    setLikes(likes + 1);
                } else {
                    setDislikes(dislikes + 1);
                }
            }
        } catch (error) {
            console.error('Error updating reaction: ', error);
        }
    };

    return (
        <div className="reactions">
            <button
                className={`reaction-button ${userReaction === 'like' ? 'liked' : ''}`}
                onClick={() => handleReaction('like')}
            >
                Like {likes}
            </button>
            <button
                className={`reaction-button ${userReaction === 'dislike' ? 'disliked' : ''}`}
                onClick={() => handleReaction('dislike')}
            >
                Dislike {dislikes}
            </button>
        </div>
    );
}

Reactions.propTypes = {
    hotdog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default Reactions;
