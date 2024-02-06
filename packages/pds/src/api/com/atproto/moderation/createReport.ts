import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.moderation.createReport({
    auth: ctx.authVerifier.accessCheckTakedown,
    rateLimit: {
      durationMs: DAY,
      points: 100,
    },
    handler: async ({ input, auth }) => {
      const requester = auth.credentials.did
      const { data: result } =
        await ctx.moderationAgent.com.atproto.moderation.createReport(
          input.body,
          {
            ...(await ctx.moderationAuthHeaders(requester)),
            encoding: 'application/json',
          },
        )
      return {
        encoding: 'application/json',
        body: result,
      }
    },
  })
}
