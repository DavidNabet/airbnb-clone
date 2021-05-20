import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import {
  Text,
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import axios from "axios";
import { colors, border } from "../assets/js/colors";
import Rating from "../components/Rating";
import { Ionicons } from "@expo/vector-icons";

export default function RoomDetailsScreen({ route }) {
  const { width } = Dimensions.get("window");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMore, setIsMore] = useState(false);
  let id = route.params.detailsId;

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
          <SwiperFlatList
            showPagination
            index={0}
            data={data.photos}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <Image
                  source={{ uri: item.url }}
                  style={[styles.cover_img, { width: width }]}
                  resizeMode="cover"
                />
              </View>
            )}
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
          <Text numberOfLines={isMore ? 0 : 3} style={styles.text}>
            {data.description}
          </Text>
          <TouchableOpacity
            style={styles.read_more}
            activeOpacity={0.8}
            onPress={() => setIsMore(!isMore)}
          >
            <Text style={{ color: colors.grey, fontSize: 14, marginRight: 2 }}>
              Show {isMore ? "Less" : "More"}
            </Text>
            {isMore ? (
              <Ionicons name="caret-up" size={16} color={colors.grey} />
            ) : (
              <Ionicons name="caret-down" size={16} color={colors.grey} />
            )}
          </TouchableOpacity>
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
  read_more: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 6,
  },
});
