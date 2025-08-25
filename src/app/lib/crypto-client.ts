import sodium from "libsodium-wrappers";

export async function sodiumReady() {
  if (!sodium.ready) await sodium.ready;
  return sodium;
}

// generate keypair (admin only)
export async function generateKeyPairB64() {
  const s = await sodiumReady();
  const kp = s.crypto_box_keypair();
  return {
    publicKeyB64: s.to_base64(kp.publicKey),
    privateKeyB64: s.to_base64(kp.privateKey),
  };
}

// encrypt vote with admin public key (sealed box)
export async function sealVote(voteObj: any, adminPublicKeyB64: string) {
  const s = await sodiumReady();
  const plain = JSON.stringify(voteObj);
  const cipher = s.crypto_box_seal(
    s.from_string(plain),
    s.from_base64(adminPublicKeyB64)
  );
  return s.to_base64(cipher);
}

// admin decrypt (local) - takes cipherB64 and admin private+public keys
export async function openSealed(
  cipherB64: string,
  adminPubB64: string,
  adminPrivB64: string
) {
  const s = await sodiumReady();
  const plain = s.crypto_box_seal_open(
    s.from_base64(cipherB64),
    s.from_base64(adminPubB64),
    s.from_base64(adminPrivB64)
  );
  if (!plain) throw new Error("Decryption failed");
  return JSON.parse(s.to_string(plain));
}
