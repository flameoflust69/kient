import { EventEmitter } from 'tseep'
import { ApiClient } from './api.client'
import { WsClient } from './ws.client'
import type { KientEventEmitters } from './kient.events'
import { AuthenticationEndpoint } from '@/endpoints/authentication/authentication.endpoint'
import { ChannelEndpoint } from '@/endpoints/channel/channel.endpoint'
import { ChatroomSocket } from '@/ws/chatroom/chatroom.socket'
import { ChatEndpoint } from '@/endpoints/chat/chat.endpoint'
import { ChannelSocket } from '@/ws/channel/channel.socket'
import { PrivateChannelSocket } from '@/ws/private-channel/private-channel.socket'
import { PrivateChatroomSocket } from '@/ws/private-chatroom/private-chatroom.socket'
import { PrivateLivestreamSocket } from '@/ws/private-livestream/private-livestream.socket'

interface Endpoints {
  authentication: AuthenticationEndpoint
  channel: ChannelEndpoint
  chat: ChatEndpoint
}

interface WsHandlers {
  chatroom: ChatroomSocket
  channel: ChannelSocket
  privateChatroom: PrivateChatroomSocket
  privateChannel: PrivateChannelSocket
  privateLivestream: PrivateLivestreamSocket
}

/**
 * Entry class into Kient
 *
 * @outline [2, 3]
 */
export class Kient extends EventEmitter<KientEventEmitters> {
  /** @internal */
  private _endpoints: Endpoints
  /** @internal */
  private _wsHandlers: WsHandlers
  public _apiClient: ApiClient
  public _wsClient: WsClient
  public authenticated = false

  /** @internal */
  private constructor() {
    super()
  }

  /** @internal */
  private async init() {
    this._apiClient = await ApiClient.create(this)
    this._endpoints = {
      authentication: new AuthenticationEndpoint(this),
      channel: new ChannelEndpoint(this),
      chat: new ChatEndpoint(this),
    }

    this._wsClient = new WsClient(this)
    this._wsHandlers = {
      chatroom: new ChatroomSocket(this),
      channel: new ChannelSocket(this),
      privateChatroom: new PrivateChatroomSocket(this),
      privateChannel: new PrivateChannelSocket(this),
      privateLivestream: new PrivateLivestreamSocket(this),
    }
  }

  /**
   * Creates a new instance of Kient
   */
  public static async create() {
    const kient = new Kient()
    await kient.init()
    return kient
  }

  public get api() {
    return this._endpoints
  }

  public get ws() {
    return this._wsHandlers
  }
}
