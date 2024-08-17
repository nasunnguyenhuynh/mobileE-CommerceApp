import useModal from './useModal';
import { useState } from 'react';

const useCommentModal = () => {
    const modal = useModal(); // Using the base `useModal` hook

    const [isUpdateComment, setUpdateComment] = useState(false);
    const [isDeleteComment, setDeleteComment] = useState(false);

    const toggleUpdateComment = () => setUpdateComment(!isUpdateComment);
    const toggleDeleteComment = () => setDeleteComment(!isDeleteComment);

    return {
        ...modal, // Spread the properties from `useModal`
        isUpdateComment,
        isDeleteComment,
        toggleUpdateComment,
        toggleDeleteComment,
    };
};

export default useCommentModal;
