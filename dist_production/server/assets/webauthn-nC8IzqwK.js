import { generateAuthenticationOptions, verifyAuthenticationResponse, generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
const userCredentials = /* @__PURE__ */ new Map();
const rpName = "GetNexo";
const rpID = process.env.BASE_URL ? new URL(process.env.BASE_URL).hostname : "localhost";
const origin = process.env.BASE_URL || "http://localhost:4321";
async function generateWebAuthnRegistrationOptions(userId) {
  const userCredentialsList = userCredentials.get(userId) || [];
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName: `user_${userId}`,
    // In production, get from user data
    userDisplayName: `User ${userId}`,
    attestationType: "direct",
    excludeCredentials: userCredentialsList.map((cred) => ({
      id: cred.credentialID,
      type: "public-key",
      transports: cred.transports
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform"
    }
  });
  return options;
}
async function verifyWebAuthnRegistration(userId, credential) {
  const expectedChallenge = credential.challenge;
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
  if (verification.verified) {
    const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    const newCredential = {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: credential.transports
    };
    const userCredentialsList = userCredentials.get(userId) || [];
    userCredentialsList.push(newCredential);
    userCredentials.set(userId, userCredentialsList);
  }
  return { success: verification.verified };
}
async function generateWebAuthnAuthenticationOptions(userId) {
  const userCredentialsList = userCredentials.get(userId) || [];
  if (userCredentialsList.length === 0) {
    throw new Error("No credentials found for user");
  }
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: userCredentialsList.map((cred) => ({
      id: cred.credentialID,
      type: "public-key",
      transports: cred.transports
    })),
    userVerification: "preferred"
  });
  return options;
}
async function verifyWebAuthnAuthentication(userId, credential) {
  const userCredentialsList = userCredentials.get(userId) || [];
  const expectedChallenge = credential.challenge;
  const dbCredential = userCredentialsList.find((cred) => cred.credentialID === credential.id);
  if (!dbCredential) {
    return { success: false, error: "Credential not found" };
  }
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: dbCredential.credentialID,
        credentialPublicKey: dbCredential.credentialPublicKey,
        counter: dbCredential.counter,
        transports: dbCredential.transports
      }
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
  if (verification.verified) {
    dbCredential.counter = verification.authenticationInfo.newCounter;
  }
  return { success: verification.verified };
}
export {
  generateWebAuthnRegistrationOptions as a,
  verifyWebAuthnRegistration as b,
  generateWebAuthnAuthenticationOptions as g,
  verifyWebAuthnAuthentication as v
};
