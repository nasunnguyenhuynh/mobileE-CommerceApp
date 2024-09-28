import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View, UIManager, Platform, LayoutAnimation, } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"

const Description = ({ description = '' }: { description: string }) => {
  const [opened, setOpened] = useState(false);
  // Supply animation for old android device
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function toggleAccordion() { //easeInEaseOut & setOpened
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpened(!opened);
  }

  return (
    <View style={styles.containerDescription}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.title}>Description</Text>
          <AntDesign name={opened ? 'caretup' : 'caretdown'} size={16} />
        </View>
      </TouchableWithoutFeedback>

      {opened && (
        <View style={styles.content}>
          <Text style={{ color: '#000' }}>
            {description}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Description

const styles = StyleSheet.create({
  containerDescription: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: "center",
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: 'capitalize',
    color: '#000'
  },
  content: {
    marginTop: 8,
  },
  details: {
    opacity: 0.65,
  },
});

