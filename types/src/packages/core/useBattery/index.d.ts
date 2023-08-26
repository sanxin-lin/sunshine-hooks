import type { ConfigurableNavigator } from '../../types';
export interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}
export declare function useBattery({ navigator }: ConfigurableNavigator): {
    isSupported: boolean | undefined;
    charging: import("vue").Ref<boolean>;
    chargingTime: import("vue").Ref<number>;
    dischargingTime: import("vue").Ref<number>;
    level: import("vue").Ref<number>;
};
