import { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type AppInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icon?: string;
};

export const AppInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  icon,
}: AppInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        {icon ? (
          <Text style={styles.icon}>{icon}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9FB',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: theme.radius.medium,
    paddingHorizontal: 14,
  },

  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },

  icon: {
    fontSize: 16,
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.text,
  },
});