import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"
import React from "react";
import { colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import api, { endpoints } from '../../utils/api';
import formatCurrency from "../../constants/formatCurrency";
import { ShippingUnit } from "../../interfaces/shipping";

const Delivery = () => {
  // currentDate
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  const year = currentDate.getFullYear();
  //  
  const [openModel, setOpenModal] = useState(false);
  const transparent = 'rgba(0,0,0,0.5)';

  const [shippingUnit, setShippingUnit] = useState<ShippingUnit[]>([])
  const fetchShippingUnit = async () => {
    try {
      const response = await api.get(endpoints["shipping-unit"]);
      if (response.status === 200 && response.data) {
        setShippingUnit(response.data);
      }
    } catch (error) {
      console.error('shippingUnit not found', error);
    }
  };
  useEffect(() => {
    fetchShippingUnit();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.containerDeliveryFee}>
      <View style={styles.wrapDeliveryTitle}>
        <Text style={{
          fontWeight: "500",
        }}>Delivery Fee</Text>
        <Text style={{
          marginLeft: 10,
          fontWeight: "500",
          color: "tomato",
        }}>đ{item?.fee ? formatCurrency(item?.fee) : 'Not found'}</Text>
      </View>
      <View style={styles.wrapDeliveryText}>
        <Text style={styles.deliveryText}>
          Shipping unit: {item?.name ? item?.name : 'Not found'}</Text>
        <Text style={styles.deliveryText}>
          Guaranteed delivery from {`${day}`} - {`${day + 5}/${month}/${year}`}
        </Text>
        <Text style={styles.deliveryText}>Receive a voucher worth 10.000đ if your order arrives later than expected</Text>
        {/* <View style={{
          marginVertical: 5,
        }}>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <Text style={{ color: colors.blueSky }}>See more</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );

  function renderModal() {
    return (
      <Modal
        visible={openModel}
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

            backgroundColor: "#fff",
            padding: 15,
            width: "90%",
            height: "50%",
            borderRadius: 10,
          }}>
            <TouchableOpacity onPress={() => setOpenModal(false)} style={{
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
            <View>
              <View
                style={styles.wrapDeliveryModalTitle}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    marginTop: 15,
                  }}
                >Shipping Unit</Text>
              </View>

              <FlatList
                data={shippingUnit}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              // style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.containerDeliveryFee}>
      <View style={styles.wrapDeliveryTitle}>
        <Text style={{
          fontWeight: "500",
        }}>Delivery Fee</Text>
        <Text style={{
          marginLeft: 10,
          fontWeight: "500",
          color: "tomato",
        }}>đ{shippingUnit[0]?.fee ? formatCurrency(shippingUnit[0]?.fee) : 'Not found'}</Text>
      </View>
      <View style={styles.wrapDeliveryText}>
        <Text style={styles.deliveryText}>
          Shipping unit: {shippingUnit[0]?.name ? shippingUnit[0]?.name : 'Not found'}</Text>
        <Text style={styles.deliveryText}>
          Guaranteed delivery from {`${day}`} - {`${day + 5}/${month}/${year}`}
        </Text>
        <Text style={styles.deliveryText}>Receive a voucher worth 10.000đ if your order arrives later than expected</Text>
        <View style={{
          marginVertical: 5,
        }}>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <Text style={{ color: colors.blueSky }}>See more</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderModal()}
    </View>
  )
}

export default Delivery

const styles = StyleSheet.create({
  containerDeliveryFee: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  wrapDeliveryTitle: {
    flexDirection: "row",
    marginBottom: 4,
  },
  wrapDeliveryModalTitle: {
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: 'blue'
  },
  wrapDeliveryText: {

  },
  deliveryText: {
    fontSize: 12,
    color: colors.lightGray,
  },
})