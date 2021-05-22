import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import Rating from "../components/Rating";
import { colors } from "../assets/js/colors";
// icone
import { Ionicons } from "@expo/vector-icons";
// carrousel
import { SwiperFlatList } from "react-native-swiper-flatlist";
// gps
import * as Location from "expo-location";
// carte
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function RoomDetailsScreen({ route }) {
  const { id } = route.params;
  const { width } = Dimensions.get("window");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const [coords, setCoords] = useState({});

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const coordinate = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        setCoords(coordinate);
      } else {
        alert("Permission not ok");
      }
    };
    getPermission();
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
            autoplay
            autoplayDelay={4}
            autoplayLoop
            autoplayLoopKeepAnimation
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
            <Text
              style={{
                color: colors.grey,
                fontSize: 14,
                marginRight: 2,
              }}
            >
              Show {isMore ? "Less" : "More"}
            </Text>
            {isMore ? (
              <Ionicons name="caret-up" size={16} color={colors.grey} />
            ) : (
              <Ionicons name="caret-down" size={16} color={colors.grey} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20 }}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: coords.latitude ? coords.latitude : 48.857677,
              longitude: coords.longitude ? coords.longitude : 2.35095,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: data.location[1],
                longitude: data.location[0],
              }}
            />
          </MapView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 0,
  },
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
  map: {
    flexGrow: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
