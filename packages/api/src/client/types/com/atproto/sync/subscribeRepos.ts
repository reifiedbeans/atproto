/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { $Type, $Typed, is$typed, OmitKey } from '../../../../util'
import { lexicons } from '../../../../lexicons'

export const id = 'com.atproto.sync.subscribeRepos'

/** Represents an update of repository state. Note that empty commits are allowed, which include no repo data changes, but an update to rev and signature. */
export interface Commit {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'commit'>
  /** The stream sequence number of this message. */
  seq: number
  /** DEPRECATED -- unused */
  rebase: boolean
  /** Indicates that this commit contained too many ops, or data size was too large. Consumers will need to make a separate request to get missing data. */
  tooBig: boolean
  /** The repo this event comes from. */
  repo: string
  /** Repo commit object CID. */
  commit: CID
  /** DEPRECATED -- unused. WARNING -- nullable and optional; stick with optional to ensure golang interoperability. */
  prev?: CID | null
  /** The rev of the emitted commit. Note that this information is also in the commit object included in blocks, unless this is a tooBig event. */
  rev: string
  /** The rev of the last emitted commit from this repo (if any). */
  since: string | null
  /** CAR file containing relevant blocks, as a diff since the previous repo state. */
  blocks: Uint8Array
  ops: RepoOp[]
  blobs: CID[]
  /** Timestamp of when this message was originally broadcast. */
  time: string
}

export function isCommit<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'commit'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'commit'> } {
  return is$typed(v, id, 'commit')
}

export function validateCommit(v: unknown) {
  return lexicons.validate(`${id}#commit`, v) as ValidationResult<Commit>
}

export function isValidCommit<V>(v: V): v is V & $Typed<Commit> {
  return isCommit(v) && validateCommit(v).success
}

/** Represents a change to an account's identity. Could be an updated handle, signing key, or pds hosting endpoint. Serves as a prod to all downstream services to refresh their identity cache. */
export interface Identity {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'identity'>
  seq: number
  did: string
  time: string
  /** The current handle for the account, or 'handle.invalid' if validation fails. This field is optional, might have been validated or passed-through from an upstream source. Semantics and behaviors for PDS vs Relay may evolve in the future; see atproto specs for more details. */
  handle?: string
}

export function isIdentity<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'identity'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'identity'> } {
  return is$typed(v, id, 'identity')
}

export function validateIdentity(v: unknown) {
  return lexicons.validate(`${id}#identity`, v) as ValidationResult<Identity>
}

export function isValidIdentity<V>(v: V): v is V & $Typed<Identity> {
  return isIdentity(v) && validateIdentity(v).success
}

/** Represents a change to an account's status on a host (eg, PDS or Relay). The semantics of this event are that the status is at the host which emitted the event, not necessarily that at the currently active PDS. Eg, a Relay takedown would emit a takedown with active=false, even if the PDS is still active. */
export interface Account {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'account'>
  seq: number
  did: string
  time: string
  /** Indicates that the account has a repository which can be fetched from the host that emitted this event. */
  active: boolean
  /** If active=false, this optional field indicates a reason for why the account is not active. */
  status?: 'takendown' | 'suspended' | 'deleted' | 'deactivated' | (string & {})
}

export function isAccount<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'account'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'account'> } {
  return is$typed(v, id, 'account')
}

export function validateAccount(v: unknown) {
  return lexicons.validate(`${id}#account`, v) as ValidationResult<Account>
}

export function isValidAccount<V>(v: V): v is V & $Typed<Account> {
  return isAccount(v) && validateAccount(v).success
}

/** DEPRECATED -- Use #identity event instead */
export interface Handle {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'handle'>
  seq: number
  did: string
  handle: string
  time: string
}

export function isHandle<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'handle'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'handle'> } {
  return is$typed(v, id, 'handle')
}

export function validateHandle(v: unknown) {
  return lexicons.validate(`${id}#handle`, v) as ValidationResult<Handle>
}

export function isValidHandle<V>(v: V): v is V & $Typed<Handle> {
  return isHandle(v) && validateHandle(v).success
}

/** DEPRECATED -- Use #account event instead */
export interface Migrate {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'migrate'>
  seq: number
  did: string
  migrateTo: string | null
  time: string
}

export function isMigrate<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'migrate'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'migrate'> } {
  return is$typed(v, id, 'migrate')
}

export function validateMigrate(v: unknown) {
  return lexicons.validate(`${id}#migrate`, v) as ValidationResult<Migrate>
}

export function isValidMigrate<V>(v: V): v is V & $Typed<Migrate> {
  return isMigrate(v) && validateMigrate(v).success
}

/** DEPRECATED -- Use #account event instead */
export interface Tombstone {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'tombstone'>
  seq: number
  did: string
  time: string
}

export function isTombstone<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'tombstone'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'tombstone'> } {
  return is$typed(v, id, 'tombstone')
}

export function validateTombstone(v: unknown) {
  return lexicons.validate(`${id}#tombstone`, v) as ValidationResult<Tombstone>
}

export function isValidTombstone<V>(v: V): v is V & $Typed<Tombstone> {
  return isTombstone(v) && validateTombstone(v).success
}

export interface Info {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'info'>
  name: 'OutdatedCursor' | (string & {})
  message?: string
}

export function isInfo<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'info'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'info'> } {
  return is$typed(v, id, 'info')
}

export function validateInfo(v: unknown) {
  return lexicons.validate(`${id}#info`, v) as ValidationResult<Info>
}

export function isValidInfo<V>(v: V): v is V & $Typed<Info> {
  return isInfo(v) && validateInfo(v).success
}

/** A repo operation, ie a mutation of a single record. */
export interface RepoOp {
  $type?: $Type<'com.atproto.sync.subscribeRepos', 'repoOp'>
  action: 'create' | 'update' | 'delete' | (string & {})
  path: string
  /** For creates and updates, the new record CID. For deletions, null. */
  cid: CID | null
}

export function isRepoOp<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.sync.subscribeRepos', 'repoOp'> }>
  : V & { $type: $Type<'com.atproto.sync.subscribeRepos', 'repoOp'> } {
  return is$typed(v, id, 'repoOp')
}

export function validateRepoOp(v: unknown) {
  return lexicons.validate(`${id}#repoOp`, v) as ValidationResult<RepoOp>
}

export function isValidRepoOp<V>(v: V): v is V & $Typed<RepoOp> {
  return isRepoOp(v) && validateRepoOp(v).success
}
