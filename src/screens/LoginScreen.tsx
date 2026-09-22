import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrbitLogo } from "../components/OrbitLogo";
import { colors, spacing, type, weight } from "../theme/theme";

type LoginScreenProps = {
  errorMessage: string;
  isSubmitting: boolean;
  onCreateAccount: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
};

export function LoginScreen({ errorMessage, isSubmitting, onCreateAccount, onGoogleSignIn, onSignIn }: LoginScreenProps) {
  const [email, setEmail] = useState("maya@nrwholesale.co");
  const [password, setPassword] = useState("orbit-demo");
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  return (
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.safeArea}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
              {
                scale: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.985, 1],
                }),
              },
            ],
          },
        ]}
      >
        <OrbitLogo />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.copy}>Sign in to review today's reorder plan for North Ridge Wholesale.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} style={styles.input} value={email} />
        <Text style={styles.label}>Password</Text>
        <TextInput onChangeText={setPassword} secureTextEntry style={styles.input} value={password} />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TouchableOpacity disabled={isSubmitting} style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={() => onSignIn(email, password)}>
          {isSubmitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>
        <TouchableOpacity disabled={isSubmitting} style={styles.googleButton} onPress={onGoogleSignIn}>
          <GoogleMark />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={isSubmitting} style={styles.secondaryButton} onPress={() => onCreateAccount(email, password)}>
          <Text style={styles.secondaryButtonText}>Register new user</Text>
        </TouchableOpacity>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Demo workspace</Text>
          <Text style={styles.meta}>Demo email auth</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function GoogleMark() {
  return <Image source={require("../../assets/google-g.png")} style={styles.googleMark} />;
}

const styles = StyleSheet.create({
  safeArea: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.xl,
    width: "100%",
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: weight.black,
    letterSpacing: -0.8,
    marginTop: spacing.xl,
  },
  copy: {
    color: colors.muted,
    fontSize: type.bodyLarge,
    fontWeight: weight.regular,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  label: {
    color: colors.inkSoft,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    letterSpacing: 0.2,
    marginTop: spacing.lg,
  },
  input: {
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: type.bodyLarge,
    fontWeight: weight.medium,
    marginTop: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 14,
    marginTop: spacing.xl,
    paddingVertical: 15,
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonText: {
    color: colors.white,
    fontSize: type.bodyLarge,
    fontWeight: weight.heavy,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  googleButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.md,
    paddingVertical: 14,
  },
  googleButtonText: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  googleMark: {
    height: 20,
    resizeMode: "contain",
    width: 20,
  },
  error: {
    backgroundColor: "#FDECEB",
    borderRadius: 12,
    color: colors.red,
    fontSize: type.caption,
    fontWeight: weight.medium,
    lineHeight: 18,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  meta: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
  },
});
