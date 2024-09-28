import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Entypo from "react-native-vector-icons/Entypo"
import { authAPI, endpoints } from "../../utils/api";
import { colors } from '../../constants/colors';
import uuid from 'react-native-uuid';
// components
import { Notify } from '../../components';
// interfaces
import { Detail } from '../../interfaces/order';
import { OrderDetail } from '../../interfaces/order';
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { ReviewStackParamList } from '../../routers/types';
type Props = StackScreenProps<ReviewStackParamList, 'ReviewFormScreen'>;
const ReviewFormScreen = ({ route, navigation }: Props) => { // route, navigation
  console.log('ReviewFormScreen');
  const orderDetail: OrderDetail = route.params as OrderDetail;
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1); // Create star_arr 1_5
  const meanings = ['', 'Bad', 'Unsatisfied', 'Normal', 'Good', 'Very good'];
  let shopId: number[] = [];
  let productId: number[] = [];

  const [openModel, setOpenModal] = useState(false);
  const [notifyText, setNotifyText] = useState('');
  const handleNotify = (notifyText: string) => {
    setNotifyText(notifyText)
    setOpenModal(true)
    const timeout = setTimeout(() => {
      setOpenModal(false)
    }, 800);

    return () => clearTimeout(timeout)
  }

  const renderProductReview = (orderDetail: Detail) => {
    if (!orderDetail.product_review && !productId.includes(orderDetail.product_id)) {
      productId.push(orderDetail.product_id);
    }
    else return null;
    const [isVisible, setIsVisible] = useState(true);
    // Product
    const [productStars, setProductStars] = useState(0);
    const [productMeaning, setProductMeaning] = useState('');
    const [productComment, setProductComment] = useState('');
    // chooseStar
    const handleProductStarPress = (index: number) => {
      if (productStars === index) {
        setProductStars(0);
        setProductMeaning('');
      } else {
        setProductStars(index);
        setProductMeaning(meanings[index]);
      }
    };
    // handleSendProductReview
    const [loading, setLoading] = useState(false);
    const handleSendProductReview = async () => {
      if (!productStars || !productComment) {
        handleNotify('Plz leave your stars and comments')
      }
      else {
        try {
          setLoading(true);
          const axiosInstance = await authAPI();
          const response = await axiosInstance.post(endpoints.productReview(orderDetail.product_id), {
            comment: productComment,
            rating: productStars,
            order: orderDetail.order_id,
          })
          if (response.status === 201 && response.data) {
            productId = productId.filter((id) => id !== orderDetail.product_id);
            if (productId.length === 0 && shopId.length === 0) {
              navigation.navigate('HomeNavigator', { screen: 'ProfileScreen' });
            }
            else {
              setIsVisible(false);
            }
          }
        } catch (error) {
          handleNotify('An error occured, plz try again later');
        } finally {
          setLoading(false);
        }
      }
    }
    return (
      <>
        {isVisible &&
          <View key={uuid.v4().toString()}>
            <View style={styles.container}>
              <View style={styles.containerProduct}>
                <Image
                  source={{ uri: orderDetail.product_img }}
                  style={styles.productImg}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text numberOfLines={2} ellipsizeMode='tail' style={styles.productName}>
                    {orderDetail.product_name}</Text>
                  {orderDetail.color_name &&
                    <Text style={styles.classification}>Classification: {orderDetail.color_name}</Text>}
                </View>
              </View>
              {/* FormRating */}
              <View style={styles.containerForm}>
                <View style={styles.quality}>
                  <Text style={{ color: '#000' }}>Quality</Text>
                  <View style={styles.wrapStars}>
                    {starArray.map((index) => (
                      <TouchableOpacity key={index} onPress={() => handleProductStarPress(index)}>
                        <FontAwesome
                          name={productStars >= index ? "star" : "star-o"}
                          size={30}
                          color={productStars >= index ? 'orange' : 'yellow'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.qualityText}>{productMeaning}</Text>

                </View>
                <View style={styles.containerMedia}>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <Entypo
                      name={"camera"}
                      size={30}
                      style={styles.mediaIcon}
                    />
                    <Text style={styles.mediaText}>Add Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <Entypo
                      name={"video-camera"}
                      size={30}
                      style={styles.mediaIcon}
                    />
                    <Text style={styles.mediaText}>Add Video</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.containerComment}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave your comment here ..."
                    onChangeText={setProductComment}
                    value={productComment}
                    style={styles.commentText}></TextInput>
                </View>
              </View>

              <View style={styles.wrapSendButton}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendProductReview}>
                  {loading ? <ActivityIndicator size="small" color="#bc2b78" /> :
                    <Text style={styles.btnText}>Send</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </>
    )
  }
  const renderShopReview = (orderDetail: Detail) => {
    if (!orderDetail.shop_review && !shopId.includes(orderDetail.shop_id)) {
      shopId.push(orderDetail.shop_id);
    } else return null;
    console.log('renderShopReview');
    const [isVisible, setIsVisible] = useState(true);
    // Shop
    const [shopStars, setShopStars] = useState(0);
    const [shopMeaning, setShopMeaning] = useState('');
    const [shopComment, setShopComment] = useState('');
    const handleShopStarPress = (index: number) => {
      if (shopStars === index) {
        setShopStars(0);
        setShopMeaning('');
      } else {
        setShopStars(index);
        setShopMeaning(meanings[index]);
      }
    };
    // handleSendShopReview
    const [loading, setLoading] = useState(false);
    const handleSendShopReview = async () => {
      if (!shopStars || !shopComment) {
        handleNotify('Plz leave your stars and comments')
      }
      else {
        try {
          setLoading(true);
          const axiosInstance = await authAPI();
          const response = await axiosInstance.post(endpoints.shopReview(orderDetail.shop_id), {
            comment: shopComment,
            rating: shopStars,
            order: orderDetail.order_id,
            product: orderDetail.product_id
          })
          if (response.status === 201 && response.data) {
            shopId.filter((id) => id !== orderDetail.shop_id);
            if (shopId.length === 0 && productId.length === 0) {
              navigation.navigate('HomeNavigator', { screen: 'ProfileScreen' });
            }
            else {
              setIsVisible(false);
            }
          }
        } catch (error) {
          handleNotify('An error occured, plz try again later');
        } finally {
          setLoading(false);
        }
      }
    }
    return (
      <>
        {isVisible &&
          <View key={uuid.v4().toString()}>
            <View style={styles.container}>
              <View style={styles.containerProduct}>
                <Image
                  source={{ uri: orderDetail.shop_img }}
                  style={styles.productImg}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.productName}>
                    {orderDetail.shop_name}
                  </Text>
                </View>
              </View>
              {/* FormRating */}
              <View style={styles.containerForm}>
                <View style={styles.quality}>
                  <Text style={{ color: '#000' }}>Quality</Text>
                  <View style={styles.wrapStars}>
                    {starArray.map((index) => (
                      <TouchableOpacity key={index} onPress={() => handleShopStarPress(index)}>
                        <FontAwesome
                          name={shopStars >= index ? "star" : "star-o"}
                          size={30}
                          color={shopStars >= index ? 'orange' : 'yellow'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.qualityText}>{shopMeaning}</Text>
                </View>

                <View style={styles.containerComment}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave your comment here ..."
                    onChangeText={text => setShopComment(text)}
                    value={shopComment}
                    style={styles.commentText}></TextInput>
                </View>
              </View>

              <View style={styles.wrapSendButton}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendShopReview}>
                  {loading ? <ActivityIndicator size="small" color="#bc2b78" /> :
                    <Text style={styles.btnText}>Send</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </>
    )
  }
  const renderReviewShopProduct = (orderDetail: Detail) => {
    console.log('renderReviewShopProduct');

    if (!orderDetail.product_review && !productId.includes(orderDetail.product_id)) {
      productId.push(orderDetail.product_id);
      console.log('productId', productId);
    }
    if (!orderDetail.shop_review && !shopId.includes(orderDetail.shop_id)) {
      shopId.push(orderDetail.shop_id);
      console.log('shopId', shopId);
    } else return null;
    const [isVisible, setIsVisible] = useState(true);
    // Product
    const [productStars, setProductStars] = useState(0);
    const [productMeaning, setProductMeaning] = useState('');
    const [productComment, setProductComment] = useState('');
    // chooseStar
    const handleProductStarPress = (index: number) => {
      if (productStars === index) {
        setProductStars(0);
        setProductMeaning('');
      } else {
        setProductStars(index);
        setProductMeaning(meanings[index]);
      }
    };
    // Shop
    const [shopStars, setShopStars] = useState(0);
    const [shopMeaning, setShopMeaning] = useState('');
    const [shopComment, setShopComment] = useState('');
    const handleShopStarPress = (index: number) => {
      if (shopStars === index) {
        setShopStars(0);
        setShopMeaning('');
      } else {
        setShopStars(index);
        setShopMeaning(meanings[index]);
      }
    };
    // handleSendProductShopReview
    const [loading, setLoading] = useState(false);
    const handleSendProductShopReview = async () => {
      if (!productStars || !productComment || !shopStars || !shopComment) {
        handleNotify('Plz leave your stars and comments')
      }
      else {
        try {
          setLoading(true);
          const axiosInstance = await authAPI();
          const response = await axiosInstance.post(endpoints.productReview(orderDetail.product_id), {
            comment: productComment,
            rating: productStars,
            order: orderDetail.order_id,
          })
          const response2 = await axiosInstance.post(endpoints.shopReview(orderDetail.shop_id), {
            comment: shopComment,
            rating: shopStars,
            order: orderDetail.order_id,
            product: orderDetail.product_id
          })
          if (response.status === 201 && response.data) {
            productId = productId.filter((id) => id !== orderDetail.product_id);
            if (productId.length === 0 && shopId.length === 0) {
              navigation.navigate('HomeNavigator', { screen: 'ProfileScreen' });
            }
          }
          if (response2.status === 201 && response2.data) {
            shopId.filter((id) => id !== orderDetail.shop_id);
            if (shopId.length === 0 && productId.length === 0) {
              navigation.navigate('HomeNavigator', { screen: 'ProfileScreen' });
            }
            else {
              setIsVisible(false);
            }
          }
        } catch (error) {
          handleNotify('An error occured, plz try again later');
        } finally {
          setLoading(false);
        }
      }
    }
    return (
      <>
        {isVisible &&
          <View key={uuid.v4().toString()}>
            {/* Shop */}
            <View style={styles.container}>
              <View style={styles.containerProduct}>
                <Image
                  source={{ uri: orderDetail.shop_img }}
                  style={styles.productImg}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.productName}>
                    {orderDetail.shop_name}
                  </Text>
                </View>
              </View>
              {/* FormRating */}
              <View style={styles.containerForm}>
                <View style={styles.quality}>
                  <Text style={{ color: '#000' }}>Quality</Text>
                  <View style={styles.wrapStars}>
                    {starArray.map((index) => (
                      <TouchableOpacity key={index} onPress={() => handleShopStarPress(index)}>
                        <FontAwesome
                          name={shopStars >= index ? "star" : "star-o"}
                          size={30}
                          color={shopStars >= index ? 'orange' : 'yellow'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.qualityText}>{shopMeaning}</Text>
                </View>

                <View style={styles.containerComment}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave your comment here ..."
                    onChangeText={setShopComment}
                    value={shopComment}
                    style={styles.commentText}></TextInput>
                </View>
              </View>
            </View>
            {/* Product */}
            <View style={styles.container}>
              <View style={styles.containerProduct}>
                <Image
                  source={{ uri: orderDetail.product_img }}
                  style={styles.productImg}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text numberOfLines={2} ellipsizeMode='tail' style={styles.productName}>
                    {orderDetail.product_name}</Text>
                  {orderDetail.color_name &&
                    <Text style={styles.classification}>Classification: {orderDetail.color_name}</Text>}
                </View>
              </View>
              {/* FormRating */}
              <View style={styles.containerForm}>
                <View style={styles.quality}>
                  <Text style={{ color: '#000' }}>Quality</Text>
                  <View style={styles.wrapStars}>
                    {starArray.map((index) => (
                      <TouchableOpacity key={index} onPress={() => handleProductStarPress(index)}>
                        <FontAwesome
                          name={productStars >= index ? "star" : "star-o"}
                          size={30}
                          color={productStars >= index ? 'orange' : 'yellow'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.qualityText}>{productMeaning}</Text>

                </View>
                <View style={styles.containerMedia}>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <Entypo
                      name={"camera"}
                      size={30}
                      style={styles.mediaIcon}
                    />
                    <Text style={styles.mediaText}>Add Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.mediaBtn}>
                    <Entypo
                      name={"video-camera"}
                      size={30}
                      style={styles.mediaIcon}
                    />
                    <Text style={styles.mediaText}>Add Video</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.containerComment}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave your comment here ..."
                    onChangeText={setProductComment}
                    value={productComment}
                    style={styles.commentText}></TextInput>
                </View>
              </View>

              <View style={styles.wrapSendButton}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendProductShopReview}>
                  {loading ? <ActivityIndicator size="small" color="#bc2b78" /> :
                    <Text style={styles.btnText}>Send</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </>
    )
  }
  // Update state after post  
  return (
    <ScrollView>
      {orderDetail && orderDetail.order_details.map(order => {
        if (!order.product_review && !order.shop_review) {
          return renderReviewShopProduct(order)
        }
        else if (!order.product_review && order.shop_review) {
          return renderProductReview(order)
        }
        else if (order.product_review && !order.shop_review) {
          return renderShopReview(order)
        }
      })}
      {openModel && <Notify visible={openModel} text={notifyText} />}
    </ScrollView>
  )
}

export default ReviewFormScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20
  },
  containerProduct: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.2,
    borderColor: colors.lightGray,
  },
  productImg: { borderRadius: 4, height: 50, width: 50 },
  productName: { fontSize: 16, color: '#000' },
  classification: { fontSize: 12, color: colors.lightGray },
  containerForm: {
    backgroundColor: '#fff',
    padding: 10,
  },
  quality: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wrapStars: {
    width: '50%',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  qualityText: { color: colors.lightGray, marginLeft: 10 },
  containerMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mediaBtn: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0.2,
    borderColor: 'tomato',
  },
  mediaIcon: { color: 'tomato' },
  mediaText: { fontSize: 12, color: 'tomato' },
  containerComment: {
    height: 200,
    borderRadius: 4,
    borderWidth: 0.2,
    borderColor: colors.lightGray,
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  commentText: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  wrapSendButton: {
    width: '100%',
    backgroundColor: '#fff'
  },
  sendButton: {
    backgroundColor: 'tomato',
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    alignSelf: 'flex-end'
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})