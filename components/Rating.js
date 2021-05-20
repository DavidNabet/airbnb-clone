import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../assets/js/colors";
const Rating = ({ reviews, rating }) => {
  const starYellow = (
    <Entypo name="star" size={20} color={colors.yellowRating} />
  );
  const starGrey = <Entypo name="star" size={20} color={colors.greyRating} />;

  return (
    <View style={styles.reviews}>
      {[1, 2, 3, 4, 5].map((item, index) => {
        return (
          <View style={{ paddingRight: 1 }} key={index}>
            {item <= rating ? starYellow : starGrey}
          </View>
        );
      })}
      <Text style={styles.reviews_text}>{reviews} reviews</Text>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  reviews: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviews_text: {
    color: colors.grey,
  },
});
