import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import type { TaskLocation } from '../types/task';

export type CameraCaptureResult =
  | { ok: true; uri?: string }
  | { ok: false; error: string; canAskAgain?: boolean };

export type LocationCaptureResult =
  | { ok: true; location: TaskLocation }
  | { ok: false; error: string; canAskAgain?: boolean };

export async function captureTaskPhoto(): Promise<CameraCaptureResult> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return {
        ok: false,
        error: 'Se necesita permiso de cámara para adjuntar una foto.',
        canAskAgain: permission.canAskAgain,
      };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      return { ok: true, uri: result.assets[0].uri };
    }

    return { ok: true, uri: undefined };
  } catch {
    return { ok: false, error: 'No se pudo abrir la cámara en este dispositivo.' };
  }
}

export async function captureCurrentLocation(): Promise<LocationCaptureResult> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      return {
        ok: false,
        error: 'Se necesita permiso de ubicación para registrar el GPS.',
        canAskAgain: permission.canAskAgain,
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      ok: true,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch {
    return { ok: false, error: 'No se pudo obtener la ubicación GPS actual.' };
  }
}