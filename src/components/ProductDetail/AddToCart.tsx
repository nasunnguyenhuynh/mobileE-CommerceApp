import React, { useState } from 'react'
import { Image, StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from '../../constants/colors';
import formatCurrency from '../../constants/formatCurrency';
import { ProductColor, ProductImage, SelectedProductList } from '../../interfaces/product';
//redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { addProduct } from '../../redux/cart/cartSlice';
import store from '../../redux/store';

interface AddToCartProps {
  visible: boolean;
  toggleModal: () => void;
  id: number;
  price: number;
  colors: ProductColor[];
  images: ProductImage[];
  shopId: number;
}

const AddToCart: React.FC<AddToCartProps> =
  ({ visible = true, toggleModal, id = 0, price = 0, colors = [], images = [], shopId = 0 }) => {
    if (!visible) return null;
    //cartSlice
    const dispatch = useDispatch<AppDispatch>()

    const transparent = 'rgba(0,0,0,0.5)';
    // handleSelectedProductColor
    const [selectedProductColor, setSelectedProductColor] = useState<ProductColor>();
    const handleSelectedProductColor = (item: ProductColor) => {
      setSelectedProductColor(item);
    };
    // Handle choose quantity
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };
    const decreaseQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : prevQuantity));
    };
    // Display color badge
    const renderItem = ({ item }: { item: ProductColor }) => (
      <View style={styles.wrapColorBadge}>
        <TouchableOpacity style={styles.colorBadge}
          onPress={() => handleSelectedProductColor(item)}>
          <Image
            source={{ uri: item.image }}
            style={styles.imgColor}
          />
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </View>

    );

    function renderModal() {
      return (
        <Modal animationType="slide" transparent={true} visible={visible}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: transparent, }}>
            <View style={{
              position: "absolute", backgroundColor: "white",
              bottom: 0, padding: 15, width: "90%", height: "60%", borderRadius: 10,
            }}>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
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
              {/* Display product_image */}
              <View style={styles.wrapHeader}>
                {
                  selectedProductColor ?
                    <Image
                      source={{ uri: selectedProductColor?.image }}
                      style={styles.largeImage}
                    />
                    :
                    <Image
                      source={{ uri: images[0].image }}
                      style={styles.largeImage}
                    />
                }
                <View style={styles.wrapPrice}>
                  <Text style={{ color: "red", fontSize: 16 }}>{formatCurrency(price)}đ</Text>
                </View>
              </View>
              {/* Display colors & quantity */}
              <View style={styles.wrapBody}>
                {
                  colors.length > 0 &&
                  <View style={styles.wrapColor}>
                    <View style={styles.wrapColorTitle}>
                      <Text>Color</Text>
                    </View>

                    <FlatList
                      data={colors}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={1}
                      style={{}}
                    />
                  </View>
                }
                <View style={styles.wrapQuantity}>
                  <Text style={styles.textQuantity}>Quantity</Text>
                  <View>
                    <View style={styles.btnSelectQuantity}>
                      <TouchableOpacity style={styles.btnDecrease} onPress={decreaseQuantity}>
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ color: '#000' }}>{quantity}</Text>
                      <TouchableOpacity style={styles.btnIncrease} onPress={increaseQuantity}>
                        <Text style={{ color: '#000' }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {/* Handle AddToCart */}
              {
                ((colors.length > 0 && selectedProductColor) || colors.length === 0) ?
                  <TouchableOpacity
                    style={[styles.btnAddToCart, { backgroundColor: 'green' }]}
                    onPress={async () => {
                      const isSelected = false;
                      const selectedProduct: SelectedProductList = {
                        shopId,
                        products: [{ id, color: selectedProductColor?.id || null, quantity, isSelected }],
                        isSelected
                      };
                      dispatch(addProduct(selectedProduct)); // Add to cartSlice (can be renewd after log out)
                      toggleModal();
                    }}
                  >
                    <Text style={{ fontSize: 18, color: '#000' }}>Add to cart</Text>
                    {/* price, quantity, name, color */}
                  </TouchableOpacity> :
                  <View
                    style={[styles.btnAddToCart, { backgroundColor: 'gray' }]}
                  >
                    <Text style={{ fontSize: 18, color: '#000' }}>Add to cart</Text>
                  </View>
              }
            </View>
          </View>
        </Modal>
      );
    }

    return (

      <View style={styles.containerProductDetail}>
        {renderModal()}
      </View >
    );
  }

export default AddToCart

const styles = StyleSheet.create({
  containerProductDetail: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  wrapHeader: {
    flexDirection: "row",
    alignItems: "center",

    borderColor: colors.lightGray,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  largeImage: {
    height: 100,
    width: 100,
  },
  wrapPrice: {
    marginLeft: 5,
    position: "absolute",
    left: 100,
    top: 50,
  },

  wrapBody: {
    paddingVertical: 10,
  },
  wrapColor: {
    borderColor: colors.lightGray,
    borderBottomWidth: 0.5,
  },
  wrapColorTitle: {
    marginBottom: 5,
  },
  wrapColorBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.lightGray,
    width: "30%",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  imgColor: {
    width: 30,
    height: 30,
  },
  wrapQuantity: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textQuantity: {
    fontSize: 14,
    color: '#000'
  },
  btnSelectQuantity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 80,
    borderColor: colors.lightGray,
    borderWidth: 0.5,
  },
  btnDecrease: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 12,
    width: "30%",
    borderColor: colors.lightGray,
    borderRightWidth: 0.5,
  },
  btnIncrease: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 12,
    width: "30%",
    borderColor: colors.lightGray,
    borderLeftWidth: 0.5,
  },
  btnAddToCart: {
    position: "absolute",
    bottom: 10,
    left: 16,
    height: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
})