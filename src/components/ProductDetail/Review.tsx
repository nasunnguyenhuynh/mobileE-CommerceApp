import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
import { authAPI, endpoints } from "../../utils/api";
import { colors } from "../../constants/colors";
//navigation
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
const Review = ({ productId = 0, shopId = 0, productRating = 0 }:
  { productId: number, shopId: number, productRating: number }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [productReview, setProductReview] = useState([]);
  const [shopReview, setShopReview] = useState([]);
  const [shopRating, setShopRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const axiosInstance = await authAPI();
        const response = await axiosInstance.get(endpoints.productReview(productId));
        const response2 = await axiosInstance.get(endpoints.shopReview(shopId));
        const response3 = await axiosInstance.get(endpoints.shop_id(shopId));
        if (response.status === 200 && response.data) {
          // console.log('Review.tsx ', response.data) 
          setProductReview(response.data);
        }
        if (response2.status === 200 && response2.data) {
          // console.log('shopReview ', response.data) 
          setShopReview(response2.data);
        }
        if (response3.status === 200 && response3.data) {
          // console.log('shopReview ', response.data) 
          setShopRating(response3.data.shop_rating);
        }
      } catch (error) {
        console.error(`Error fetching reviews for product ID ${productId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const productType = "Colors Size"


  return (
    <View style={styles.containerReview}>
      <View style={styles.wrapReviewHeader}>
        <View>
          <View style={styles.reviewTitle}>
            <Text style={{
              fontSize: 16,
              fontWeight: "500",
              textTransform: 'capitalize',
            }}>Product Ratings</Text>
          </View>
          <View style={styles.reviewTitleDetail}>
            <View style={styles.wrapProductRating}>
              <FontAwesome
                name={"star"}
                size={10}
                color={colors.darkOrange}
              />
              <Text style={{ fontSize: 10, marginLeft: 5, color: colors.darkRed }}>
                {productRating}/5</Text>
            </View>
            <View style={styles.wrapTotalProductRating}>
              <Text style={{ fontSize: 10, color: colors.lightGray }}>(Total {productReview?.length} ratings)</Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.btnReviewViewAll}
            onPress={() => {
              navigation.navigate('ReviewNavigator', {
                screen: 'ReviewScreen',
                params: {
                  productReview: productReview, shopReview: shopReview,
                  productRating: productRating, shopRating: shopRating,
                  productId: productId
                }
              })
            }}
          >
            <Text style={{ color: colors.darkOrange }}>View all</Text>
            <AntDesign
              name={"right"}
              size={14}
              color={colors.darkOrange}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Start Loop */}
      {
        productReview.slice(0, 2).map((item) => { // GET 2 element in review[]
          const { comment: { content }, user: { username, avatar }, rating: { id, star } } = item;
          const stars = Array.from({ length: Math.round(star) }, (_, index) => index + 1);

          return (
            <View style={styles.containerUserReview} key={id}>
              <View style={styles.wrapUserRating}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatarUser}
                  />
                  <View style={styles.wrapUserNameRating}>
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>{username}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {stars.map((star, index) => (
                        <FontAwesome
                          key={index}
                          name={"star"}
                          size={12}
                          color="#e7700d"
                          style={{ marginRight: 2 }}
                        />
                      ))}
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
                <Text style={{ color: "#6d6969", flexWrap: 'wrap' }}>Classification: {productType}</Text>
                <Text style={{ flexWrap: 'wrap' }}>{content}</Text>
              </View>
            </View>
          );
        })
      }
      {/* End Loop */}
    </View >
  )
}

export default Review

const styles = StyleSheet.create({
  // Component Comments_Ratings --> Using collapse
  containerReview: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wrapReviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  reviewTitle: {},
  reviewTitleDetail: {
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
  btnReviewViewAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Component userReview
  containerUserReview: {
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