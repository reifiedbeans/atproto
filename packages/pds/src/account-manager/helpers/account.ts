import { notSoftDeletedClause } from '../../db'
import { AccountDb, ActorEntry } from '../db'
import { StatusAttr } from '../../lexicon/types/com/atproto/admin/defs'

export type ActorAccount = ActorEntry & {
  email: string | null
  passwordScrypt: string | null
  emailConfirmedAt: string | null
  invitesDisabled: 0 | 1 | null
}

export const getAccount = async (
  db: AccountDb,
  handleOrDid: string,
  includeSoftDeleted = false,
): Promise<ActorAccount | null> => {
  const { ref } = db.db.dynamic
  const result = await db.db
    .selectFrom('actor')
    .leftJoin('account', 'actor.did', 'account.did')
    .if(!includeSoftDeleted, (qb) =>
      qb.where(notSoftDeletedClause(ref('actor'))),
    )
    .where((qb) => {
      if (handleOrDid.startsWith('did:')) {
        return qb.where('actor.did', '=', handleOrDid)
      } else {
        return qb.where('actor.handle', '=', handleOrDid)
      }
    })
    .selectAll('actor')
    .selectAll('account')
    .executeTakeFirst()
  return result || null
}

export const getAccountByEmail = async (
  db: AccountDb,
  email: string,
  includeSoftDeleted = false,
): Promise<ActorAccount | null> => {
  const { ref } = db.db.dynamic
  const found = await db.db
    .selectFrom('actor')
    .leftJoin('account', 'account.did', 'actor.did')
    .if(!includeSoftDeleted, (qb) =>
      qb.where(notSoftDeletedClause(ref('actor'))),
    )
    .where('email', '=', email.toLowerCase())
    .selectAll('actor')
    .selectAll('account')
    .executeTakeFirst()
  return found || null
}

export const registerActor = async (
  db: AccountDb,
  opts: {
    did: string
    handle: string
  },
) => {
  const { did, handle } = opts
  const registered = await db.db
    .insertInto('actor')
    .values({
      did,
      handle,
      createdAt: new Date().toISOString(),
    })
    .onConflict((oc) => oc.doNothing())
    .returning('did')
    .executeTakeFirst()
  if (!registered) {
    throw new Error('actor already exists')
  }
}

export const registerAccount = async (
  db: AccountDb,
  opts: {
    did: string
    email: string
    passwordScrypt: string
  },
) => {
  const { did, email, passwordScrypt } = opts
  const registered = await db.db
    .insertInto('account')
    .values({
      did,
      email: email.toLowerCase(),
      passwordScrypt,
    })
    .onConflict((oc) => oc.doNothing())
    .returning('did')
    .executeTakeFirst()
  if (!registered) {
    throw new Error('account already exists')
  }
}

export const deleteAccount = async (
  db: AccountDb,
  did: string,
): Promise<void> => {
  // Not done in transaction because it would be too long, prone to contention.
  // Also, this can safely be run multiple times if it fails.
  await db.db.deleteFrom('repo_root').where('did', '=', did).execute()
  await db.db.deleteFrom('email_token').where('did', '=', did).execute()
  await db.db.deleteFrom('refresh_token').where('did', '=', did).execute()
  await db.db.deleteFrom('account').where('account.did', '=', did).execute()
  await db.db.deleteFrom('actor').where('actor.did', '=', did).execute()
}

export const updateHandle = async (
  db: AccountDb,
  did: string,
  handle: string,
) => {
  const res = await db.db
    .updateTable('actor')
    .set({ handle })
    .where('did', '=', did)
    .whereNotExists(
      db.db.selectFrom('actor').where('handle', '=', handle).selectAll(),
    )
    .executeTakeFirst()
  if (res.numUpdatedRows < 1) {
    throw new Error('user already exists')
  }
}

export const updateEmail = async (
  db: AccountDb,
  did: string,
  email: string,
) => {
  await db.db
    .updateTable('account')
    .set({ email: email.toLowerCase(), emailConfirmedAt: null })
    .where('did', '=', did)
    .executeTakeFirst()
}

export const setEmailConfirmedAt = async (
  db: AccountDb,
  did: string,
  emailConfirmedAt: string,
) => {
  await db.db
    .updateTable('account')
    .set({ emailConfirmedAt })
    .where('did', '=', did)
    .execute()
}

export const getAccountTakedownStatus = async (
  db: AccountDb,
  did: string,
): Promise<StatusAttr | null> => {
  const res = await db.db
    .selectFrom('actor')
    .select('takedownRef')
    .where('did', '=', did)
    .executeTakeFirst()
  if (!res) return null
  return res.takedownRef
    ? { applied: true, ref: res.takedownRef }
    : { applied: false }
}

export const updateAccountTakedownStatus = async (
  db: AccountDb,
  did: string,
  takedown: StatusAttr,
) => {
  const takedownRef = takedown.applied
    ? takedown.ref ?? new Date().toISOString()
    : null
  await db.db
    .updateTable('actor')
    .set({ takedownRef })
    .where('did', '=', did)
    .executeTakeFirst()
}
