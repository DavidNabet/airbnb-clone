import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  Image,
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { colors } from "../assets/js/colors";

export default function RoomDetailsScreen() {
  const { params } = useRoute();
  console.log(params);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let id = params.detailsId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );

        console.log("response", response.data);
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
    <View>
      <Text>Chargement en cours...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.room}>
        <View style={styles.cover}>
          {console.log("room ", data.photos[0].url)}
          <Image
            source={{ uri: data.photos[0].url }}
            style={styles.cover_img}
            resizeMode="contain"
          />
        </View>
        <View style={styles.block_bottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text} numberOfLines={1}>
              {data.title}
            </Text>
          </View>
          <Image
            source={{ uri: data.user.account.photo.url }}
            resizeMode="contain"
            style={styles.avatar}
          />
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
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "column",
    // borderBottomWidth: 1,
    // borderBottomColor: colors.greyRating,
    // borderStyle: "solid",
  },
  cover: {
    flex: 1,
    height: 500,
  },
  cover_img: {
    flex: 1,
    width: 300,
    height: 500,
  },
  price_box: {
    position: "absolute",
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "black",
    left: 0,
    bottom: 10,
  },
  block_bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    flex: 1,
  },
  avatar: {
    borderRadius: 255,
    width: 65,
    height: 65,
  },
  text: {
    fontSize: 20,
  },
});
