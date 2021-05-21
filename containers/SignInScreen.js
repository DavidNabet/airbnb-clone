import React, { useState } from "react";
// import { useNavigation } from "@react-navigation/core";
import {
  Dimensions,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { colors, border } from "../assets/js/colors";
export default function SignInScreen({ setTokenAndId, navigation, route }) {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  // const navigation = useNavigation();
  // const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("ulysse31@airbnb-api.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [disabled, setDisabled] = useState(false);

  // console.log(navigation);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/log_in",
        {
          email: email,
          password: password,
        }
      );
      console.log("response", response);
      // setIsLoading(false);
      // setDisabled(true);
      if (response.status === 200) {
        alert("Welcome to Airbnb App");
        let setResponse = JSON.stringify({
          token: response.data.token,
          id: response.data.id,
        });
        setTokenAndId(setResponse);
        // const userToken = "secret-token";
        // setToken(userToken);
        // navigation.navigate("Home");
        navigation.navigate("Tab", {
          screen: "Home",
        });
      }
    } catch (err) {
      console.log(err.response);
      if (err.response.status === 401) {
        setErrorMessage("Email/Password must be incorrect");
      }
      if (err.response.status === 400) {
        setErrorMessage("Please fill all fields");
      }
      console.log(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logo}>
          <FontAwesome5 name="airbnb" size={92} color={colors.red} />
          <Text style={{ fontSize: 20, marginTop: 10 }}>Sign In</Text>
        </View>
        {/* {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.red}
            style={{ marginTop: 50 }}
          />
        ) } */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="email"
            onChangeText={(email) => setEmail(email)}
            value={email}
            autoCompleteType="email"
            keyboardType="email-address"
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            placeholder="password"
            value={password}
            onChangeText={(password) => setPassword(password)}
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
            <Text style={{ fontSize: 16, textAlign: "center" }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("SignUp");
            }}
            // disabled={disabled === true ? false : true}
          >
            <Text style={{ fontSize: 12, color: colors.grey }}>
              No account ? Register
            </Text>
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
    marginVertical: 10,
    borderBottomColor: colors.red,
    borderStyle: "solid",
    borderBottomWidth: 1,
    lineHeight: 22,
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
