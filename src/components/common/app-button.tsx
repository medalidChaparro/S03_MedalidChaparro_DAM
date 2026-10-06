import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
};

export const AppButton = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
}: AppButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'outline' && styles.buttonOutline,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.textBase,
          variant === 'primary' && styles.textPrimary,
          variant === 'secondary' && styles.textSecondary,
          variant === 'outline' && styles.textOutline,
          disabled && styles.textDisabled,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: theme.radius.large,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
  },

  buttonSecondary: {
    backgroundColor: colors.primarySoft,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonDisabled: {
    backgroundColor: '#F3DCE5',
    elevation: 0,
    shadowOpacity: 0,
  },

  textBase: {
    fontSize: theme.fontSize.button,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  textPrimary: {
    color: '#FFFFFF',
  },

  textSecondary: {
    color: colors.primaryDeep,
  },

  textOutline: {
    color: colors.primaryDark,
  },

  textDisabled: {
    color: '#B39AA5',
  },
});