import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

interface CommentModalProps {
    visible: boolean;
    toggleModal: () => void;
    toggleUpdateComment: () => void
    toggleDeleteComment: () => void
}

const CommentModal: React.FC<CommentModalProps> = ({ visible, toggleModal, toggleUpdateComment, toggleDeleteComment }) => {
    const transparent = 'rgba(0,0,0,0.5)';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: transparent,
                }}
            >
                <View style={{
                    position: "absolute",
                    bottom: 0,

                    backgroundColor: "white",
                    padding: 15,
                    width: "90%",
                    height: "50%",
                    borderRadius: 10,
                }}>
                    <TouchableOpacity onPress={toggleModal} style={{
                        zIndex: 1,
                        flexDirection: "row",
                        position: "absolute",
                        right: 10, top: 10,
                    }}>
                        <AntDesign
                            name={"close"}
                            size={30}
                            color={"black"}
                        />
                    </TouchableOpacity>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity style={styles.adjustComment}
                            onPress={() => {
                                toggleUpdateComment();
                                toggleModal();
                            }}>
                            <SimpleLineIcons
                                name={"pencil"}
                                size={30}
                                style={{ width: 30 }}
                                color={"black"}
                            />
                            <Text style={styles.adjustCommentText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.adjustComment}
                            onPress={() => {
                                toggleDeleteComment();
                                toggleModal();
                            }}>
                            <Ionicons
                                name={"trash-outline"}
                                size={30}
                                style={{ width: 30 }}
                                color={"black"}
                            />
                            <Text style={styles.adjustCommentText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CommentModal

const styles = StyleSheet.create({
    adjustComment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    adjustCommentText: {
        marginLeft: 10
    }
})