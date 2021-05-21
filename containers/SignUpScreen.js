import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, border } from "../assets/js/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen({ setTokenAndId, navigation, route }) {
  //token = JptVmymUHtWrZhlHopI7iTC9UXDAMZyoBuuh1VgbxSEhx8M1sbWXFcEgsVNv8Z87
  const [email, setEmail] = useState("ulysse31@airbnb-api.com");
  const [username, setUsername] = useState("nono");
  const [description, setDescription] = useState(
    "My name is nono, le petit robot, la vie d'ulysse "
  );
  const [password, setPassword] = useState("pass");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email,
          username,
          description,
          password,
        }
      );
      if (response.data) {
        console.log("response", response);
        if (response.status === 200) {
          alert("Register completed");
          setErrorMessage("");
          let setResponse = JSON.stringify({
            token: response.data.token,
            id: response.data.id,
          });
          setTokenAndId(setResponse);
          // setTimeout(() => {
          //   navigation.navigate("SignIn");
          // }, 3000);
          navigation.navigate("Tab", {
            screen: "Home",
          });
        }
        // const userToken = "secret-token";
        // setToken(userToken);
      }
    } catch (err) {
      console.log(err.response);
      if (err.response.error === "This email already has an account.") {
        setErrorMessage("Cet email est déjà utilisé");
      }
      if (err.response.status === 401) {
        setErrorMessage("Please fill all fields");
      }
      if (password !== confirmPassword) {
        setErrorMessage("Password must be the same");
      }
      console.log(err.message);
    }
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.logo}>
            <FontAwesome5 name="airbnb" size={92} color={colors.red} />
            <Text style={{ fontSize: 20, marginTop: 10 }}>Sign Up</Text>
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
            <TextInput
              style={styles.input}
              placeholder="password"
              value={password}
              onChangeText={(password) => setPassword(password)}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              secureTextEntry={true}
            />
          </View>
          <View style={styles.sign}>
            {<Text>{errorMessage}</Text> && (
              <Text style={{ color: colors.errorMessage, fontSize: 12 }}>
                {errorMessage}
              </Text>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.submit}
              onPress={handleSubmit}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={{ fontSize: 12, color: colors.grey }}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
  logo: {
    alignItems: "center",
  },
  form: {
    width: "100%",
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
