import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import "../global.css";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FOCUS_TIME_SECONDS = 25 * 60;

export default function PomodoroScreen() {
  const [time, setTime] = useState(FOCUS_TIME_SECONDS);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      setTime(FOCUS_TIME_SECONDS);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const [isLocked, setIsLocked] = useState(false);
  const [blockedApps, setBlockedApps] = useState([
    { name: "logo-whatsapp", color: "#25D366", isBlocked: false },
    { name: "logo-instagram", color: "#E4405F", isBlocked: false },
    { name: "logo-youtube", color: "#FF0000", isBlocked: false },
    { name: "logo-reddit", color: "#FF4500", isBlocked: false },
  ]);

  const toggleAppBlock = (appName: string) => {
    if (isLocked) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBlockedApps(
      blockedApps.map((app) =>
        app.name === appName ? { ...app, isBlocked: !app.isBlocked } : app,
      ),
    );
  };

  return (
    <View className="flex-1 bg-[#121212] items-center justify-around p-8">
      <StatusBar barStyle="light-content" />

      <View className="items-center">
        <Text className="text-white font-bold text-2xl">Mode Focus</Text>
        <Text className="text-gray-400 text-sm">
          Restez concentré sur votre tâche
        </Text>
      </View>

      <View className="w-64 h-64 bg-gray-800/50 rounded-full items-center justify-center border-4 border-gray-700">
        <Text className="text-6xl font-thin text-white tracking-widest">
          {formatTime(time)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={toggleTimer}
        className="bg-blue-600 w-full max-w-xs rounded-full py-4 shadow-lg shadow-blue-600/50"
      >
        <Text className="text-white text-center text-xl font-bold">
          {isActive ? "Mettre en Pause" : "Lancer le mode Focus"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsLocked(!isLocked);
        }}
        className="bg-red-600 w-full max-w-xs rounded-full py-4 shadow-lg shadow-red-600/50"
      >
        <Text className="text-white text-center text-xl font-bold">
          {isLocked ? "Déverrouiller les Apps" : "Verrouiller les Apps"}
        </Text>
      </TouchableOpacity>

      <View className="items-center w-full">
        <Text className="text-gray-500 text-base mb-4">
          Applications bloquées pendant la session
        </Text>
        {isLocked && (
          <Text className="text-red-500 text-sm mt-2">
            Les applications sont verrouillées
          </Text>
        )}
        <View className="flex-row justify-center space-x-6">
          {blockedApps.map((app) => (
            <TouchableOpacity
              key={app.name}
              onPress={() => toggleAppBlock(app.name)}
              className={`w-14 h-14 bg-gray-800 rounded-2xl items-center justify-center ${
                app.isBlocked ? "opacity-30" : ""
              }`}
              style={{
                transform: [{ scale: app.isBlocked ? 0.8 : 1 }],
              }}
            >
              <Ionicons name={app.name as any} size={32} color={app.color} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row items-center opacity-60">
        <Ionicons
          name="notifications-off-circle-outline"
          size={16}
          color="gray"
        />
        <Text className="text-gray-400 text-sm ml-2">
          Notifications en pause. Restez concentré.
        </Text>
      </View>
    </View>
  );
}
