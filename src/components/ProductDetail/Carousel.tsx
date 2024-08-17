import React, { useState } from "react";
import {
  FlatList,
  Image,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const Carousel = ({ imgList }: any) => {
  const screenWidth = Dimensions.get("window").width; // get width screen
  const [activeIndex, setActiveIndex] = useState(0); // get,set idx
  const [loading, setLoading] = useState(true); // get,set loading data  


  const getItemLayout = (data: any, index: any) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={{ height: 400 }}>
        {loading && (
          <ActivityIndicator size="small" color="#bc2b78" />
        )}
        <Image
          source={{ uri: item.image }}
          style={{ height: 400, width: screenWidth }}
          onLoad={() => setLoading(false)}
        />
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / screenWidth;
    setActiveIndex(index);
  };

  const renderDotIndicators = () => {
    return imgList.map((_: any, index: number) => {
      return (
        <View
          key={index}
          style={{
            backgroundColor: index === activeIndex ? "green" : "red",
            height: 10,
            width: 10,
            borderRadius: 5,
            marginHorizontal: 6,
          }}
        ></View>
      );
    });
  };


  return (
    <View>
      <FlatList
        data={imgList}
        // ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "10%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {renderDotIndicators()}
        </View>
      </View>

    </View>
  );
}

export default Carousel
