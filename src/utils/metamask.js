import sigUtil from "@metamask/eth-sig-util";

export function recoverSig({ signature, data }) {
  let messageParams = {};

  messageParams.signature = signature;
  messageParams.data = data;
  messageParams.version = "V4";

  return sigUtil.recoverTypedSignature(messageParams);
}
