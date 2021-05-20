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
export default function MapScreen() {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [coordinate, setCoordinate] = useState();

  useEffect(() => {
    const getPermission = async () => {
      try {
        // Demander la permission d'accéder aux coordonnées GPS de l'appareil
        const has = await Location.hasServicesEnabledAsync();
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "denied") {
          // Récupérer la localisation (coords GPS) de l'appareil
          setIsLoading(false);
          setErrorMessage("You need to allow permissions to continue");
          return;
        } else if (has && status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          console.log(coords);
          setCoordinate(coords);
          setIsLoading(false);
        }
      } catch (err) {
        alert("An error has occured");
        console.log(err.message);
      }
    };
    getPermission();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms/around",
          {
            params: {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            },
          }
        );
        console.log("response----------------------------", response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("ERREUR RESPONSE ", err.response);
        console.log("ERREUR MESSAGE ", err.message);
      }
    };
    fetchData();
  }, [coordinate]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.red}
          style={{ marginTop: 50 }}
        />
      ) : errorMessage || !coordinate || !data ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
        >
          {data.map((marker) => {
            return (
              <MapView.Marker
                key={marker._id}
                coordinate={{
                  latitude: marker.location[1],
                  longitude: marker.location[0],
                }}
                title={marker.title}
                description={marker.description}
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
