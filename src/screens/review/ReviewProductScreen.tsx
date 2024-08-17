import React, { useState } from 'react'
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from '../../constants/colors'

const renderStars = (rating: number) => {
    const stars = Array.from({ length: Math.round(rating) }, (_, index) => index + 1);
    return stars.map((star, index) => (
        <FontAwesome
            key={index}
            name={"star"}
            size={12}
            color="#e7700d"
            style={{ marginRight: 2 }}
        />
    ));
};

const renderProductReview = (item: any) => {
    const { user: { username, avatar }, rating: { id, star }, comment: { content, is_parent, parent_comment } } = item;

    return (
        <View style={styles.containerUserCommentRating} key={id}>
            <View style={styles.wrapUserRating}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Image
                        source={{ uri: avatar }}
                        style={styles.avatarUser}
                    />
                    <View style={styles.wrapUserNameRating}>
                        <Text style={{ fontSize: 12, fontWeight: "500" }}>{username}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {renderStars(star)}
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                        name={"like2"}
                        size={16}
                        style={{ marginRight: 2 }}
                    />
                </View>
            </View>

            <View style={styles.wrapUserComment}>
                <Text style={{ color: "#6d6969", flexWrap: 'wrap' }}>{content}</Text>
            </View>
            {
                item.comment.is_parent &&
                <View style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={styles.wrapUserRating}>
                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                            <Image
                                source={{ uri: item.comment.children.user.avatar }}
                                style={styles.avatarUser}
                            />
                            <View style={styles.wrapUserNameRating}>
                                <Text style={{ fontSize: 12, fontWeight: "500" }}>
                                    {item.comment.children.user.username}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.wrapUserComment}>
                        <Text style={{ color: "#6d6969", flexWrap: 'wrap' }}>{item.comment.children.comment.content}</Text>
                    </View>
                </View>

            }
        </View>
    );
};

const ReviewProductScreen = ({ route }: { route: any }) => {
    const productReview = route.params?.productReview
    const productRating = route.params?.productRating

    return (
        <>
            <View style={[styles.containerCommentsRatings, styles.wrapCommentsRatingsHeader]}>
                <View>
                    <View style={styles.commentsRatingsTitle}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            textTransform: 'capitalize',
                        }}>Product Reviews</Text>
                    </View>
                    <View style={styles.commentsRatingsTitleDetail}>
                        <View style={styles.wrapProductRating}>
                            <FontAwesome
                                name={"star"}
                                size={10}
                                color={colors.darkOrange}
                            />
                            <Text style={{ fontSize: 10, marginLeft: 5, color: colors.darkRed }}>{productRating}/5</Text>
                        </View>
                        <View style={styles.wrapTotalProductRating}>
                            <Text style={{ fontSize: 10, color: colors.lightGray }}>(Total {productReview.length} ratings)</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.containerCommentsRatings}>
                {productReview.map((review: { review: any }) => renderProductReview(review))}
            </ScrollView>
        </>
    )
}

export default ReviewProductScreen

const styles = StyleSheet.create({
    containerCommentsRatings: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    wrapCommentsRatingsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    commentsRatingsTitle: {},
    commentsRatingsTitleDetail: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    wrapProductRating: {
        flexDirection: "row",
        alignItems: "center",
    },
    wrapTotalProductRating: {
        marginLeft: 5,
    },
    btnCommentsRatingsViewAll: {
        flexDirection: "row",
        alignItems: "center",
    },

    // Component userCommentRating
    containerUserCommentRating: {
        paddingVertical: 8,
        borderTopWidth: 0.2,
        borderTopColor: "#ccc",
    },
    wrapUserRating: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatarUser: {
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    wrapUserNameRating: {
        marginLeft: 5,
    },
    wrapUserComment: {
        marginLeft: 45,
        marginTop: 5,
    },
})