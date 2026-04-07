import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_HASH_KEY = 'thriya_pin_hash';
const PIN_SALT_KEY = 'thriya_pin_salt';
const USER_NAME_KEY = 'thriya_user_name';

async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin + salt
  );
}

export async function setupPin(pin: string): Promise<void> {
  const salt = await generateSalt();
  const hash = await hashPin(pin, salt);
  await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
  await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const storedHash = await SecureStore.getItemAsync(PIN_HASH_KEY);
  const storedSalt = await SecureStore.getItemAsync(PIN_SALT_KEY);

  if (!storedHash || !storedSalt) {
    return false;
  }

  const hash = await hashPin(pin, storedSalt);
  return hash === storedHash;
}

export async function hasPinConfigured(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(PIN_HASH_KEY);
  return hash !== null;
}

export async function attemptBiometric(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Thriya',
    fallbackLabel: 'Use PIN',
    disableDeviceFallback: true,
  });

  return result.success;
}

export async function saveName(name: string): Promise<void> {
  await SecureStore.setItemAsync(USER_NAME_KEY, name);
}

export async function getSavedName(): Promise<string | null> {
  return SecureStore.getItemAsync(USER_NAME_KEY);
}
