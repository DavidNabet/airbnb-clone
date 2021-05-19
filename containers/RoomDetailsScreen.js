import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import { Text, Image, View, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { colors, border } from "../assets/js/colors";
import Rating from "../components/Rating";

export default function RoomDetailsScreen() {
  const { params } = useRoute();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let id = params.detailsId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );

        // console.log("response", response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err.response);
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color={colors.red}
      style={{ marginTop: 50 }}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.room}>
        <View style={styles.cover}>
          <Image
            source={{ uri: data.photos[0].url }}
            style={styles.cover_img}
            resizeMode="cover"
          />
          <View style={styles.price_box}>
            <Text style={{ color: "white", fontSize: 18 }}>{data.price} €</Text>
          </View>
        </View>
        <View style={styles.block_middle}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {data.title}
            </Text>
            <Rating rating={data.ratingValue} reviews={data.reviews} />
          </View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            resizeMode="contain"
            style={styles.avatar}
          />
        </View>
        <View style={styles.block_bottom}>
          <Text numberOfLines={3} style={styles.text}>
            {data.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  room: {
    flex: 1,
    flexDirection: "column",
  },
  cover: {
    flex: 1,
    position: "relative",
    maxHeight: 250,
  },
  cover_img: {
    overflow: "hidden",

    flex: 1,
  },
  price_box: {
    position: "absolute",
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "black",
    left: 0,
    bottom: 10,
  },
  block_middle: {
    marginHorizontal: 16,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 255,
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 19,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
  },
  block_bottom: {
    marginHorizontal: 16,
  },
});
