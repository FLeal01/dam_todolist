import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { captureCurrentLocation, captureTaskPhoto } from '../src/services/devicePeripherals';

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

describe('Periféricos nativos y permisos (I2 Cámara e I3 GPS)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Indicador I2: Cámara y permisos ---
  test('I2: solicita permiso de cámara y devuelve error si el usuario lo deniega', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
      canAskAgain: false,
    } as never);

    const res = await captureTaskPhoto();

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    expect(res).toEqual({
      ok: false,
      error: 'Se necesita permiso de cámara para adjuntar una foto.',
      canAskAgain: false,
    });
  });
  test('I2: abre la cámara y devuelve la URI de la imagen cuando el permiso es concedido', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: true,
    } as never);
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file:///mock-photo.jpg' }],
    } as never);

    const res = await captureTaskPhoto();

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      ok: true,
      uri: 'file:///mock-photo.jpg',
    });
  });

  // --- Indicador I3: GPS y permisos ---
  test('I3: solicita permiso de ubicación y devuelve error si el estado no es granted', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'denied',
      canAskAgain: false,
    } as never);

    const res = await captureCurrentLocation();

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    expect(res).toEqual({
      ok: false,
      error: 'Se necesita permiso de ubicación para registrar el GPS.',
      canAskAgain: false,
    });
  });

  test('I3: obtiene latitud y longitud cuando el permiso de ubicación es concedido', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'granted',
    } as never);
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
      coords: { latitude: -39.5631, longitude: -72.0014 },
    } as never);

    const res = await captureCurrentLocation();

    expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      ok: true,
      location: { latitude: -39.5631, longitude: -72.0014 },
    });
  });
});