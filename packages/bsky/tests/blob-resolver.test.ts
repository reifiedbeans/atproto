import { CID } from 'multiformats/cid'
import { cidForCbor, verifyCidForBytes } from '@atproto/common'
import { TestNetwork, basicSeed } from '@atproto/dev-env'
import { randomBytes } from '@atproto/crypto'

describe('blob resolver', () => {
  let network: TestNetwork
  let fileDid: string
  let fileCid: CID

  beforeAll(async () => {
    network = await TestNetwork.create({
      dbPostgresSchema: 'bsky_blob_resolver',
    })
    const sc = network.getSeedClient()
    await basicSeed(sc)
    await network.processAll()
    fileDid = sc.dids.carol
    fileCid = sc.posts[fileDid][0].images[0].image.ref
  })

  afterAll(async () => {
    await network.close()
  })

  it('resolves blob with good signature check.', async () => {
    const response = await fetch(
      new URL(`/blob/${fileDid}/${fileCid.toString()}`, network.bsky.url),
    )
    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toEqual('image/jpeg')
    expect(response.headers['content-security-policy']).toEqual(
      `default-src 'none'; sandbox`,
    )
    expect(response.headers['x-content-type-options']).toEqual('nosniff')

    const bytes = new Uint8Array(await response.arrayBuffer())
    await expect(verifyCidForBytes(fileCid, bytes)).resolves.toBeUndefined()
  })

  it('404s on missing blob.', async () => {
    const badCid = await cidForCbor({ unknown: true })
    const response = await fetch(
      new URL(`/blob/${fileDid}/${badCid.toString()}`, network.bsky.url),
    )
    expect(response.status).toEqual(404)
    await expect(response.json()).resolves.toEqual({
      error: 'NotFoundError',
      message: 'Blob not found',
    })
  })

  it('404s on missing identity.', async () => {
    const response = await fetch(
      new URL(`/blob/did:plc:unknown/${fileCid.toString()}`, network.bsky.url),
    )
    expect(response.status).toEqual(404)
    await expect(response.json()).resolves.toEqual({
      error: 'NotFoundError',
      message: 'Origin not found',
    })
  })

  it('400s on invalid did.', async () => {
    const response = await fetch(
      new URL(`/blob/did::/${fileCid.toString()}`, network.bsky.url),
    )
    expect(response.status).toEqual(400)
    await expect(response.json()).resolves.toEqual({
      error: 'BadRequestError',
      message: 'Invalid did',
    })
  })

  it('400s on invalid cid.', async () => {
    const response = await fetch(
      new URL(`/blob/${fileDid}/barfy`, network.bsky.url),
    )
    expect(response.status).toEqual(400)
    await expect(response.json()).resolves.toEqual({
      error: 'BadRequestError',
      message: 'Invalid cid',
    })
  })

  it('fails on blob with bad signature check.', async () => {
    await network.pds.ctx.blobstore(fileDid).delete(fileCid)
    await network.pds.ctx
      .blobstore(fileDid)
      .putPermanent(fileCid, randomBytes(100))

    const response = await fetch(
      new URL(`/blob/${fileDid}/${fileCid.toString()}`, network.bsky.url),
    )
    await expect(response.arrayBuffer()).rejects.toThrow(
      'maxContentLength size of -1 exceeded',
    )
  })
})
