import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import { colors, border } from "../assets/js/colors";
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

export default function HomeScreen(props) {
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        // console.log("response", response.data);
        setIsLoading(false);
        setData(response.data);
      } catch (err) {
        console.log(err.response);
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <Text>Chargement...</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        extraData={selectedId}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedId(item._id);
                // const selected = item._id === selectedId ? item._id : null;
                navigation.navigate("Details", {
                  detailsId: selectedId,
                });
              }}
            >
              <View style={styles.cover}>
                {console.log("home ", item.photos[0].url)}
                <Image
                  source={{ uri: item.photos[0].url }}
                  style={styles.cover_img}
                  resizeMode="contain"
                />
                <View style={styles.price_box}>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {item.price} €
                  </Text>
                </View>
              </View>
              <View style={styles.block_bottom}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  resizeMode="contain"
                  style={styles.avatar}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: colors.greyRating,
    borderStyle: "solid",
  },
  cover: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  price_box: {
    position: "absolute",
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "black",
    left: 0,
    bottom: 10,
  },
  cover_img: {
    flex: 1,
    height: 240,
    alignItems: "baseline",
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
