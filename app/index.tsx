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
  const [blockedApps, setBlockedApps] = useState([
    { name: "logo-whatsapp", color: "#25D366", isBlocked: true },
    { name: "logo-instagram", color: "#E4405F", isBlocked: true },
    { name: "logo-youtube", color: "#FF0000", isBlocked: false },
    { name: "logo-reddit", color: "#FF4500", isBlocked: false },
  ]);

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
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsActive(!isActive);
  };

  const toggleAppBlock = (appName: string) => {
    if (isActive) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBlockedApps((prev) =>
      prev.map((app) =>
        app.name === appName ? { ...app, isBlocked: !app.isBlocked } : app,
      ),
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-[#121212] items-center justify-around p-8">
      <StatusBar barStyle="light-content" />

      <View className="items-center">
        <Text className="text-white font-bold text-2xl">
          {isActive ? "Focus en cours..." : "Prêt à travailler ?"}
        </Text>
        <Text className="text-gray-400 text-sm">
          {isActive
            ? "Ne quittez pas l'application"
            : "Choisissez vos apps à bloquer"}
        </Text>
      </View>

      <View
        className={`w-64 h-64 rounded-full items-center justify-center border-4 ${isActive ? "border-blue-500 bg-blue-500/5" : "border-gray-700 bg-gray-800/50"}`}
      >
        <Text className="text-6xl font-thin text-white tracking-widest">
          {formatTime(time)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={toggleTimer}
        className={`${isActive ? "bg-red-500/20 border border-red-500" : "bg-blue-600"} w-full max-w-xs rounded-2xl py-4 shadow-lg`}
      >
        <Text
          className={`${isActive ? "text-red-500" : "text-white"} text-center text-xl font-bold`}
        >
          {isActive ? "Abandonner la session" : "Démarrer le Focus"}
        </Text>
      </TouchableOpacity>

      <View className="items-center w-full">
        <Text className="text-gray-500 text-sm mb-6 uppercase tracking-widest">
          {isActive
            ? "🔒 Applications verrouillées"
            : "Sélectionnez les distractions"}
        </Text>

        <View className="flex-row justify-center space-x-6">
          {blockedApps.map((app) => (
            <TouchableOpacity
              key={app.name}
              disabled={isActive}
              onPress={() => toggleAppBlock(app.name)}
              className={`w-14 h-14 bg-gray-800 rounded-2xl items-center justify-center border-2 ${
                app.isBlocked
                  ? "border-blue-500"
                  : "border-transparent opacity-40"
              }`}
            >
              <Ionicons
                name={app.name as any}
                size={28}
                color={app.isBlocked ? app.color : "#666"}
              />
              {isActive && app.isBlocked && (
                <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full">
                  <Ionicons name="lock-closed" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
