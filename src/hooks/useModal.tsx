import { useState } from 'react';

const useModal = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!isModalVisible);
    
    return {
        isModalVisible,
        toggleModal
    };
};

export default useModal;