import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";

// import { HapticTab } from "~/components/HapticTab";
// import { IconSymbol } from "~/components/ui/IconSymbol";
// import TabBarBackground from "~/components/ui/TabBarBackground";
// import { Colors } from "~/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Entries",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
        }}
      />

      {/* Screens to hide */}
      <Tabs.Screen
        name="category/[id]/index"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="entry/[id]/index"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="entry/[id]/update"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="category/[id]/update"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="new-entry"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="new-category"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
