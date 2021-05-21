import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { colors } from "../assets/js/colors";
export default function MapScreen({ navigation }) {
  const [data, setData] = useState([]);
  // const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [coordinate, setCoordinate] = useState({});

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      try {
        // Demander la permission d'accéder aux coordonnées GPS de l'appareil
        // const has = await Location.hasServicesEnabledAsync();
        const { status } = await Location.requestForegroundPermissionsAsync();
        // Récupérer la localisation (coords GPS) de l'appareil
        // return setErrorMessage("You need to allow permissions to continue");
        let response;
        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          const obj = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setCoordinate(obj);
          // 2 - faire une requête en utilisant ces coordonnées (pour récupérer des annonces)
          response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
        } else {
          // faire une requête sans les coordonnées de l'utilisateur (pour récupérer toutes les annonces)
          response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around`
          );
        }
        setData(response.data);
        setIsLoading(false);
      } catch (err) {
        alert("An error has occured");
        console.log("ERREUR MESSAGE ", err.message);
      }
    };
    getPermissionAndLocation();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.red}
          style={{ marginTop: 50 }}
        />
      ) : (
        // ) : errorMessage || !coordinate || !data ? (
        //   <Text style={styles.errorMessage}>{errorMessage}</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: coordinate.latitude ? coordinate.latitude : 48.856614,
            longitude: coordinate.longitude ? coordinate.longitude : 2.3522219,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          showsUserLocation={true}
        >
          {data.map((room) => {
            return (
              <MapView.Marker
                key={room._id}
                coordinate={{
                  latitude: room.location[1],
                  longitude: room.location[0],
                }}
                onPress={() => {
                  navigation.navigate("Room", { id: room._id });
                }}
                title={room.title}
                description={room.description}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  errorMessage: {
    textAlign: "center",
    color: colors.red,
    fontSize: 12,
  },
  box: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: 150,
    height: 100,
    backgroundColor: "white",
  },
});
