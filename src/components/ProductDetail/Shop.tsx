import React, { useEffect, useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors } from '../../constants/colors'
import api, { endpoints } from '../../utils/api';
//navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ShopStackParamList } from '../../routers/types';

type ShopScreenNavigationProp = StackNavigationProp<ShopStackParamList, 'ShopScreen'>;
const Shop = ({ id = 0 }: { id: number }) => {
  //navigation
  const navigation = useNavigation<ShopScreenNavigationProp>();
  //init shop state
  interface Shop {
    id: number,
    name: string,
    image: string,
    following: number,
    followed: number,
    shop_rating: number
  }

  const [shop, setShop] = useState<Shop>({
    id: 0,
    name: '',
    image: '',
    following: 0,
    followed: 0,
    shop_rating: 0,
  });
  //get shop info by id
  const [loading, setLoading] = useState(true);
  const getShopByID = async (id: number) => {
    const response = await api.get(endpoints.shop_id(id))
    if (response.status === 200 && response.data) {
      setShop(response.data)
    }
    setLoading(false)
  }
  useEffect(() => {
    getShopByID(id);
  }, [])

  const locationShop = "TP.Hồ Chí Minh";
  const totalProducts = "37";

  return (
    <View style={styles.containerShop}>
      {
        loading ? <ActivityIndicator size="small" color="#bc2b78" /> :
          <>
            <View style={styles.wrapShopTop}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}>

                <Image
                  source={{ uri: shop.image }}
                  style={styles.logoShop}
                />
                <View style={styles.wrapNameLocationShop}>
                  <Text>{shop.name.length > 12 ? shop.name.substring(0, 12) + '...' : shop.name}</Text>
                  <View style={styles.locationShop}>
                    <Ionicons
                      name={"location-outline"}
                      size={16}
                      color={colors.lightGray}
                      style={{}}
                    />
                    <Text
                      style={{
                        color: colors.lightGray,
                        fontSize: 10,
                      }}>
                      {locationShop}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.btnViewShop} onPress={() => { navigation.navigate('ShopScreen') }}>
                <Text style={{ color: colors.darkRed }}>View Shop</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wrapShopBottom}>
              <View style={styles.totalProduct}>
                <Text style={{ color: colors.darkRed, fontSize: 10 }}>{totalProducts}</Text>
                <Text style={{ marginLeft: 4, fontSize: 10 }}>Products</Text>
              </View>
              <View style={styles.rating}>
                <Text style={{ color: colors.darkRed, fontSize: 10 }}>{Math.round(shop.shop_rating * 10) / 10}</Text>
                <Text style={{ marginLeft: 4, fontSize: 10 }}>Ratings</Text>
              </View>
            </View>
          </>
      }
    </View>
  )
}

export default Shop

const styles = StyleSheet.create({
  containerShop: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  wrapShopTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoShop: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  wrapNameLocationShop: {
    marginLeft: 10,
  },
  nameShop: {},
  locationShop: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnViewShop: {
    borderWidth: 1,
    borderColor: colors.darkRed,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  wrapShopBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  totalProduct: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
})