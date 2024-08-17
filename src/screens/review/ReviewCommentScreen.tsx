import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
import useCommentModal from '../../hooks/useCommentModal'
import { CommentModal } from '../../components'
// Redux
import { AppDispatch } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { currentUser } from '../../redux/user/userSlice';
import store from '../../redux/store';

interface user {
  id: number,
  username: string,
  avatar: string
}

interface comment {
  id: number,
  content: string,
  is_shop: boolean,
  is_parent: boolean,
  parent_comment: number | null
}

interface Comment {
  user: user,
  comment: comment
}

const emptyComment: Comment = {
  user: {
    id: 0,
    username: '',
    avatar: ''
  },
  comment: {
    id: 0,
    content: '',
    is_shop: false,
    is_parent: false,
    parent_comment: null
  }
};

const ReviewCommentScreen = ({ route }: { route: any }) => {
  // Get currentUser
  const dispatch = useDispatch<AppDispatch>()
  if (!store.getState().user.info) {
    console.log('userInfo', store.getState().user.info)
    dispatch(currentUser());
  }

  const productId: number = route.params?.productId;
  const [loading, setLoading] = useState(true)
  // Fetch Comment
  const [selectedComment, setSelectedComment] = useState<Comment>(emptyComment)
  const [parentComment, setParentComment] = useState<Comment[]>([]);
  const [expandedComment, setExpandedComment] = useState<Comment[]>([]);
  // Send comment
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { isModalVisible, isUpdateComment, isDeleteComment,
    toggleModal, toggleUpdateComment, toggleDeleteComment } = useCommentModal();

  const handleReplyPress = (id: number | null) => {
    setReplyTo(replyTo === id ? null : id); // Toggle the reply state
  };

  const fetchParentComment = async () => {
    try {
      if (!loading)
        setLoading(true)
      const axiosInstance = await authAPI();
      const response = await axiosInstance.get(endpoints.products_comments(productId));
      if (response.status === 200 && response.data) {
        setParentComment(response.data);
      } else {
        console.error('Error: response.data is empty');
      }

    } catch (error) {
      console.error('Error fetching parentComments:', error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = () => {
    fetchParentComment();
  };

  const fetchChildComment = async (productId: number, parentCommentId: number) => {
    try {
      const response = await api.get(endpoints.products_child_comments(productId, parentCommentId));
      if (response.status === 200 && response.data) {
        setExpandedComment(prevState => ({
          ...prevState,
          [parentCommentId]: response.data
        }));
      } else {
        console.error('Error: response.data is empty');
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
    }
  };

  const handleToggle = (productId: number, parentCommentId: number) => {
    if (expandedComment[parentCommentId]) {
      setExpandedComment(prevState => {
        const newState = { ...prevState };
        delete newState[parentCommentId];
        return newState;
      });
    } else {
      fetchChildComment(productId, parentCommentId);
    }
  };

  useEffect(() => {
    fetchParentComment();
  }, [productId]);


  useEffect(() => {
    if (isUpdateComment) {
      setComment(selectedComment.comment.content)
    }
    if (isDeleteComment) {
      Alert.alert(
        "Warning",
        "Do you want to delete this comment?",
        [
          {
            text: "Oke",
            onPress: async () => {
              try {
                const body = {
                  "comment_id": selectedComment.comment.id,
                }
                const axiosInstance = await authAPI();
                const response = await axiosInstance.delete(endpoints.products_comments(productId), { data: body });
                if (response.status === 204) {
                  if (!selectedComment.comment.parent_comment) {
                    fetchParentComment()
                  }
                  else {
                    if (selectedComment.comment.is_parent) {
                      handleToggle(productId, selectedComment.comment.parent_comment)
                      fetchChildComment(productId, selectedComment.comment.parent_comment)
                    }
                    else {
                      handleToggle(productId, selectedComment.comment.parent_comment)
                    }
                    fetchParentComment()
                  }
                }
              } catch (error) {
                console.error('Error deleting comment:', error);
              }
              finally {
                if (isDeleteComment) {
                  toggleDeleteComment()
                }
              }
            }
          },
          {
            text: "Cancel"
          }
        ]
      );
    }
  }, [isUpdateComment, isDeleteComment])

  const renderChildComment = (parentCommentId: number, childComment: any) => (
    childComment.map((item: Comment) => (
      <View style={[styles.commentContainer, styles.childCommentContainer]} key={item.comment.id.toString()}>
        <TouchableOpacity
          onLongPress={() => {
            if (store.getState().user.info?.id === item.user.id) {
              toggleModal();
              setSelectedComment(item);
            }
          }}
        >
          <View style={styles.userContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
          <View style={styles.wrapUserComment}>
            <Text style={styles.commentContent}>{item.comment.content}</Text>
          </View>
          {/* interactComment */}
          <View style={styles.interactComment}>
            {
              item.comment.is_parent &&
              <TouchableOpacity onPress={() => handleToggle(productId, item.comment.id)}>
                <Text style={styles.replyComment}>
                  {expandedComment[item.comment.id] ? 'Collapse' : 'View All'}
                </Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => handleReplyPress(item.comment.id)}>
              <Text style={styles.replyComment}>Reply</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {expandedComment[item.comment.id] &&
          renderChildComment(item.comment.id, expandedComment[item.comment.id])}
      </View>
    ))
  );

  const renderParentComment = (comment: Comment) => (
    <View style={styles.commentContainer} key={comment.comment?.id.toString()}>
      <TouchableOpacity
        onLongPress={() => {
          if (store.getState().user.info?.id === comment.user.id) {
            toggleModal();
            setSelectedComment(comment);
          }
        }}
      >
        <View style={styles.userContainer}>
          <Image source={{ uri: comment.user?.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{comment.user?.username}</Text>
        </View>
        <View style={styles.wrapUserComment}>
          <Text style={styles.commentContent}>{comment.comment?.content}</Text>
        </View>
        {/* interactComment */}
        <View style={styles.interactComment}>
          {
            comment.comment.is_parent &&
            <TouchableOpacity onPress={() => handleToggle(productId, comment.comment?.id)}>
              <Text style={styles.replyComment}>
                {expandedComment[comment.comment.id] ? 'Collapse' : 'View All'}
              </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => handleReplyPress(comment.comment?.id)} >
            <Text style={styles.replyComment}>Reply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* childComment */}
      {
        expandedComment[comment.comment.id] &&
        renderChildComment(comment.comment.id, expandedComment[comment.comment?.id])
      }
    </View >
  );

  const handleSendComment = async () => {
    if (!comment.trim()) {
      setComment('')
      setReplyTo(null)
      return
    }

    try {
      const axiosInstance = await authAPI();
      // Check method
      if (isUpdateComment) {
        const body = {
          "content": comment,
          "comment_id": selectedComment.comment.id,
        }
        await axiosInstance.patch(endpoints.products_comments(productId), body);
        // Refresh comment
        selectedComment.comment.content = body.content
      }
      if (!isUpdateComment && !isDeleteComment) {
        const body = {
          "content": comment,
          "parent_comment": replyTo ? replyTo : null,
        }

        await axiosInstance.post(endpoints.products_comments(productId), body);
        if (body.parent_comment) {
          fetchChildComment(productId, body.parent_comment)
        }
        fetchParentComment()
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {

      if (comment) {
        setComment('')
      }
      if (replyTo) {
        setReplyTo(null)
      }
      if (selectedComment) {
        setSelectedComment(emptyComment)
      }
      if (isUpdateComment) {
        toggleUpdateComment()
      }
      if (loading) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      {/* commentList */}
      <ScrollView
        style={styles.styleScrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {parentComment ? parentComment.map((comment) => renderParentComment(comment)) :
          <Text>Not found</Text>}
      </ScrollView>

      {/* inputComment */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder={replyTo ? `Reply to comment id ${replyTo}` : "Write comment..."}
        />
        <Button title="Send" onPress={handleSendComment} />
      </View>

      {/* openModal */}
      {isModalVisible && (
        <CommentModal
          visible={isModalVisible}
          toggleModal={toggleModal}
          toggleUpdateComment={toggleUpdateComment}
          toggleDeleteComment={toggleDeleteComment}
        />
      )}
    </>
  )
}

export default ReviewCommentScreen

const styles = StyleSheet.create({
  styleScrollView: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  commentContainer: {
    paddingVertical: 10,
    borderTopWidth: 0.2,
    borderTopColor: '#ccc',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  wrapUserComment: {
    marginLeft: 45,
    marginTop: 5,
    paddingRight: 5,
  },
  commentContent: {
    fontSize: 14,
    fontWeight: '400',
    color: "#6d6969",
    flexWrap: 'wrap'
  },
  // ChildComment
  childCommentContainer: {
    paddingLeft: 40,
    backgroundColor: 'powderblue',
    borderRadius: 20,
    marginTop: 10,
  },
  // Interaction
  interactComment: {
    flexDirection: 'row',
  },
  replyComment: {
    color: 'blue',
    marginTop: 5,
    marginRight: 5
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
});