/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { lexicons } from '../../../../lexicons'
import { $Type, $Typed, is$typed, OmitKey } from '../../../../util'

export const id = 'com.atproto.repo.strongRef'

export interface Main {
  $type?: $Type<'com.atproto.repo.strongRef', 'main'>
  uri: string
  cid: string
}

export function isMain<V>(
  v: V,
): v is V extends { $type?: string }
  ? Extract<V, { $type: $Type<'com.atproto.repo.strongRef', 'main'> }>
  : V & { $type: $Type<'com.atproto.repo.strongRef', 'main'> } {
  return is$typed(v, id, 'main')
}

export function validateMain(v: unknown) {
  return lexicons.validate(`${id}#main`, v) as ValidationResult<Main>
}

export function isValidMain<V>(v: V): v is V & $Typed<Main> {
  return isMain(v) && validateMain(v).success
}
