import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors } from '../../constants/colors';

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Colors.primary,
  message,
  fullScreen = false,
}) => {
  const content = (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.spinnerMessage}>{message}</Text>}
    </View>
  );
  
  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }
  
  return content;
};

// Button
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];
  
  const textStyles = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    styles[`buttonText_${size}`],
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : Colors.primary} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Badge
interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
}) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], styles[`badge_${size}`]]}>
      <Text style={[styles.badgeText, styles[`badgeText_${variant}`], styles[`badgeText_${size}`]]}>
        {text}
      </Text>
    </View>
  );
};

// Card
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const content = <View style={[styles.card, style]}>{children}</View>;
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

// Divider
interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

// Empty State
interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  message,
  action,
}) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message && <Text style={styles.emptyMessage}>{message}</Text>}
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant="outline"
          size="medium"
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Spinner
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinnerMessage: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  
  // Button
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  button_primary: {
    backgroundColor: Colors.primary,
  },
  button_secondary: {
    backgroundColor: Colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  button_disabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonText_primary: {
    color: '#fff',
  },
  buttonText_secondary: {
    color: Colors.textPrimary,
  },
  buttonText_outline: {
    color: Colors.primary,
  },
  buttonText_ghost: {
    color: Colors.primary,
  },
  buttonText_small: {
    fontSize: 13,
  },
  buttonText_medium: {
    fontSize: 15,
  },
  buttonText_large: {
    fontSize: 17,
  },
  
  // Badge
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badge_primary: {
    backgroundColor: Colors.primary,
  },
  badge_secondary: {
    backgroundColor: Colors.secondary,
  },
  badge_success: {
    backgroundColor: Colors.success,
  },
  badge_warning: {
    backgroundColor: Colors.warning,
  },
  badge_error: {
    backgroundColor: Colors.error,
  },
  badge_small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badge_medium: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontWeight: '600',
  },
  badgeText_primary: {
    color: '#fff',
  },
  badgeText_secondary: {
    color: Colors.textPrimary,
  },
  badgeText_success: {
    color: '#fff',
  },
  badgeText_warning: {
    color: Colors.textPrimary,
  },
  badgeText_error: {
    color: '#fff',
  },
  badgeText_small: {
    fontSize: 11,
  },
  badgeText_medium: {
    fontSize: 13,
  },
  
  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
