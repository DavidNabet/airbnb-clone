import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { colors } from "./assets/js/colors";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import MapScreen from "./containers/MapScreen";
import RoomDetailsScreen from "./containers/RoomDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userTokenAndId, setUserTokenAndId] = useState(null);

  const setTokenAndId = async (obj) => {
    if (obj) {
      AsyncStorage.setItem("userTokenAndId", obj);
    } else {
      AsyncStorage.removeItem("userTokenAndId");
    }

    setUserTokenAndId(obj);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userTokenAndId = await AsyncStorage.getItem("userTokenAndId");
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
      setUserTokenAndId(userTokenAndId);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userTokenAndId === null ? ( // We haven't finished checking for the token yet
        // No token found, user isn't signed in
        <Stack.Navigator>
          <Stack.Screen name="SignIn">
            {(props) => (
              <SignInScreen {...props} setTokenAndId={setTokenAndId} />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => (
              <SignUpScreen {...props} setTokenAndId={setTokenAndId} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator>
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: colors.red,
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerTitleAlign: "center",
                        headerTitle: () => (
                          <FontAwesome5
                            name="airbnb"
                            size={32}
                            color={colors.red}
                          />
                        ),
                      }}
                    >
                      <Stack.Screen name="Home">
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen name="Room">
                        {(props) => <RoomDetailsScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="AroundMe"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name={"map-marker-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerTitleAlign: "center",
                        headerTitle: () => (
                          <FontAwesome5
                            name="airbnb"
                            size={32}
                            color={colors.red}
                          />
                        ),
                      }}
                    >
                      <Stack.Screen name="AroundMe">
                        {(props) => <MapScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name={"account-settings"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerTitleAlign: "center",
                        headerTitle: () => (
                          <FontAwesome5
                            name="airbnb"
                            size={32}
                            color={colors.red}
                          />
                        ),
                      }}
                    >
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "Profile",
                          tabBarLabel: "My Profile",
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            setTokenAndId={setTokenAndId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
