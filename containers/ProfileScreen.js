import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  Clipboard,
  StatusBar,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Button,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors, border } from "../assets/js/colors";
import * as ImagePicker from "expo-image-picker";
const ProfileScreen = ({ navigation, setTokenAndId }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState();
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  //ImagePicker
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [takenPicture, setTakenPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  // const [data, setData] = useState();
  // console.log(route);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenId = await AsyncStorage.getItem("userTokenAndId");
        const user = JSON.parse(tokenId);
        console.log(user);
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setSelectedPicture(response.data.photo[0].url);
      } catch (err) {
        console.log(err.response);
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const handleImagePicked = useCallback(async (pickerResult) => {
    let uploadResponse, uploadResult;
    const tokenId = await AsyncStorage.getItem("userTokenAndId");
    let user = JSON.parse(tokenId);
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        const uri = pickerResult.uri;

        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append("photo", {
          uri,
          name: `airbnb-avt.${fileType}`,
          type: `image/${fileType}`,
        });

        uploadResponse = await axios.put(
          "https://express-airbnb-api.herokuapp.com/user/upload_picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(uploadResponse.data.photo[0].url);

        if (
          Array.isArray(uploadResponse.data.photo) === true &&
          uploadResponse.data.photo.length > 0
        ) {
          setSelectedPicture(uploadResponse.data.photo[0].url);
        }
      }
    } catch (err) {
      console.log({ uploadResult });
      alert("Upload failed, sorry :(");
      console.log(err);
    } finally {
      setUploading(false);
    }
  });

  const getPermissionAndPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      console.log(result);
      // Si result.cancelled vaut true, cela veut dire qu'aucune image a été sélectionné
      handleImagePicked(result);
      // if (!result.cancelled) {
      //   setSelectedPicture(result.uri);
      // }
    } else {
      alert("Permission to access the gallery denied");
      return;
    }
  };

  const getPermissionAndCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      console.log(result);
      handleImagePicked(result);
      // if (!result.cancelled) {
      //   setTakenPicture(result.uri);
      // }
    } else {
      alert("Permission to access the camera denied");
      return;
    }
  };

  const handleSubmit = async () => {
    const tokenId = await AsyncStorage.getItem("userTokenAndId");
    const user = JSON.parse(tokenId);
    try {
      await axios.put(
        `https://express-airbnb-api.herokuapp.com/user/update`,
        {
          email: email,
          username: username,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Your change has been made");
      navigation.navigate("Home");
    } catch (e) {
      console.log(e.message);
    }
  };

  // enableOnAndroid={true}
  // enableAutomaticScroll={Platform.OS === "ios"}
  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.avatar}>
              {/* {avatar === null ? (
                <FontAwesome5
                  name="user-alt"
                  size={84}
                  color={colors.lightGrey}
                />
              ) : null} */}
              {selectedPicture && selectedPicture !== null ? (
                <Image
                  source={{ uri: selectedPicture }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5
                  name="user-alt"
                  size={84}
                  color={colors.lightGrey}
                />
              )}

              {uploading && (
                <View style={[StyleSheet.absoluteFill, styles.uploading]}>
                  <ActivityIndicator
                    size="large"
                    color={colors.red}
                    style={{ marginTop: 50 }}
                  />
                </View>
              )}
            </View>
            <View style={styles.edit_avatar}>
              <Button title="Gallery" onPress={getPermissionAndPhoto} />
              <Button title="Camera" onPress={getPermissionAndCamera} />
            </View>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="email"
              keyboardType="email-address"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={styles.input}
              placeholder="username"
              value={username}
              onChangeText={(username) => setUsername(username)}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              numberOfLines={4}
              multiline
              placeholder="Describe yourself in a few words..."
              value={description}
              onChangeText={(description) => setDescription(description)}
            />
          </View>
          <View style={styles.sign}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.submit}
              onPress={handleSubmit}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.submit, { backgroundColor: colors.greyRating }]}
              onPress={() => {
                setTokenAndId(null);
              }}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    flex: 1,
  },
  avatar: {
    ...border,
    borderRadius: 100,
    borderColor: colors.red,
  },
  edit_avatar: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  uploading: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.4)",
    justifyContent: "center",
  },
  selectedImage: {
    width: 104,
    height: 104,
    borderRadius: 100,
  },
  form: {
    paddingHorizontal: 15,
  },
  input: {
    marginVertical: 15,
    borderBottomColor: colors.red,
    borderStyle: "solid",
    borderBottomWidth: 1,
    lineHeight: 22,
  },
  textarea: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    textAlignVertical: "top",
    borderTopColor: colors.red,
    borderLeftColor: colors.red,
    borderRightColor: colors.red,
  },
  sign: {
    flexDirection: "column",
    alignItems: "center",
    width: "60%",
  },
  submit: {
    width: "80%",
    paddingVertical: 10,
    marginVertical: 10,
    borderColor: colors.red,
    borderWidth: 2,
    borderRadius: 25,
  },
  errorMessage: {
    color: colors.errorMessage,
    fontSize: 14,
  },
});
