import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../../components/wui-text/index.js'
import { elementStyles, resetStyles } from '../../utils/ThemeUtil.js'
import type { IWalletImage, TagType } from '../../utils/TypesUtil.js'
import '../wui-all-wallets-image/index.js'
import '../wui-tag/index.js'
import '../wui-wallet-image/index.js'
import styles from './styles.js'

@customElement('wui-list-wallet')
export class WuiListWallet extends LitElement {
  public static override styles = [resetStyles, elementStyles, styles]

  // -- State & Properties -------------------------------- //
  @property({ type: Array }) public walletImages?: IWalletImage[] = []

  @property() public imageSrc? = ''

  @property() public name = ''

  @property() public tagLabel?: 'installed' | 'qr code' | 'recent'

  @property() public tagVariant?: TagType

  @property({ type: Boolean }) public disabled = false

  @property({ type: Boolean }) public showAllWallets = false

  // -- Render -------------------------------------------- //
  public override render() {
    const textColor = this.disabled ? 'fg-300' : 'fg-100'

    return html`
      <button ?disabled=${this.disabled} ontouchstart>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color=${textColor}>${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `
  }

  // -- Private ------------------------------------------- //
  private templateAllWallets() {
    if (this.showAllWallets && this.walletImages) {
      return html`
        <wui-all-wallets-image .walletImages=${this.walletImages}> </wui-all-wallets-image>
      `
    }

    return null
  }

  private templateWalletImage() {
    if (!this.showAllWallets && this.imageSrc) {
      return html`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
      ></wui-wallet-image>`
    } else if (!this.showAllWallets && !this.imageSrc) {
      return html`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`
    }

    return null
  }

  private templateStatus() {
    if (this.tagLabel && this.tagVariant) {
      return html` <wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`
    }

    return null
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wui-list-wallet': WuiListWallet
  }
}