import type { Ref } from 'vue';
export type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
export type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined;
export interface NetworkState {
    isSupported: Ref<boolean>;
    /**
     * If the user is currently connected.
     */
    isOnline: Ref<boolean>;
    /**
     * The time since the user was last connected.
     */
    offlineAt: Ref<number | undefined>;
    /**
     * At this time, if the user is offline and reconnects
     */
    onlineAt: Ref<number | undefined>;
    /**
     * The download speed in Mbps.
     */
    downlink: Ref<number | undefined>;
    /**
     * The max reachable download speed in Mbps.
     */
    downlinkMax: Ref<number | undefined>;
    /**
     * The detected effective speed type.
     */
    effectiveType: Ref<NetworkEffectiveType | undefined>;
    /**
     * The estimated effective round-trip time of the current connection.
     */
    rtt: Ref<number | undefined>;
    /**
     * If the user activated data saver mode.
     */
    saveData: Ref<boolean | undefined>;
    /**
     * The detected connection/network type.
     */
    type: Ref<NetworkType>;
}
/**
 * Reactive Network status.
 * @param options
 */
export declare function useNetwork(): Readonly<NetworkState>;
