import { JsonRpcSigner } from "@ethersproject/providers";
// BrightId Shared Types
export { BrightIdProcedureResponse, BrightIdVerificationResponse, BrightIdSponsorshipResponse } from "./brightid";

import { MultiAttestationRequest } from "@ethereum-attestation-service/eas-sdk";

// Typing for required parts of DIDKit
export type DIDKitLib = {
  verifyCredential: (vc: string, proofOptions: string) => Promise<string>;
  issueCredential: (credential: string, proofOptions: string, key: string) => Promise<string>;
  keyToDID: (method_pattern: string, jwk: string) => string;
  keyToVerificationMethod: (method_pattern: string, jwk: string) => Promise<string>;
} & { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

// rough outline of a VerifiableCredential
export type VerifiableCredential = {
  "@context": string[];
  type: string[];
  credentialSubject: {
    id: string;
    "@context": { [key: string]: string }[];
    hash?: string;
    provider?: string;
    address?: string;
    challenge?: string;
  };
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  proof: {
    type: string;
    proofPurpose: string;
    verificationMethod: string;
    created: string;
    jws: string;
  };
};

// A ProviderContext is used as a temporary storage so that providers can can share data
// between them, in case multiple VCs are requests in one http request
export type ProviderContext = {
  [key: string]: unknown;
};

// values received from client and fed into the verify route
export type RequestPayload = {
  type: string;
  types?: string[];
  address: string;
  version: string;
  proofs?: {
    [k: string]: string;
  };
  signer?: {
    challenge: VerifiableCredential;
    signature: string;
    address: string;
  };
  jsonRpcSigner?: JsonRpcSigner;
  challenge?: string;
  issuer?: string;
};

// response Object return by verify procedure
export type ChallengePayload = {
  valid: boolean;
  error?: string[];
  // This will overwrite the record presented in the Payload
  record?: {
    challenge: string;
  } & { [k: string]: string };
};

// response Object return by verify procedure
export type VerifiedPayload = {
  valid: boolean;
  error?: string[];
  // This will be combined with the ProofRecord (built from the verified content in the Payload)
  record?: { [k: string]: string };
  expiresInSeconds?: number;
};

export type CheckRequestBody = {
  payload: RequestPayload;
};

export type CheckResponseBody = {
  valid: boolean;
  type: string;
  error?: string;
  code?: number;
};

// these values are placed into a sha256 along with the IAM_PRIVATE_KEY to generate a deterministic but protected hash of the PII info
export type ProofRecord = {
  type: string;
  version: string;
  username?: string;
  email?: string;
  proofMsg?: string;
} & { [k: string]: string };

// IAM HTTP Request body types
export type ChallengeRequestBody = {
  payload: RequestPayload;
};
export type VerifyRequestBody = {
  challenge: VerifiableCredential;
  payload: RequestPayload;
};

// IAM HTTP Response body types
export type ValidResponseBody = {
  credential: VerifiableCredential;
  record?: ProofRecord;
};
export type ErrorResponseBody = {
  error?: string;
  code?: number;
};
export type CredentialResponseBody = ValidResponseBody & ErrorResponseBody;

// Issued Credential response
export type IssuedChallenge = {
  challenge: VerifiableCredential;
};
export type IssuedCredential = {
  credential: VerifiableCredential;
};

// Issued Credential and support material returned when fetching the VerifiableCredential
export type VerifiableCredentialRecord = {
  signature: string;
  challenge: VerifiableCredential;
  error?: string;
  record?: ProofRecord;
  credential?: VerifiableCredential;
  credentials?: CredentialResponseBody[];
};

export type Stamp = {
  // recordUserName: string;
  // credentialIssuer: string;
  streamId?: string; // Must not be undefined for stamps loaded from ceramic
  provider: PROVIDER_ID;
  credential: VerifiableCredential;
};

export type StampPatch = Pick<Stamp, "provider"> & Partial<Pick<Stamp, "credential">>;

export type Passport = {
  issuanceDate?: Date;
  expiryDate?: Date;
  stamps: Stamp[];
};

export type PassportLoadStatus =
  | "Success"
  | "DoesNotExist"
  | "ExceptionRaised"
  | "StampCacaoError"
  | "PassportCacaoError";

export type PassportLoadErrorDetails = {
  stampStreamIds: string[];
};

export type PassportLoadResponse = {
  passport?: Passport;
  status: PassportLoadStatus;
  errorDetails?: PassportLoadErrorDetails;
};

export type PassportAttestation = {
  multiAttestationRequest: MultiAttestationRequest[];
  nonce: number;
  fee: any;
};

export type EasPayload = {
  passport: PassportAttestation;
  signature: {
    v: number;
    r: string;
    s: string;
  };
  invalidCredentials: VerifiableCredential[];
  error?: string;
};

export type EasRequestBody = {
  nonce: number;
  credentials: VerifiableCredential[];
  dbAccessToken: string;
};

// Passport DID
export type DID = string;

export type PLATFORM_ID =
  | "Google"
  | "Ens"
  | "Poh"
  | "Twitter"
  | "POAP"
  | "Facebook"
  | "Brightid"
  | "Github"
  | "Gitcoin"
  | "Linkedin"
  | "Discord"
  | "GitPOAP"
  | "Signer"
  | "Snapshot"
  | "ETH"
  | "GtcStaking"
  | "NFT"
  | "ZkSync"
  | "Lens"
  | "GnosisSafe"
  | "Coinbase"
  | "GuildXYZ"
  | "Hypercerts"
  | "PHI"
  | "Holonym"
  | "Idena"
  | "Civic"
  | "CyberConnect";

export type PROVIDER_ID =
  | "Signer"
  | "Google"
  | "Ens"
  | "Poh"
  | "POAP"
  | "Facebook"
  | "FacebookProfilePicture"
  | "Brightid"
  | "Github"
  | "TenOrMoreGithubFollowers"
  | "FiftyOrMoreGithubFollowers"
  | "ForkedGithubRepoProvider"
  | "StarredGithubRepoProvider"
  | "FiveOrMoreGithubRepos"
  | "githubContributionActivityGte#30"
  | "githubContributionActivityGte#60"
  | "githubContributionActivityGte#120"
  | "githubAccountCreationGte#90"
  | "githubAccountCreationGte#180"
  | "githubAccountCreationGte#365"
  | "GitcoinContributorStatistics#numGrantsContributeToGte#1"
  | "GitcoinContributorStatistics#numGrantsContributeToGte#10"
  | "GitcoinContributorStatistics#numGrantsContributeToGte#25"
  | "GitcoinContributorStatistics#numGrantsContributeToGte#100"
  | "GitcoinContributorStatistics#totalContributionAmountGte#10"
  | "GitcoinContributorStatistics#totalContributionAmountGte#100"
  | "GitcoinContributorStatistics#totalContributionAmountGte#1000"
  | "GitcoinContributorStatistics#numRoundsContributedToGte#1"
  | "GitcoinContributorStatistics#numGr14ContributionsGte#1"
  | "GitcoinGranteeStatistics#numOwnedGrants#1"
  | "GitcoinGranteeStatistics#numGrantContributors#10"
  | "GitcoinGranteeStatistics#numGrantContributors#25"
  | "GitcoinGranteeStatistics#numGrantContributors#100"
  | "GitcoinGranteeStatistics#totalContributionAmount#100"
  | "GitcoinGranteeStatistics#totalContributionAmount#1000"
  | "GitcoinGranteeStatistics#totalContributionAmount#10000"
  | "GitcoinGranteeStatistics#numGrantsInEcoAndCauseRound#1"
  | "Linkedin"
  | "Discord"
  | "GitPOAP"
  | "Snapshot"
  | "SnapshotProposalsProvider"
  | "SnapshotVotesProvider"
  | "ethPossessionsGte#1"
  | "ethPossessionsGte#10"
  | "ethPossessionsGte#32"
  | "FirstEthTxnProvider"
  | "EthGTEOneTxnProvider"
  | "EthGasProvider"
  | "SelfStakingBronze"
  | "SelfStakingSilver"
  | "SelfStakingGold"
  | "CommunityStakingBronze"
  | "CommunityStakingSilver"
  | "CommunityStakingGold"
  | "NFT"
  | "ZkSync"
  | "ZkSyncEra"
  | "Lens"
  | "GnosisSafe"
  | "Coinbase"
  | "GuildMember"
  | "GuildAdmin"
  | "GuildPassportMember"
  | "Hypercerts"
  | "CyberProfilePremium"
  | "CyberProfilePaid"
  | "CyberProfileOrgMember"
  | "PHIActivitySilver"
  | "PHIActivityGold"
  | "HolonymGovIdProvider"
  | "IdenaState#Newbie"
  | "IdenaState#Verified"
  | "IdenaState#Human"
  | "IdenaStake#1k"
  | "IdenaStake#10k"
  | "IdenaStake#100k"
  | "IdenaAge#5"
  | "IdenaAge#10"
  | "CivicCaptchaPass"
  | "CivicUniquenessPass"
  | "CivicLivenessPass"
  | "Twitter"
  | "TwitterTweetGT10"
  | "TwitterFollowerGT100"
  | "TwitterFollowerGT500"
  | "TwitterFollowerGTE1000"
  | "TwitterFollowerGT5000"
  | "twitterAccountAgeGte#180"
  | "twitterAccountAgeGte#365"
  | "twitterAccountAgeGte#730"
  | "twitterTweetDaysGte#30"
  | "twitterTweetDaysGte#60"
  | "twitterTweetDaysGte#120";

export type StampBit = {
  bit: number;
  index: number;
  name: string;
};
