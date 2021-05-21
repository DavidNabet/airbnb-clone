import React from "react";
import { Button, Text, View } from "react-native";

export default function SettingsScreen({ setTokenAndId }) {
  return (
    <View>
      <Text>Hello Settings</Text>

      <Button
        title="Log Out"
        onPress={() => {
          setTokenAndId(null);
        }}
      />
    </View>
  );
}
