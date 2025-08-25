import * as sodium from "libsodium-wrappers";

// inside component:
await sodium.ready;
const voteObj = { electionId, candidateId };
const cipher = sodium.crypto_box_seal(
  sodium.from_string(JSON.stringify(voteObj)),
  sodium.from_base64(publicKeyB64)
);
const cipherB64 = sodium.to_base64(cipher);
await fetch("/api/votes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ electionId, candidateId, encryptedVote: cipherB64 }),
});
