import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { colors } from '../../constants/colors';
import formatCurrency from '../../constants/formatCurrency';

const PriceNameRatingSold = ({ productId = 0, categoryId = 0, price = 0, name = '', rating = 0, sold = 0 }:
  { productId: number, categoryId: number, price: number, name: string, rating: number, sold: number }) => {
  return (
    <View style={styles.containerPriceNameRatingSold}>
      <View style={styles.wrapProductName}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            flexWrap: 'wrap',
          }}>{name}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <View style={styles.wrapProductPrice}>
            <Text style={{ fontSize: 16, color: colors.darkRed }}>{formatCurrency(price)}đ</Text>
          </View>
          <View style={styles.wrapProductRatingSold}>
            <View style={styles.wrapProductRating}>
              <FontAwesome
                name={"star"}
                size={14}
                color={colors.darkOrange}
              />
              <Text style={{ fontSize: 14, marginLeft: 5, }}>{Math.round(rating * 10) / 10}/5</Text>
            </View>
            <View
              style={{
                marginHorizontal: 5,
                borderWidth: 0.2,
                borderColor: colors.lightGray,
                height: "80%",
              }}></View>
            <View style={styles.wrapProductSold}>
              <Text style={{ fontSize: 14, color: colors.lightGray }}>{sold} sold</Text>
            </View>
          </View>
        </View>
        <View >
          <TouchableOpacity style={styles.btnCompareProduct}
          // onPress={() => { navigation.navigate('NavProduct', { productId, categoryId }) }}
          >
            <FontAwesome
              name={"magic"}
              size={24}
              style={{ color: '#9400d3' }}
            />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

export default PriceNameRatingSold

const styles = StyleSheet.create({
  containerPriceNameRatingSold: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  wrapProductName: {

  },
  wrapProductPrice: {

  },
  wrapProductRatingSold: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  wrapProductRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapProductSold: {
  },
  btnCompareProduct: {
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  }
})