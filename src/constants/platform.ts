import { Platform } from 'react-native';

/**
 * True when running on iOS. Use instead of Platform.OS === 'ios'.
 */
export const IS_IOS = Platform.OS === 'ios';

/**
 * Value for KeyboardAvoidingView behavior: 'padding' on iOS, undefined on Android.
 */
export const KEYBOARD_AVOIDING_BEHAVIOR = IS_IOS ? 'padding' as const : undefined;
