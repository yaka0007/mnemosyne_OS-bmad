/**
 * Converged onto the shared package (doc 58) — DO NOT add transport code here.
 * cartridgeSdkDrift.test.ts fails loudly on any transport reimplementation.
 * This app keeps ONE historical semantic: inferModel THROWS on a
 * { success: false } reply instead of returning it.
 */
export * from '@mnemosyne_os/cartridge-sdk';
import {
  MnemoCartridgeSDK as CartridgeSDKBase,
  type ModelInferPayload,
  type ModelInferResult,
} from '@mnemosyne_os/cartridge-sdk';

export class MnemoCartridgeSDK extends CartridgeSDKBase {
  public override async inferModel(payload: ModelInferPayload): Promise<ModelInferResult> {
    const res = await super.inferModel(payload);
    if (res && res.success === false) {
      throw new Error(res.error || 'Unknown inference error');
    }
    return res;
  }
}